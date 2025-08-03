// models.ts (for MongoDB)
import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  walletAddress: { type: String, unique: true },
  balance: { type: String, default: "0" },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });  // disables __v field

export const UserModel = mongoose.model("User", userSchema);

// VR Asset Schema
const vrAssetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },  // Stored as string to preserve precision
  previewUrl: { type: String, required: true },
  modelUrl: { type: String },
  fileSize: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isForSale: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { versionKey: false });

export const VRAssetModel = mongoose.model("VRAsset", vrAssetSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "VRAsset", required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: String, required: true },
  transactionHash: { type: String },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

export const TransactionModel = mongoose.model("Transaction", transactionSchema);
