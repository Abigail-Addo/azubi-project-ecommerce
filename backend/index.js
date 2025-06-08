import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoute.js";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(json());

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:3002",
      "https://azubi-project-ecommerce.vercel.app",
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
