import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  qty: number;
  price: number;
}

export interface IOrder extends Document {
  customer: Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  placedBy: "admin" | "customer";
  createdAt: Date;
  updatedAt?: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 0 }
});

const orderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
    placedBy: { type: String, enum: ["admin", "customer"], default: "customer" }
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
