import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },

  personalInfo: {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, index: true },
    phone: { type: String, unique: true, index: true },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },
    dateOfBirth: Date,
    gender: String,
  },

  auth: {
    password: String,
    emailVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
  },

  mlmInfo: {
    sponsorId: String,
    sponsorCode: String,
    referralCode: String,
    position: { type: String, enum: ["left", "right"], default: "left" },
    level: { type: Number, default: 0 },
    rank: { type: String, default: "Member" },
    joinDate: { type: Date, default: Date.now },
    activationDate: Date,
    leftLegId: String,
    rightLegId: String,
    uplineId: String,
    leftLegCount: { type: Number, default: 0 },
    rightLegCount: { type: Number, default: 0 },
    totalDownline: { type: Number, default: 0 },
    activeDownline: { type: Number, default: 0 },
    personalSales: { type: Number, default: 0 },
    leftLegSales: { type: Number, default: 0 },
    rightLegSales: { type: Number, default: 0 },
    totalTeamSales: { type: Number, default: 0 },
  },

  wallet: {
    balance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    pendingCommission: { type: Number, default: 0 },
    lastPayoutDate: Date,
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolder: String,
    },
  },

  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

export default mongoose.model("User", userSchema);
