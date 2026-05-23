import { PrismaClient } from "@prisma/client";
import { createLeadAndAllocate } from "@/lib/allocation";
import type { CreateLeadInput } from "@/lib/validation";

export function createLead(prisma: PrismaClient, input: CreateLeadInput) {
  return createLeadAndAllocate(prisma, input);
}
