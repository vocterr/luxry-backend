import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { authMiddleware } from "../middleware/middleware";

const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<any> => {
    const {name, email, password} = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (user) return res.status(400).json({error: "User already exists"});
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                shippingInformation: {
                    create: {}
                },
                wishlist: {
                    create: {}
                },
                cart: {
                    create: {}
                }
            }
        });
        const { password: _, ...userWithoutPassword } = newUser;

        return res.status(201).json(userWithoutPassword);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.post("/login", async (req: Request, res: Response): Promise<any> => {
    const { email, password} = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) return res.status(404).json({error: "User doesnt exist"});
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({error: "Invalid credentials"});

        const token = jwt.sign({userId: user.id}, "1234", );
        res.cookie("token", token);
        res.json(token);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.post("/logout", async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.json("Logged out successully!");
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
})

export default router;