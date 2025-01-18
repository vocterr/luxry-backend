import {Router, Response} from "express";
import { authMiddleware, authorize, AuthRequest } from "../middleware/middleware";
import prisma from "../prisma/prisma";

const router = Router();

router.get("/gemstones", authMiddleware, authorize, async (req: AuthRequest, res: Response) => {
    try {
        const gemstones = await prisma.gemstone.findMany();
        res.json(gemstones);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

export default router;