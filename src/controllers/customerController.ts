// backend/src/controllers/customerController.ts
import { Request, Response } from "express";
import Customer from "../models/customerModel";
import Order from "../models/orderModel";
import { sendPendingPaymentEmail } from "../utils/notify";

// ✅ Get all customers (latest first)
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create new customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Pending payment reminder
export const sendPendingPaymentReminder = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const pendingOrders = await Order.find({ customer: customerId, paymentStatus: "Pending" });
    if (pendingOrders.length === 0)
      return res.status(200).json({ message: "No pending payments for this customer." });

    await sendPendingPaymentEmail(customer.email, customer.name, pendingOrders);
    res.status(200).json({ message: "Pending payment reminder sent successfully." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
