import { Router, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import prisma from "../prisma/prisma";
import { authMiddleware, AuthRequest } from "../middleware/middleware";

const router = Router();

const stripe = new Stripe("sk_test_51PnjcvAoWA18MplJmf1g9KfvvtsoTpCipRDbZGbhcmGSnEdn6wtJGAAHNMLvcSqiiqxtEXNxSfUg9XGRR3psICXl00cfscl8WS", { apiVersion: "2024-12-18.acacia" });

const endpointSecret = "whsec_431ac61a9c1e19c32e3f41f8d3d06e25df6b367914707f01c72250d685009c5d";

router.post("/create-checkout-session", authMiddleware, async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user!.userId;
        const { cartId } = req.body;

        const cart = await prisma.cart.findUnique({
            where: {
                id: String(cartId),
            },
            include: {
                cartItems: {
                    include: {
                        product: {

                        },
                    },
                },
            },
        });

        if (!cart || !cart.cartItems.length) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        const lineItems = cart.cartItems.map((cartItem) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: cartItem.product.name,
                    description: cartItem.product.description,
                },
                unit_amount: Math.floor(cartItem.product.price * 1.23 * 100),
            },
            quantity: cartItem.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000/cancel",
            metadata: {
                userId: userId,
                cartId: cart.id,
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.post("/buy-now", authMiddleware, async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;
        const {productId} = req.body;

        const product = await prisma.product.findUnique({
            where: {
                id: String(productId)
            }
        });

        if (!product) {
            return res.status(400).json({ error: "Product not found" });
        }

        const lineItem = {
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    description: product.description
                },
                unit_amount: Math.floor(product.price * 100)
            },
            quantity: 1
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [lineItem],
            mode: "payment",
            success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000/cancel",
            metadata: {
                userId: String(userId),
                productId: product.id
            }
        });

        res.json({id: session.id});
    }
    catch (error) {
        console.error("Error creating Buy Now checkout session:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response): Promise<any> => {
    const sig = req.headers["stripe-signature"]!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
        console.error("Webhook signature verification failed:", error);
        return res.status(400).send(`Webhook Error: ${error}`);
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const { userId, cartId } = session.metadata!;

            try {
                // Fetch shipping information
                const shippingInformation = await prisma.shippingInformation.findUnique({
                    where: {
                        userId: String(userId),
                    },
                    select: {
                        id: true,
                    },
                });

                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);


                await prisma.order.create({
                    data: {
                        userId: String(userId),
                        totalAmount: session.amount_total!,
                        paymentStatus: "PAID",
                        shippingInformationId: shippingInformation!.id,
                        orderItems: {
                            create: lineItems.data.map((item) => ({
                                productId: item.id, // Ensure your schema maps correctly
                                quantity: item.quantity || 1,
                            })),
                        },
                        orderStatus: "PENDING",
                    },
                });

                console.log(`Order created for userId: ${userId}`);
            } catch (error) {
                console.error("Error processing order:", error);
                return res.status(500).send("Error processing order");
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send();
});

export default router;
