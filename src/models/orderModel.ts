// backend/src/models/orderModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  customer: mongoose.Schema.Types.ObjectId;
  products: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentStatus: "Paid" | "Pending";
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    products: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
