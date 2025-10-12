// backend/src/models/productModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock?: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, default: 0 },
    category: { type: String },
    stock: { type: Number, default: 0 },
    image: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
