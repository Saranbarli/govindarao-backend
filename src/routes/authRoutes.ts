// src/routes/authRoutes.ts
import express from "express";

const router = express.Router();

// For now stub endpoints so server starts
router.post("/signup", (req, res) => {
  res.json({ ok: true, message: "signup endpoint (implement controller)" });
});
router.post("/login", (req, res) => {
  res.json({ ok: true, message: "login endpoint (implement controller)" });
});

export default router;
