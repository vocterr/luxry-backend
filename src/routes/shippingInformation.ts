import { Router, Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/middleware";
import prisma from "../prisma/prisma";


const router = Router();

router.get('/shippingInformation', authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const shippingInformation = await prisma.shippingInformation.findUnique({
            where: {
                userId: String(userId)
            }
        });
        res.json(shippingInformation);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.patch("/shippingInformation", authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { shippingInformation } = req.body;
    try {
        const updatedShippingInformation = await prisma.shippingInformation.update({
            data: shippingInformation,
            where: {
                userId: String(userId)
            }
        });
        res.json("Updated Informations successfully!");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
})


export default router;