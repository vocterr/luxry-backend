// seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // We’ll insert 15 products via createMany
  await prisma.product.createMany({
    data: [
      {
        name: "Golden Gear Pendant",
        description: "A unique vintage-inspired pendant with visible watch gears set in a gold case, perfect for steampunk or retro looks.",
        price: 299.99,
        stock: 10,
        materialId: 1,
        gemstoneId: 1,    // forced to 1
        weight: 15.0,
        carat: 0.0,       // no real gemstone, so set to 0.0
        dimensions: "3 x 2 cm",
        style: "Steampunk",
        collectionId: null, // or set a valid collection ID if you have one
        category: "Necklace",
        certification: "",
        occasion: ["Everyday Wear", "Birthday"],
        careInstructions: "Avoid direct contact with water. Gently wipe clean with a soft cloth.",
        isFeatured: false,
        rating: 4.2
      },
      {
        name: "Royal Marquise Diamond Ring",
        description: "An ornate gold ring featuring a marquise-cut diamond surrounded by intricate filigree detailing.",
        price: 1999.99,
        stock: 5,
        materialId: 1,
        gemstoneId: 1,
        weight: 3.2,
        carat: 1.0,
        dimensions: "Ring size 7 (adjustable)",
        style: "Vintage",
        collectionId: null,
        category: "Ring",
        certification: "GIA Certified",
        occasion: ["Engagement", "Wedding", "Anniversary"],
        careInstructions: "Use mild jewelry cleaner. Store separately to avoid scratches.",
        isFeatured: true,
        rating: 4.8
      },
      {
        name: "Sapphire Blossom Ring",
        description: "A delicate rose-gold band adorned with a deep blue sapphire at its center and tiny floral engravings.",
        price: 1299.0,
        stock: 8,
        materialId: 1, // forced to 1
        gemstoneId: 1, // forced to 1
        weight: 2.5,
        carat: 1.0,    // Using 1.0 to avoid null, originally 0.8 for sapphire
        dimensions: "Ring size 6 (adjustable)",
        style: "Floral",
        collectionId: null,
        category: "Ring",
        certification: "IGI Certified",
        occasion: ["Anniversary", "Romantic Gift"],
        careInstructions: "Gently clean with a soft brush and avoid harsh chemicals.",
        isFeatured: false,
        rating: 4.5
      },
      {
        name: "Turquoise Filigree Bangle",
        description: "An elegant gold bangle with intricate filigree work, featuring small turquoise stones for a bright pop of color.",
        price: 499.0,
        stock: 12,
        materialId: 1,
        gemstoneId: 1,  // forced to 1, though it’s “turquoise” in description
        weight: 25.0,
        carat: 0.0,
        dimensions: "6.5 cm diameter",
        style: "Bohemian",
        collectionId: null,
        category: "Bangle",
        certification: "",
        occasion: ["Everyday Wear", "Casual Outings"],
        careInstructions: "Keep away from moisture. Store in a velvet pouch.",
        isFeatured: true,
        rating: 4.0
      },
      {
        name: "Midnight Diamond Halo Ring",
        description: "A sleek white-gold ring featuring a round-cut diamond encircled by smaller black diamonds, giving a dramatic contrast.",
        price: 2499.99,
        stock: 3,
        materialId: 1, // forced to 1
        gemstoneId: 1, // forced to 1
        weight: 3.1,
        carat: 1.2,
        dimensions: "Ring size 7",
        style: "Modern",
        collectionId: null,
        category: "Ring",
        certification: "GIA Certified",
        occasion: ["Engagement", "Formal"],
        careInstructions: "Polish gently with microfiber cloth. Store in a sealed jewelry box.",
        isFeatured: false,
        rating: 4.9
      },
      {
        name: "Celestial Opal Ring",
        description: "A cosmic-inspired ring in sterling silver with a shimmering opal centerpiece and tiny star engravings on the band.",
        price: 349.99,
        stock: 15,
        materialId: 1, // forced to 1
        gemstoneId: 1, // forced to 1
        weight: 2.0,
        carat: 1.0,    // originally 0.5 for opal
        dimensions: "Ring size 6",
        style: "Minimalist",
        collectionId: null,
        category: "Ring",
        certification: "",
        occasion: ["Birthday", "Everyday Wear"],
        careInstructions: "Avoid direct sunlight for long periods. Clean with mild soap and water.",
        isFeatured: false,
        rating: 4.3
      },
      {
        name: "Vintage Heart Locket Necklace",
        description: "A silver heart locket engraved with floral patterns, opening to hold small photos or keepsakes.",
        price: 129.0,
        stock: 20,
        materialId: 1,   // forced to 1
        gemstoneId: 1,   // forced to 1
        weight: 10.0,
        carat: 0.0,
        dimensions: "2 x 2 cm pendant, 45 cm chain",
        style: "Vintage",
        collectionId: null,
        category: "Necklace",
        certification: "",
        occasion: ["Romantic Gift", "Birthday"],
        careInstructions: "Keep the interior dry to protect photos. Polish gently with soft cloth.",
        isFeatured: false,
        rating: 4.0
      },
      {
        name: "Rose Gold Twisted Ring",
        description: "A simple yet elegant twisted-band ring in rose gold, perfect for stacking or wearing alone for a minimalist look.",
        price: 99.99,
        stock: 25,
        materialId: 1,  // forced to 1
        gemstoneId: 1,  // forced to 1
        weight: 1.2,
        carat: 0.0,
        dimensions: "Ring size 5-9 (various)",
        style: "Minimalist",
        collectionId: null,
        category: "Ring",
        certification: "",
        occasion: ["Everyday Wear", "Gift"],
        careInstructions: "Remove before showering or swimming.",
        isFeatured: false,
        rating: 4.1
      },
      {
        name: "Emerald Bloom Ring",
        description: "A yellow-gold ring showcasing a vibrant emerald at the center with delicate leaf motifs on each side.",
        price: 1799.5,
        stock: 7,
        materialId: 1,
        gemstoneId: 1, // forced to 1
        weight: 2.8,
        carat: 1.0,    // originally 0.9
        dimensions: "Ring size 6",
        style: "Nature-Inspired",
        collectionId: null,
        category: "Ring",
        certification: "GIA Certified",
        occasion: ["Engagement", "Anniversary"],
        careInstructions: "Gently wipe with a soft cloth. Avoid abrasives.",
        isFeatured: true,
        rating: 4.7
      },
      {
        name: "Intricate Topaz Ring",
        description: "A lavish gold ring with a sky-blue topaz, surrounded by filigree patterns and tiny accent stones along the band.",
        price: 899.0,
        stock: 10,
        materialId: 1,
        gemstoneId: 1, // forced to 1
        weight: 3.0,
        carat: 1.0,    // originally 1.2
        dimensions: "Ring size 7",
        style: "Vintage",
        collectionId: null,
        category: "Ring",
        certification: "",
        occasion: ["Wedding", "Anniversary"],
        careInstructions: "Wash with mild soap and lukewarm water only.",
        isFeatured: false,
        rating: 4.4
      },
      {
        name: "Silver Peridot Flower Bracelet",
        description: "A charming silver bracelet featuring dainty flower-shaped settings of bright green peridot stones.",
        price: 259.0,
        stock: 15,
        materialId: 1,
        gemstoneId: 1, // forced to 1
        weight: 12.0,
        carat: 1.0,    // forced to 1.0
        dimensions: "18 cm length (adjustable)",
        style: "Floral",
        collectionId: null,
        category: "Bracelet",
        certification: "",
        occasion: ["Spring Celebrations", "Birthday"],
        careInstructions: "Dry thoroughly after cleaning to avoid tarnish.",
        isFeatured: false,
        rating: 4.0
      },
      {
        name: "Platinum Eternity Band",
        description: "A timeless platinum ring with a full circle of small round-cut diamonds, symbolizing eternal love.",
        price: 2999.99,
        stock: 4,
        materialId: 1,  // forced to 1
        gemstoneId: 1,  // forced to 1
        weight: 3.5,
        carat: 1.0,     // originally 1.5
        dimensions: "Ring size 6-8 (various)",
        style: "Classic",
        collectionId: null,
        category: "Ring",
        certification: "GIA Certified",
        occasion: ["Wedding", "Anniversary"],
        careInstructions: "Keep away from harsh chemicals. Regularly check settings for loose stones.",
        isFeatured: true,
        rating: 4.9
      },
      {
        name: "Modern Geometric Gold Ring",
        description: "A bold statement ring in 18k gold with angular geometric cutouts, perfect for a contemporary style.",
        price: 699.99,
        stock: 9,
        materialId: 1,  // forced to 1
        gemstoneId: 1,  // forced to 1
        weight: 4.5,
        carat: 0.0,
        dimensions: "Ring size 7",
        style: "Modern",
        collectionId: null,
        category: "Ring",
        certification: "",
        occasion: ["Fashion Statement"],
        careInstructions: "Wipe with a dry, lint-free cloth. Avoid abrasive surfaces.",
        isFeatured: false,
        rating: 4.1
      },
      {
        name: "Twisted White Gold Wedding Band",
        description: "A graceful white-gold wedding band with a subtle twisted rope design, symbolic of unity and strength.",
        price: 549.99,
        stock: 12,
        materialId: 1,  // forced to 1
        gemstoneId: 1,  // forced to 1
        weight: 2.2,
        carat: 0.0,
        dimensions: "Ring size 6-10 (various)",
        style: "Classic",
        collectionId: null,
        category: "Ring",
        certification: "",
        occasion: ["Wedding"],
        careInstructions: "Clean gently with a specialized white-gold cleaner.",
        isFeatured: false,
        rating: 4.3
      },
      {
        name: "Regal Ruby Cocktail Ring",
        description: "An eye-catching gold cocktail ring showcasing a vibrant ruby with small diamond accents around the setting.",
        price: 1899.99,
        stock: 6,
        materialId: 1,  // forced to 1
        gemstoneId: 1,  // forced to 1
        weight: 4.0,
        carat: 1.0,     // originally 1.4
        dimensions: "Ring size 7",
        style: "Statement",
        collectionId: null,
        category: "Ring",
        certification: "GIA Certified",
        occasion: ["Cocktail Party", "Anniversary"],
        careInstructions: "Polish with a soft cloth. Avoid contact with harsh chemicals.",
        isFeatured: true,
        rating: 4.8
      }
    ],
  });

  console.log("Seed data inserted successfully!");
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
