import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true, required: true },
  name: String,
  description: String,
  category: String,
  subCategory: String,

  pricing: {
    mrp: Number,
    sellingPrice: Number,
    memberPrice: Number,
    bv: Number,
    pv: Number,
  },

  commission: {
    retail: Number,
    binary: Number,
    direct: Number,
    level1: Number,
    level2: Number,
    level3: Number,
  },

  inventory: {
    stock: Number,
    minStock: Number,
    unit: String,
    sku: String,
  },

  images: [String],
  featured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "inactive", "out_of_stock"],
    default: "active",
  },
  tags: [String],
  manufacturer: String,
  certifications: [String],

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

export default mongoose.model("Product", productSchema);
