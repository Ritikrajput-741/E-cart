import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./Database/db.js";
import authRoutes from "./Routes/auth_Routes.js";
import cartRoutes from "./Routes/cart_Routes.js";
import orderRoutes from "./Routes/order_routes.js";
import productRoutes from "./Routes/product_Routes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

//api's
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", orderRoutes);
app.get("/", (req, res) => {
  res.send("Your service is live");
});

//server number
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running at Localhost✅ : ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
