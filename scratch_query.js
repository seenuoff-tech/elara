const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany();
  console.log('Orders in DB:', orders.length);
  if (orders.length > 0) {
    console.log(orders[0]);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
