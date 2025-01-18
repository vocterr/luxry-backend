import express from "express";
import cors from "cors"
import path from "path";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth"
import productRoutes from "./routes/product";
import cartRoutes from "./routes/cart";
import shippingInformationRoutes from "./routes/shippingInformation";
import orderRoutes from "./routes/order";
import userRoutes from "./routes/user";
import wishlistRoutes from "./routes/wishlist";
import materialRoutes from "./routes/material";
import gemstoneRoutes from "./routes/gemstone";
import mailRoutes from "./routes/mail";
import stripeRoutes from "./routes/stripe";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://luxry.vercel.app",
    credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.set("trust proxy", 1);

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", shippingInformationRoutes);
app.use("/api", orderRoutes);
app.use("/api", userRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", materialRoutes);
app.use("/api", gemstoneRoutes);
app.use("/api", mailRoutes);
app.use("/api", stripeRoutes);

app.listen(3001, () => console.log(3001));