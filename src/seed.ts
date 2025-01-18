import prisma from './prisma/prisma';

async function main() {
  // Fetch the Winter Elegance collection
  const collection = await prisma.collection.findFirst({
    where: {
        name: "Winter Elegance"
    }
  });

  if (!collection) {
    console.error('Winter Elegance collection not found. Please create it first.');
    process.exit(1);
  }

  // Fetch materials and gemstones to associate with products
  const materials = await prisma.material.findMany();
  const gemstones = await prisma.gemstone.findMany();

  if (materials.length === 0 || gemstones.length === 0) {
    console.error('Materials or gemstones are missing. Please create them first.');
    process.exit(1);
  }

  // Create 15 products
  const products = Array.from({ length: 15 }).map((_, index) => ({
    name: `Elegant Jewelry Piece ${index + 1}`,
    description: `A luxurious jewelry piece crafted with premium materials and exquisite gemstones. Perfect for any occasion.`,
    price: parseFloat((1000 + Math.random() * 4000).toFixed(2)), // Price between 1000 and 5000
    stock: Math.floor(Math.random() * 20) + 1, // Stock between 1 and 20
    materialId: materials[index % materials.length].id, // Assign materials in a round-robin fashion
    gemstoneId: gemstones[index % gemstones.length]?.id || null, // Assign gemstones in a round-robin fashion
    weight: parseFloat((50 + Math.random() * 100).toFixed(2)), // Random weight between 50g and 150g
    carat: index % 3 === 0 ? parseFloat((1.0 + Math.random() * 3.0).toFixed(2)) : null, // Carat for 1/3 of the products
    dimensions: `2x2x${(Math.random() * 3).toFixed(1)} cm`, // Random dimensions
    style: index % 2 === 0 ? 'Vintage' : 'Modern', // Alternate between Vintage and Modern
    category: index % 2 === 0 ? 'Necklace' : 'Bracelet', // Alternate between Necklace and Bracelet
    certification: index % 3 === 0 ? 'GIA Certified' : null, // Certification for 1/3 of the products
    occasion: ['Wedding', 'Anniversary', 'Party'], // Example occasions
    careInstructions: 'Clean with a soft cloth and store in a dry place.', // Care instructions
    collectionId: collection.id, // Associate with the Winter Elegance collection
    isFeatured: index % 5 === 0, // Every 5th product is featured
    rating: parseFloat((4 + Math.random()).toFixed(1)), // Random rating between 4.0 and 5.0
    images: {
      create: [
        {
          url: `https://via.placeholder.com/300?text=Product+${index + 1}`, // Placeholder image URL
          altText: `Elegant Jewelry Piece ${index + 1}`,
        },
      ],
    },
  }));

  // Seed products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('15 products seeded successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
