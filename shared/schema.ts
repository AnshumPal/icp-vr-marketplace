import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  walletAddress: text("wallet_address").unique(),
  balance: decimal("balance", { precision: 18, scale: 8 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vrAssets = pgTable("vr_assets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  previewUrl: text("preview_url").notNull(),
  modelUrl: text("model_url"),
  fileSize: text("file_size"),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  isForSale: boolean("is_for_sale").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").references(() => vrAssets.id).notNull(),
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  sellerId: integer("seller_id").references(() => users.id).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  transactionHash: text("transaction_hash"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  walletAddress: true,
});

export const insertVRAssetSchema = createInsertSchema(vrAssets).pick({
  title: true,
  description: true,
  category: true,
  price: true,
  previewUrl: true,
  modelUrl: true,
  fileSize: true,
  ownerId: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  assetId: true,
  buyerId: true,
  sellerId: true,
  price: true,
  transactionHash: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVRAsset = z.infer<typeof insertVRAssetSchema>;
export type VRAsset = typeof vrAssets.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type VRAssetWithOwner = VRAsset & {
  owner: User;
};
