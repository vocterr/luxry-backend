import {Router, Response} from "express";
import { authMiddleware, authorize, AuthRequest } from "../middleware/middleware";
import prisma from "../prisma/prisma";

const router = Router();

router.get("/materials", authMiddleware, authorize, async (req: AuthRequest, res: Response) => {
    try {
        const materials = await prisma.material.findMany();
        res.json(materials);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

export default router;