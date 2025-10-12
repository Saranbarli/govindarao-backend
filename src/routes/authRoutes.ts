// backend/src/routes/authRoutes.ts
import express from "express";
import { signup, login, forgotPassword, resetPassword, getProfile } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", protect, getProfile);

export default router;
