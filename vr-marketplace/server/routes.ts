import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVRAssetSchema, insertTransactionSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { MemStorage } from "./storage";



export async function registerRoutes(app: Express): Promise<Server> {
  // Get all VR assets
  app.get("/api/assets", async (req, res) => {
    try {
      
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (error) {
       console.error("Failed to create asset:", error);
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  // Get specific asset by ID
  app.get("/api/assets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const asset = await storage.getAssetById(id);
      
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      res.json(asset);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch asset" });
    }
  });

  // Create new VR asset (mint)
  app.post("/api/assets", async (req, res) => {
    try {
      const validatedData = insertVRAssetSchema.parse(req.body);
      const asset = await storage.createAsset(validatedData);
      res.status(201).json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid asset data", errors: error.errors });
      } else {
        console.error("Failed to create asset:", error);
        res.status(500).json({ message: "Failed to create asset"});
      }
    }
  });

  // Get market statistics
  app.get("/api/market/stats", async (req, res) => {
    try {
      const stats = await storage.getMarketStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market stats" });
    }
  });

  // Connect wallet (create or get user)
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { walletAddress, username } = req.body;
      
      // Check if user already exists
      let user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        // Create new user
        const userData = insertUserSchema.parse({ walletAddress, username });
        user = await storage.createUser(userData);
      }
      
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid wallet data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to connect wallet" });
      }
    }
  });

  // Get user by wallet address
  app.get("/api/wallet/:address", async (req, res) => {
    try {
      const user = await storage.getUserByWalletAddress(req.params.address);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user's assets
  app.get("/api/users/:id/assets", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const assets = await storage.getAssetsByOwner(userId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user assets" });
    }
  });

  // Purchase asset
  app.post("/api/transactions/purchase", async (req, res) => {
    try {
      const { assetId, buyerId } = req.body;
      
      const asset = await storage.getAssetById(assetId);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      if (!asset.isForSale) {
        return res.status(400).json({ message: "Asset is not for sale" });
      }
      
      if (asset.ownerId === buyerId) {
        return res.status(400).json({ message: "Cannot purchase your own asset" });
      }

      // Create transaction
      const transactionData = insertTransactionSchema.parse({
        assetId,
        buyerId,
        sellerId: asset.ownerId,
        price: asset.price,
        transactionHash: `0x${Math.random().toString(16).substring(2, 18)}...`,
        status: "pending",
      });
      
      const transaction = await storage.createTransaction(transactionData);
      
      // Simulate blockchain processing
      setTimeout(async () => {
        await storage.updateTransactionStatus(transaction.id, "completed");
        await storage.updateAssetOwner(assetId, buyerId);
      }, 3000);
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to process transaction" });
      }
    }
  });

  // Get user transactions
  app.get("/api/users/:id/transactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const transactions = await storage.getTransactionsByUser(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
