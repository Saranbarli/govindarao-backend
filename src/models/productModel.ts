import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  image?: string;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, default: 0 },
    image: { type: String }
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
