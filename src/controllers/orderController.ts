import { Request, Response } from "express";
import Order from "../models/orderModel";
import Product from "../models/productModel";

// Create order: attach customer from req.user
export const createOrder = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  const { items, placedBy } = req.body as { items: { product: string; qty: number }[]; placedBy?: string };

  // compute totals and store prices snapshot
  const orderItems = await Promise.all(
    items.map(async (it) => {
      const prod = await Product.findById(it.product);
      if (!prod) throw new Error("Product not found: " + it.product);
      return { product: prod._id, qty: it.qty, price: prod.price };
    })
  );

  const total = orderItems.reduce((s, it) => s + it.price * it.qty, 0);

  const order = await Order.create({
    customer: req.user._id,
    items: orderItems,
    total,
    status: "pending",
    placedBy: placedBy === "admin" ? "admin" : "customer"
  });

  res.status(201).json(order);
};

export const getOrdersForUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  // if admin, list all
  if (req.user.role === "admin") {
    const orders = await Order.find({})
      .populate("customer", "name email")
      .populate("items.product", "name price image");
    return res.json(orders);
  }

  const orders = await Order.find({ customer: req.user._id })
    .populate("items.product", "name price image")
    .populate("customer", "name email");
  res.json(orders);
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate("customer", "name email")
    .populate("items.product", "name price image");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: string };
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.status = status as any;
  await order.save();
  res.json(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json({ message: "Deleted" });
};
