import { Router, Request, Response } from "express";
import { authMiddleware, authorize, AuthRequest } from "../middleware/middleware";
import prisma from "../prisma/prisma";
import bcrypt from "bcryptjs";


const router = Router();


router.get("/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: String(userId)
            },
            select: {
                name: true,
                email: true,
                orders: {
                    select: {
                        totalAmount: true
                    }
                },
                shippingInformation: true,
                password: true
            }
        });
        res.json(user);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.patch("/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const {name, email, password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await prisma.user.update({
            where: {
                id: String(userId)
            },
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        res.json("Updating user successful!");
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/usersCount", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const usersCount = await prisma.user.count();
        res.json(usersCount);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/manageUsers", authMiddleware, authorize, async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            take: 15
        });
        res.json(users);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.delete("/deleteUserAdmin/:userId", authMiddleware, authorize, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: String(req.params.userId)
            }
        });
        res.json("Deleting user successful!");
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.patch("/updateRoleAdmin/:userId", authMiddleware, authorize, async (req: AuthRequest, res: Response) => {
    const {role} = req.body;
    try {
        const user = await prisma.user.update({
            where: {
                id: String(req.params.userId)
            },
            data: {
                role
            }
        });
        res.json("User role updated successfully!");
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/userRole", authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const role = await prisma.user.findUnique({
            where: {
                id: String(userId)
            },
            select: {
                role: true
            }
        });
        res.json(role);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
})

export default router;