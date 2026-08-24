import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: { name: { contains: 'swril' } }
  });
  console.log("Found:", products);
  const products2 = await prisma.product.findMany({
    where: { name: { contains: 'swirl' } }
  });
  console.log("Found swirl:", products2);
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
