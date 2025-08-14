import { pgTable, text, serial, integer, boolean, timestamp, decimal,varchar} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";



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

export const creators = pgTable("creators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  isVerified: boolean("is_verified").default(false),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  description: text("description"),
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

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  downloads: integer("downloads").default(0),
  fileSize: text("file_size"),
  compatibility: text("compatibility"),
  creatorId: varchar("creator_id").notNull(),
  isBlockchainVerified: boolean("is_blockchain_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});


export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCreatorSchema = createInsertSchema(creators).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVRAsset = z.infer<typeof insertVRAssetSchema>;
export type VRAsset = typeof vrAssets.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type VRAssetWithOwner = VRAsset & {
  owner: User;
};

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedAssets: many(vrAssets),
  soldTransactions: many(transactions, { relationName: "seller" }),
  purchasedTransactions: many(transactions, { relationName: "buyer" }),
}));

export const vrAssetsRelations = relations(vrAssets, ({ one, many }) => ({
  owner: one(users, {
    fields: [vrAssets.ownerId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  asset: one(vrAssets, {
    fields: [transactions.assetId],
    references: [vrAssets.id],
  }),
  buyer: one(users, {
    fields: [transactions.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
  seller: one(users, {
    fields: [transactions.sellerId],
    references: [users.id],
    relationName: "seller",
  }),
}));
