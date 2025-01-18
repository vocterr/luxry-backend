import { Router, Response, Request } from "express";
import { authMiddleware, authorize, AuthRequest } from "../middleware/middleware";
import prisma from "../prisma/prisma";


const router = Router();

router.get('/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: String(userId)
            }
        });
        res.json(orders);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/orders/:orderId", authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const order = await prisma.order.findUnique({
            where: {
                userId: String(userId),
                id: String(req.params.orderId)
            },
            include: {
                shippingInformation: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
        res.json(order);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/ordersCount", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const ordersCount = await prisma.order.count();
        res.json(ordersCount);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/manageOrders", authMiddleware, authorize, async (req: AuthRequest, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            take: 15,
            include: {
                shippingInformation: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        res.json(orders);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.patch("/updateOrderStatus/:orderId", authMiddleware, authorize, async (req: AuthRequest, res: Response) => {
    const {orderStatus} = req.body;
    try {
        const  updatedOrder = await prisma.order.update({
            where: {
                id: String(req.params.orderId)
            },
            data: {
                orderStatus
            }
        });
        res.json("Updating completed successfully!");
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});


router.get("/recentOrders", authMiddleware, authorize, async (req: AuthRequest, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: {
                updatedAt: "desc"
            },
            take: 3
        });
        res.json(orders);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

router.get("/revenue", authMiddleware, authorize, async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            select: {
                totalAmount: true
            }
        });
        const total = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        res.json(total);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

export default router;