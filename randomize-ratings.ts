import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting product randomization...');
  const products = await prisma.product.findMany();
  
  let count = 0;
  for (const product of products) {
    // Generate random rating between 4.5 and 4.8 (1 decimal place)
    // Math.random() gives 0 to 0.999. We want 0, 0.1, 0.2, 0.3
    const randomRatingOffset = Math.floor(Math.random() * 4) / 10;
    const rating = 4.5 + randomRatingOffset;
    
    // Generate random reviews between 10 and 30
    const reviews = Math.floor(Math.random() * 21) + 10;
    
    await prisma.product.update({
      where: { id: product.id },
      data: {
        rating,
        reviews
      }
    });
    count++;
  }
  
  console.log(`Successfully updated ${count} products with random ratings and review counts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
