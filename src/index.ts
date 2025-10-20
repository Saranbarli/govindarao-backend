import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db"; // your MongoDB connection file
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import customerRoutes from "./routes/customerRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);

app.get("/", (req, res) => {
  res.send("Govindarao Store Backend is running 🚀");
});

export default app;
