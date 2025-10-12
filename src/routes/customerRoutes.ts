import express from "express";
import {
  saveCustomerProfile,
  getCustomerProfile,
} from "../controllers/customerController";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

// Get current user's profile
router.get("/me", protect, getCustomerProfile);

// Create or update profile (with photo upload)
router.post("/me", protect, upload.single("photo"), saveCustomerProfile);

export default router;
