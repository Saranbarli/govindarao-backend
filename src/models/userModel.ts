import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type Role = "admin" | "customer" | "father";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  isVerified: boolean;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer", "father"], default: "customer" },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this as any).password = await bcrypt.hash((this as any).password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
