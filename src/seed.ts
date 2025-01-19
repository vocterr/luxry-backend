import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Fetch all products (assuming there are 15 products already in the database)
  const products = await prisma.product.findMany();

  // Ensure there are 15 products
  if (products.length < 15) {
    throw new Error('You need at least 15 products in the database to seed images.');
  }

  // Define the image data based on the file names
  const imageFiles = [
    '1.jpg',
    '2.jpg',
    '3.avif',
    '4.jpg',
    '5.jpg',
    '6.jpg',
    '7.avif',
    '8.jpg',
    '9.jpg',
    '10.jpg',
    '11.jpg',
    '12.jpg',
    '13.jpg',
    '14.jpg',
    '15.jpg',
  ];

  // Map each product to an image
  const imageData = products.map((product, index) => ({
    url: imageFiles[index],
    altText: 'photo',
    productId: product.id,
  }));

  // Seed the Image model
  for (const image of imageData) {
    await prisma.image.create({
      data: image,
    });
  }

  console.log('Images have been seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
