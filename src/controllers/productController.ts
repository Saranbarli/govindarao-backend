// backend/src/controllers/productController.ts
import { Request, Response } from "express";
import Product from "../models/productModel";

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, description, category, stock, image } = req.body;
  const product = new Product({ name, price, description, category, stock, image });
  await product.save();
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.name = req.body.name ?? product.name;
  product.price = req.body.price ?? product.price;
  product.description = req.body.description ?? product.description;
  product.category = req.body.category ?? product.category;
  product.stock = req.body.stock ?? product.stock;
  product.image = req.body.image ?? product.image;

  await product.save();
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  await product.remove();
  res.json({ message: "Product removed" });
};
