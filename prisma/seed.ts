import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  for (const id of [1, 2, 3]) {
    await prisma.service.upsert({
      where: { id },
      update: { name: `Service ${id}` },
      create: { id, name: `Service ${id}` }
    });

    await prisma.allocationState.upsert({
      where: { serviceId: id },
      update: { nextIndex: 0 },
      create: { serviceId: id, nextIndex: 0 }
    });
  }

  for (const id of [1, 2, 3, 4, 5, 6, 7, 8]) {
    await prisma.provider.upsert({
      where: { id },
      update: {
        name: `Provider ${id}`,
        monthlyQuota: 10,
        usedQuota: 0
      },
      create: {
        id,
        name: `Provider ${id}`,
        monthlyQuota: 10,
        usedQuota: 0
      }
    });
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
