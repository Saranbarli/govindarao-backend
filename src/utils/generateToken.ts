import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
