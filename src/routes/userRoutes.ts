// src/routes/userRoutes.ts
import express from "express";
import {
  registerUser,
  authUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;
