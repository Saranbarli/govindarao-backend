import { Request, Response } from "express";
import Order from "../models/orderModel";
import { Parser } from "json2csv";

export const exportOrders = async (req: Request, res: Response) => {
  const orders = await Order.find().populate("user", "name email");

  const fields = ["user.name", "user.email", "totalPrice", "createdAt"];
  const parser = new Parser({ fields });
  const csv = parser.parse(orders);

  res.header("Content-Type", "text/csv");
  res.attachment("orders.csv");
  res.send(csv);
};
