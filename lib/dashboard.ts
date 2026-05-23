import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const providers = await prisma.provider.findMany({
    orderBy: { id: "asc" },
    include: {
      assignments: {
        orderBy: { createdAt: "desc" },
        include: {
          lead: {
            include: {
              service: true
            }
          }
        }
      }
    }
  });

  return providers.map((provider) => ({
    id: provider.id,
    name: provider.name,
    monthlyQuota: provider.monthlyQuota,
    usedQuota: provider.usedQuota,
    remainingQuota: provider.monthlyQuota - provider.usedQuota,
    leadsReceivedCount: provider.assignments.length,
    leads: provider.assignments.map((assignment) => ({
      assignmentId: assignment.id,
      leadId: assignment.lead.id,
      customerName: assignment.lead.name,
      phone: assignment.lead.phone,
      city: assignment.lead.city,
      description: assignment.lead.description,
      serviceName: assignment.lead.service.name,
      assignedAt: assignment.createdAt.toISOString(),
      createdAt: assignment.lead.createdAt.toISOString()
    }))
  }));
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export async function getDashboardRevision() {
  const rows = await prisma.$queryRaw<Array<{ revision: string | null }>>`
    SELECT GREATEST(
      COALESCE((SELECT MAX("updatedAt") FROM "Provider"), 'epoch'::timestamp),
      COALESCE((SELECT MAX("updatedAt") FROM "Lead"), 'epoch'::timestamp),
      COALESCE((SELECT MAX("updatedAt") FROM "LeadAssignment"), 'epoch'::timestamp)
    )::text AS revision
  `;

  return rows[0]?.revision ?? "epoch";
}
