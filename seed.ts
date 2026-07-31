import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categoriesCount = await prisma.category.count();
  if (categoriesCount === 0) {
    console.log("Seeding categories...");
    await prisma.category.createMany({
      data: [
        { name: 'Rings', description: 'Handcrafted silver rings', status: 'Active', productsCount: 45, image: '/images/cat_rings.png' },
        { name: 'Bracelets', description: 'Minimalist cuffs and chains', status: 'Active', productsCount: 18, image: '/images/silver_bracelet.png' },
        { name: 'Pendants', description: 'Elegant silver necklaces', status: 'Active', productsCount: 32, image: '/images/silver_necklace.png' },
        { name: 'Earrings', description: 'Timeless drops and studs', status: 'Active', productsCount: 24, image: '/images/cat_earrings.png' },
        { name: 'Men In Silver', description: 'Silver accessories for men', status: 'Active', productsCount: 15, image: '/images/silver_rings.png' },
        { name: 'Sets', description: 'Matching jewelry sets', status: 'Active', productsCount: 8, image: '/images/cat_necklaces.png' },
        { name: 'Anklets', description: 'Beautiful silver anklets', status: 'Active', productsCount: 12, image: '/images/cat_rings.png' },
        { name: 'Silver Chains', description: 'Classic silver chains', status: 'Active', productsCount: 20, image: '/images/silver_necklace.png' },
      ]
    });
  }

  const faqsCount = await prisma.faq.count();
  if (faqsCount === 0) {
    console.log("Seeding FAQs...");
    await prisma.faq.createMany({
      data: [
        { key: 'size', question: 'Find Ring Size', answer: 'Our bands conform to standard US sizing. To discover your fit, measure the inner circumference of a current ring in millimeters, or wrap a thread around the base of your finger. We can also dispatch a complimentary physical ring sizer casing.' },
        { key: 'finish', question: 'Bespoke Finishes', answer: 'We provide Glossy Chrome (mirror reflection), Satin Matte (velvety luster), and Vintage Oxidized (antique shadow grooves) variants. You can preview these in real time on our Bespoke Customizer page segment.' },
        { key: 'care', question: 'Silver Care Guide', answer: 'Sterling silver requires simple care to avoid tarnish. Store pieces in dry velvet enclosures, avoid contact with chemical spray, and clean using our micro-fiber polishing cloths. Our rhodium plating acts as a highly durable tarnish barrier.' },
        { key: 'consult', question: 'Book Consultation', answer: 'Certainly. Please submit your email in our Patron Concierge block at the bottom of the page, and a private client advisor will coordinate a personal showroom scheduling consultation.' }
      ]
    });
  }
  
  console.log("Seeding finished.");
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
