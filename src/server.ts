// backend/src/server.ts
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware"; // small helper added below

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => res.send("🚀 Govindarao Store API running"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
