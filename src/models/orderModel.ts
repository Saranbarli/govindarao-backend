// backend/src/models/orderModel.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId | any; // populated or id
  qty: number;
  price: number;
}

export interface IOrder extends Document {
  customer: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: string;
  placedBy?: "admin" | "customer";
  createdAt?: Date;
  updatedAt?: Date;
}

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    placedBy: { type: String, enum: ["admin", "customer"], default: "customer" },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
