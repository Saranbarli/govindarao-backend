import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { sendEmail } from "../utils/sendEmail";
import bcrypt from "bcryptjs";

// @desc Forgot Password - send reset link
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail(user.email, "Password Reset", `<a href="${resetUrl}">Reset Password</a>`);
  res.json({ message: "Password reset link sent to email" });
};

// @desc Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Invalid token or user not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
