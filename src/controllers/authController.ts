import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel";
import { generateToken } from "../utils/generateToken";
import { sendEmail } from "../utils/sendEmail";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role: role || "customer" });

    // create email verification token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    await sendEmail(user.email, "Verify your email", `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`);

    res.status(201).json({ message: "User created. Check email for verification." });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Signup failed" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isVerified = true;
    await user.save();
    res.json({ message: "Email verified" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString())
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Login failed" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  res.json(req.user);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: "If email exists, a reset link was sent" });

    const token = crypto.randomBytes(20).toString("hex");
    // store token in a quick JWT so we don't need a token field — sign with short expiry with user id
    const jwtToken = jwt.sign({ id: user._id, t: token }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${jwtToken}`;
    await sendEmail(user.email, "Password reset", `<p>Reset: <a href="${resetUrl}">${resetUrl}</a></p>`);

    res.json({ message: "If email exists, a reset link was sent" });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Error sending reset email" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; t?: string };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err: any) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
