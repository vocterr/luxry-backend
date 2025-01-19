import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/middleware";
import prisma from "../prisma/prisma";


const router = Router();

router.get("/cart", authMiddleware, async (req: AuthRequest, res: Response): Promise<any> => {
    const userId = req.user?.userId;
    try {
        const cart = await prisma.cart.findUnique({
            where: {
                userId: String(userId)
            },
            include: {
                cartItems: {
                    include: {
                        product: {
                            include: {
                                image: true
                            }
                        }
                    }
                }
            }
        });
        res.json(cart);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.post("/cart", authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const cart = await prisma.cart.create({
            data: {
                userId: String(userId)
            }
        });
        res.json(cart);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});


router.post("/cartItem", authMiddleware, async (req: AuthRequest, res: Response): Promise<any> => {
    const userId = req.user?.userId;
    const { productId } = req.body;

    try {
        // Find the cart for the user
        const cart = await prisma.cart.findUnique({
            where: { userId: String(userId) },
        });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found for this user" });
        }

        // Check if the product exists
        const product = await prisma.product.findUnique({
            where: { id: String(productId) },
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Create the cart item
        const cartItem = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: product.id,
            },
        });

        res.json({ message: "Added successfully!", cartItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/cartItem/:cartId", authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const cart = await prisma.cart.findUnique({
            where: {
                userId: String(userId)
            },
            select: {
                id: true
            }
        })
        const cartItem = await prisma.cartItem.delete({
            where: {
                cartId: String(cart!.id),
                id: String(req.params.cartId)
            }
        });
        res.json("Deleting successful!");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/deleteCartItem/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const cart = await prisma.cart.findUnique({
            where: {
                userId: String(userId)
            }
        })
        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart!.id,
                productId: String(req.params.id)
            }
        });
        res.json("Deleted successfully!");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;