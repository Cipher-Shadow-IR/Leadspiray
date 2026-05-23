import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database verification...");

  const providerCount = await prisma.provider.count();
  const serviceCount = await prisma.service.count();
  const leadCount = await prisma.lead.count();
  const leadAssignmentCount = await prisma.leadAssignment.count();
  const webhookEventCount = await prisma.webhookEvent.count();
  const allocationStateCount = await prisma.allocationState.count();

  console.log("Database Row Counts:");
  console.log(`- Providers: ${providerCount} (Expected: 8)`);
  console.log(`- Services: ${serviceCount} (Expected: 3)`);
  console.log(`- Leads: ${leadCount} (Expected: 0)`);
  console.log(`- Lead Assignments: ${leadAssignmentCount} (Expected: 0)`);
  console.log(`- Webhook Events: ${webhookEventCount} (Expected: 0)`);
  console.log(`- Allocation States: ${allocationStateCount} (Expected: 3)`);

  let hasErrors = false;

  if (providerCount !== 8) {
    console.error(`ERROR: Provider count is ${providerCount}, expected 8.`);
    hasErrors = true;
  }

  if (serviceCount !== 3) {
    console.error(`ERROR: Service count is ${serviceCount}, expected 3.`);
    hasErrors = true;
  }

  if (leadCount !== 0) {
    console.error(`ERROR: Lead count is ${leadCount}, expected 0.`);
    hasErrors = true;
  }

  if (leadAssignmentCount !== 0) {
    console.error(`ERROR: LeadAssignment count is ${leadAssignmentCount}, expected 0.`);
    hasErrors = true;
  }

  if (webhookEventCount !== 0) {
    console.error(`ERROR: WebhookEvent count is ${webhookEventCount}, expected 0.`);
    hasErrors = true;
  }

  // Verify Provider Quotas
  const providers = await prisma.provider.findMany();
  for (const provider of providers) {
    if (provider.monthlyQuota !== 10 || provider.usedQuota !== 0) {
      console.error(
        `ERROR: Provider ${provider.name} (ID: ${provider.id}) has invalid quota config: monthlyQuota = ${provider.monthlyQuota}, usedQuota = ${provider.usedQuota}. Expected: monthlyQuota = 10, usedQuota = 0.`
      );
      hasErrors = true;
    }
  }

  // Verify Allocation States
  const allocationStates = await prisma.allocationState.findMany();
  for (const state of allocationStates) {
    if (state.nextIndex !== 0) {
      console.error(
        `ERROR: AllocationState for serviceId ${state.serviceId} has nextIndex = ${state.nextIndex}, expected 0.`
      );
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error("Database verification FAILED!");
    process.exit(1);
  } else {
    console.log("Database verification PASSED! Clean production submission state achieved.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
