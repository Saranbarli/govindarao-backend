import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  customerId: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,

  items: [
    {
      productId: String,
      productName: String,
      quantity: Number,
      price: Number,
      bv: Number,
      subtotal: Number,
    },
  ],

  subtotal: Number,
  discount: Number,
  memberDiscount: Number,
  tax: Number,
  total: Number,
  bvTotal: Number,

  payment: {
    status: {
      type: String,
      enum: ["pending", "partial", "completed"],
      default: "pending",
    },
    method: String,
    paidAmount: Number,
    pendingAmount: Number,
    transactions: [
      {
        amount: Number,
        method: String,
        date: Date,
        reference: String,
      },
    ],
  },

  fulfillment: {
    type: {
      type: String,
      enum: ["store_pickup"],
      default: "store_pickup",
    },
    status: {
      type: String,
      enum: ["pending", "ready", "completed", "cancelled"],
      default: "pending",
    },
    pickupDate: Date,
    completedDate: Date,
    notes: String,
  },

  commissionDistributed: { type: Boolean, default: false },
  commissionDetails: [
    {
      userId: String,
      userName: String,
      type: String,
      amount: Number,
      percentage: Number,
    },
  ],

  orderDate: { type: Date, default: Date.now },
  updatedAt: Date,
});

export default mongoose.model("Order", orderSchema);
