// backend/src/index.ts
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import authRoutes from "./routes/authRoutes"; // if you already have auth routes
import { errorHandler, notFound } from "./middleware/errorMiddleware";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes); // make sure this file exists (your auth routes)

// Health check
app.get("/", (_, res) => res.send("🚀 Govindarao Store API"));

// Error handlers (fallback)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start
async function start() {
  try {
    const uri = process.env.MONGO_URI!;
    if (!uri) {
      throw new Error("MONGO_URI not set in .env");
    }
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
