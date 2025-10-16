import { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mailer";
import bcrypt from "bcryptjs";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "1h" });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendMail({
      to: user.email,
      subject: "Password reset",
      html: `<p>Click to reset password: <a href="${resetUrl}">Reset password</a></p>`
    });

    res.json({ message: "Reset email sent" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to send reset email", error: error.message || error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token) return res.status(400).json({ message: "Token required" });
    if (!password) return res.status(400).json({ message: "Password required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret") as any;
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(400).json({ message: "Invalid or expired token", error: error.message || error });
  }
};
