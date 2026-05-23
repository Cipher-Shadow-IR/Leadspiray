import { Prisma, PrismaClient } from "@prisma/client";
import {
  getFairProviderPool,
  getMandatoryProviderIds,
  PROVIDERS_PER_LEAD
} from "@/lib/allocation-rules";
import type { CreateLeadInput } from "@/lib/validation";

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export class DuplicateLeadError extends Error {
  constructor() {
    super("A lead with this phone number already exists for the selected service.");
    this.name = "DuplicateLeadError";
  }
}

export class InsufficientQuotaError extends Error {
  constructor() {
    super("Not enough provider quota is available to assign exactly 3 providers.");
    this.name = "InsufficientQuotaError";
  }
}

async function assignProvider(
  tx: TransactionClient,
  leadId: number,
  providerId: number,
  assignedProviderIds: Set<number>
) {
  if (assignedProviderIds.has(providerId)) {
    return false;
  }

  const quotaIncremented = await tx.$executeRaw`
    UPDATE "Provider"
    SET "usedQuota" = "usedQuota" + 1, "updatedAt" = NOW()
    WHERE "id" = ${providerId}
      AND "usedQuota" < "monthlyQuota"
  `;

  if (quotaIncremented !== 1) {
    return false;
  }

  await tx.leadAssignment.create({
    data: {
      leadId,
      providerId
    }
  });

  assignedProviderIds.add(providerId);
  return true;
}

export async function createLeadAndAllocate(
  prisma: PrismaClient,
  input: CreateLeadInput
) {
  const maxAttempts = 15;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await runAllocationTransaction(prisma, input);
    } catch (error) {
      const isSerializationFailure =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P2034" ||
         (error.code === "P2010" && error.message.includes("40001")) ||
         error.message.includes("could not serialize"));

      if (isSerializationFailure && attempt < maxAttempts) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.floor(Math.random() * 150) + 50)
        );
        continue;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new DuplicateLeadError();
      }

      throw error;
    }
  }

  throw new Error("Failed to allocate lead after transaction retries.");
}

async function runAllocationTransaction(
  prisma: PrismaClient,
  input: CreateLeadInput
) {
  return prisma.$transaction(
    async (tx) => {
      const service = await tx.service.findUnique({
        where: { id: input.serviceId },
        select: { id: true }
      });

      if (!service) {
        throw new Error("Selected service does not exist.");
      }

      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${input.serviceId})`;

      const lead = await tx.lead.create({
        data: {
          name: input.name,
          phone: input.phone,
          city: input.city,
          description: input.description,
          serviceId: input.serviceId
        }
      });

      const assignedProviderIds = new Set<number>();
      const mandatoryProviderIds = getMandatoryProviderIds(input.serviceId);

      for (const providerId of mandatoryProviderIds) {
        await assignProvider(
          tx,
          lead.id,
          providerId,
          assignedProviderIds
        );
      }

      const fairPool = getFairProviderPool(input.serviceId);
      const allocationState = await tx.allocationState.upsert({
        where: { serviceId: input.serviceId },
        update: {},
        create: { serviceId: input.serviceId, nextIndex: 0 }
      });

      let cursor = allocationState.nextIndex % fairPool.length;
      let attempts = 0;

      while (
        assignedProviderIds.size < PROVIDERS_PER_LEAD &&
        attempts < fairPool.length
      ) {
        const providerId = fairPool[cursor];
        await assignProvider(tx, lead.id, providerId, assignedProviderIds);
        cursor = (cursor + 1) % fairPool.length;
        attempts += 1;
      }

      if (assignedProviderIds.size !== PROVIDERS_PER_LEAD) {
        throw new InsufficientQuotaError();
      }

      await tx.allocationState.update({
        where: { serviceId: input.serviceId },
        data: { nextIndex: cursor }
      });

      return tx.lead.findUniqueOrThrow({
        where: { id: lead.id },
        include: {
          service: true,
          assignments: {
            include: { provider: true },
            orderBy: { id: "asc" }
          }
        }
      });
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5000,
      timeout: 10000
    }
  );
}
