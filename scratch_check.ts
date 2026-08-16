import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const slides = await prisma.slide.findMany()
  console.log('Slides in database:')
  console.log(JSON.stringify(slides, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
