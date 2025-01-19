import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";
import { authMiddleware, authorize, AuthRequest } from "../middleware/middleware";
import { upload } from "../utils/multer";
import { Product } from "@prisma/client";

const router = Router();


router.get("/carousel", async (req: Request, res: Response) => {
    const {collectionName} = req.query
    try {
        const products = await prisma.product.findMany({
            where: {
                collection: {
                    name: String(collectionName)
                }
            },
            take: 6,
            include: {
                image: true
            }
        });
        res.json(products);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});




router.get("/products", async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            take: 15,
            include: {
                image: true
            }
        });
        res.json(products);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/product/:id", async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.findFirst({
            where: {
                id: String(req.params.id)
            },
            include: {
                material: true,
                collection: true,
                gemstone: true,
                image: true
            }
        });
        res.json(product);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.post("/create-product", authMiddleware, authorize, upload.single("image"), async (req: AuthRequest, res: Response): Promise<any> => {
    const userId = req.user?.userId;
    const product = JSON.parse(req.body.product);
    
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required." });
        }

        const imageUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`
        
        const createdProduct = await prisma.product.create({
            data: {
              name: product.name,
              description: product.description,
              price: product.price,
              stock: product.stock,
              material: {
                connect: { id: product.materialId }, // Connect existing material
              },
              gemstone: product.gemstone
                ? {
                    connect: { id: product.gemstoneId }, // Connect existing gemstone if provided
                  }
                : undefined,
              
              weight: product.weight,
              carat: product.carat,
              dimensions: product.dimensions,
              style: product.style,
              category: product.category,
              certification: product.certification,
              occasion: product.occasion,
              careInstructions: product.careInstructions,
              image: {
                create: {
                  url: imageUrl,
                  altText: `Image for ${product.name}`, // Optional alt text
                },
              },
              isFeatured: product.isFeatured,
              rating: product.rating,
              createdAt: product.createdAt || new Date(),
              updatedAt: new Date(),
            },
          });
        res.json(createdProduct);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});


router.get("/manageProducts", authMiddleware, authorize, async (req: AuthRequest, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            take: 15,
            include: {
                image: true
            }
        });
        res.json(products);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/searchProducts", async (req: Request, res: Response) => {
    const {search} = req.query;
    const searchString = search?.toString();

    try {
        const products = await prisma.product.findMany({
            where: searchString
              ? {
                  OR: [
                    { name: { contains: searchString } },
                    { description: { contains: searchString } },
                    { category: { contains: searchString } },
                    { collection: { name: { contains: searchString } } },
                    { material: { name: { contains: searchString } } },
                    { style: { contains: searchString } },
                  ]
                }
              : {} ,
              include: {
                image: true
              } // returns all products if search string is empty
        });
        
        
        res.json(products);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/sortedProducts", async (req: Request, res: Response) => {
    const {sort} = req.query;
    try {
        let products: Product[] = [];
        if (sort === "mostPopular") {
            products = await prisma.product.findMany({
                orderBy: {
                    cartItems: {
                        _count: "desc"
                    }
                },
                include: {
                    image: true
                }
            });
        }
        else if (sort === "priceLowHigh") {
            products = await prisma.product.findMany({
                orderBy: {
                    price: "asc"
                },
                include: {
                    image: true
                }
            })
        } 
        else if (sort === "priceHighLow") {
            products = await prisma.product.findMany({
                orderBy: {
                    price: "desc"
                },
                include: {
                    image: true
                }
            })
        }  
        else if (sort === "newest") {
            products = await prisma.product.findMany({
                orderBy: {
                    updatedAt: "desc"
                },
                include: {
                    image: true
                }
            })
        }
        else if (sort === "oldest") {
            products = await prisma.product.findMany({
                orderBy: {
                    updatedAt: "asc"
                },
                include: {
                    image: true
                }
            })
        }
        res.json(products);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/productsCount", authMiddleware, authorize, async (req: Request, res: Response) => {
    try {
        const productsCount = await prisma.product.count();
        res.json(productsCount);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.patch("/updateMainInfo/:id", authMiddleware, authorize, async (req: AuthRequest, res: Response) => {
    const {name, description, price, stock} = req.body;
    try {
        const product = await prisma.product.update({
            where: {
                id: String(req.params.id)
            },
            data: {
                name,
                description,
                price,
                stock
            }
        });
        res.json("Updating successful!");
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});
export default router;