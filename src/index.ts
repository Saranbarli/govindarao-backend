// src/index.ts
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// basic health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Connect MongoDB
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) {
  // eslint-disable-next-line no-console
  console.warn("MONGO_URI not set — database won't connect until .env is configured");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("MongoDB connected");
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error("MongoDB connection error:", err);
    });
}

export default app;
