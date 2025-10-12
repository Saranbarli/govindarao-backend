import { Request, Response } from "express";
import Customer from "../models/customerModel";

// @desc Create or update customer profile
export const saveCustomerProfile = async (req: Request, res: Response) => {
  try {
    const { name, phone, address } = req.body;
    let photo = req.body.photo;

    if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    }

    const existing = await Customer.findOne({ user: req.user!._id });

    if (existing) {
      existing.name = name;
      existing.phone = phone;
      existing.address = address;
      if (photo) existing.photo = photo;
      await existing.save();
      return res.json(existing);
    } else {
      const customer = await Customer.create({
        user: req.user!._id,
        name,
        phone,
        address,
        photo,
        email: req.user!.email,
      });
      return res.status(201).json(customer);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to save customer profile", error });
  }
};

// @desc Get logged in customer profile
export const getCustomerProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Customer.findOne({ user: req.user!._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
