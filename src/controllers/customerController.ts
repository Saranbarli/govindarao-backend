import { Request, Response } from "express";
import Customer from "../models/Customer";

// ✅ Get all customers (latest first)
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching customers" });
  }
};

// ✅ Add new customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, address } = req.body;
    const existing = await Customer.findOne({ phone });

    if (existing) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const newCustomer = new Customer({ name, phone, address });
    await newCustomer.save();

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating customer" });
  }
};

// ✅ Get single customer
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer" });
  }
};

// ✅ Update customer
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Customer not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating customer" });
  }
};

// ✅ Delete customer
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer" });
  }
};
