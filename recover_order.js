const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.order.create({
    data: {
      orderNumber: 'ELARA-130997',
      customerName: 'Skenetic Digital', // Guessed from email
      email: 'skeneticdigital@gmail.com',
      phone: 'Unknown',
      address: 'Unknown',
      city: 'Unknown',
      state: 'Unknown',
      pincode: 'Unknown',
      totalAmount: 0, // Since we don't know the exact amount they paid
      paymentMethod: 'cod',
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
      items: {
        create: [
          {
            productId: 'unknown',
            name: 'Recovered Item',
            price: 0,
            quantity: 1,
            size: '',
          }
        ]
      }
    }
  });
  console.log('Order recovered successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
