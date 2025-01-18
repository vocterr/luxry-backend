import {Router, Request, Response} from "express";
import nodemailer from "nodemailer";
import prisma from "../prisma/prisma";
import bcrypt from "bcryptjs"

const router = Router();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "vocterdev@gmail.com",
        pass: "mkou idzw lxjw zezd",
    }
})


router.post("/send-pin", async (req: Request, res: Response): Promise<any> => {
    const {email} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const pin = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.user.update({
            where: {
                email
            },
            data: {
                resetPin: pin,
                resetPinExpires: new Date(Date.now() + 10 * 60 * 1000)
            }
        });

        await transporter.sendMail({
            from: "vocterdev@gmail.com",
            to: email,
            subject: "Password Reset PIN",
            text: `Your password reset PIN is: ${pin}. It will expire in 10 minutes`
        });

        res.json({message: "PIN sent to email"});
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.post("/validate-pin", async (req: Request, res: Response): Promise<any> => {
    const {email, pin} = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user || user.resetPin !== pin || new Date() > user.resetPinExpires!) {
        return res.status(400).json({ error: "Invalid or expired PIN" });
    }

    res.json({ message: "PIN validated successfully" });
});

router.post("/reset-password", async (req: Request, res: Response) => {
    const {email, newPassword} = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: {
            email
        },
        data: {
            password: hashedPassword,
            resetPin: undefined
        }
    })
})

export default router;