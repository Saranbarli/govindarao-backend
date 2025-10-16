import express from "express";
import { getPendingPayments } from "../controllers/paymentController";

const router = express.Router();

router.get("/pending", getPendingPayments);

export default router;
