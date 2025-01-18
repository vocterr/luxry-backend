import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/middleware";
import prisma from "../prisma/prisma";

const router = Router();

router.get("/wishlist", authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const wishlist = await prisma.wishlist.findUnique({
            where: {
                userId: String(userId)
            },
            include: {
                wishlistItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
        res.json(wishlist)
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.post("/wishlistItem", authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const {productId} = req.body;
    try {
        const wishlist = await prisma.wishlist.findUnique({
            where: {
                userId
            }
        })
        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                wishlistId: wishlist!.id,
                productId: String(productId)
                
            }
        });
        res.json("Added successfully!");
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.delete("/wishlistItem/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    try {
        const wishlist = await prisma.wishlist.findUnique({
            where: {
                userId: String(userId)
            }
        })
        const product = await prisma.product.findUnique({
            where: {
                id: String(req.params.id)
            }
        });
        await prisma.wishlistItem.deleteMany({
            where: {
                productId: product!.id,
                wishlistId: wishlist!.id
            }
        })
        res.json("deleting successful!");
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
})

export default router;