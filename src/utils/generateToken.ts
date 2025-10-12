// backend/src/utils/generateToken.ts
import jwt from "jsonwebtoken";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "devsecret", { expiresIn: "30d" });
};
