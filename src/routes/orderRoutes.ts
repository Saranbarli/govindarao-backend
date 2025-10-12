// backend/src/routes/orderRoutes.ts
import express from "express";
import {
  createOrder,
  getOrder,
  listOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createOrder); // customer or admin can create (protect ensures logged-in)
router.get("/:id", protect, getOrder);

// admin endpoints
router.get("/", protect, adminOnly, listOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.delete("/:id", protect, adminOnly, deleteOrder);

export default router;
