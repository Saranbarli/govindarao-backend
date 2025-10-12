// backend/src/controllers/orderController.ts
import { Request, Response } from "express";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import mongoose from "mongoose";

/**
 * Create order:
 * Body: { customer (optional), items: [{ productId, qty }], placedBy? }
 * This endpoint will populate product snapshot (price at order time).
 */
export const createOrder = async (req: Request, res: Response) => {
  const { customer, items, placedBy } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order items required" });
  }

  // Build order items with price snapshot
  const builtItems = await Promise.all(
    items.map(async (it: { productId: string; qty: number }) => {
      if (!mongoose.Types.ObjectId.isValid(it.productId)) {
        throw new Error("Invalid product id");
      }
      const p = await Product.findById(it.productId);
      if (!p) throw new Error(`Product not found: ${it.productId}`);
      return {
        product: p._id,
        qty: it.qty,
        price: p.price,
      };
    })
  );

  const total = builtItems.reduce((sum: number, it: any) => sum + it.price * it.qty, 0);

  const order = new Order({
    customer,
    items: builtItems,
    totalAmount: total,
    placedBy: placedBy || "customer",
  });

  await order.save();
  // populate product details for response
  await order.populate("items.product", "name price image");
  res.status(201).json(order);
};

export const getOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("items.product", "name price image").populate("customer", "name email");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

// Admin: list all orders
export const listOrders = async (req: Request, res: Response) => {
  // admin vs customer filtering should be in middleware or here
  const orders = await Order.find().populate("items.product", "name price").populate("customer", "name email").sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.status = req.body.status ?? order.status;
  await order.save();
  res.json(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  await order.remove();
  res.json({ message: "Order removed" });
};
