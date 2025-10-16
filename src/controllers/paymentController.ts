import { Request, Response } from "express";
import Order from "../models/Order";

// ✅ Get all unpaid or partial orders
export const getPendingPayments = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({
      paymentStatus: { $in: ["unpaid", "partial"] },
    })
      .populate("customer")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching pending payments" });
  }
};
