import { Request, Response } from "express";
import Product from "../models/productModel";

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, image } = req.body;
  const product = await Product.create({ name, description, price, image });
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const p = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const p = await Product.findByIdAndDelete(id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Deleted" });
};

export const listProducts = async (_req: Request, res: Response) => {
  const products = await Product.find({});
  res.json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const p = await Product.findById(id);
  if (!p) return res.status(404).json({ message: "Not Found" });
  res.json(p);
};
