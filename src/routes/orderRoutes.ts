// src/routes/orderRoutes.ts
import express from "express";

const router = express.Router();

router.get("/", (_req, res) => res.json([]));
router.post("/", (_req, res) => res.status(201).json({ message: "create order (stub)" }));

export default router;
