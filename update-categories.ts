import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.category.updateMany({
    where: { name: 'Pendants' },
    data: { image: '/images/silver_necklace.png' }
  });
  await prisma.category.updateMany({
    where: { name: 'Silver Chains' }, // or Chains
    data: { image: '/images/chains.png' }
  });
  await prisma.category.updateMany({
    where: { name: 'Chains' },
    data: { image: '/images/chains.png' }
  });
  console.log("Categories updated.");
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
