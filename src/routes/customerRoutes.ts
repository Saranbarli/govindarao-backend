// backend/src/routes/customerRoutes.ts
import express from "express";
import {
  getCustomers,
  createCustomer,
  sendPendingPaymentReminder,
} from "../controllers/customerController";

const router = express.Router();

router.get("/", getCustomers);
router.post("/", createCustomer);
router.post("/:customerId/remind", sendPendingPaymentReminder);

export default router;
