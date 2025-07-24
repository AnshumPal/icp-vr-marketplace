import { users, vrAssets, transactions, type User, type InsertUser, type VRAsset, type InsertVRAsset, type Transaction, type InsertTransaction, type VRAssetWithOwner } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(id: number, balance: string): Promise<User | undefined>;

  // VR Asset operations
  getAssets(): Promise<VRAssetWithOwner[]>;
  getAssetById(id: number): Promise<VRAssetWithOwner | undefined>;
  getAssetsByOwner(ownerId: number): Promise<VRAssetWithOwner[]>;
  createAsset(asset: InsertVRAsset): Promise<VRAsset>;
  updateAssetOwner(id: number, newOwnerId: number): Promise<VRAsset | undefined>;

  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;

  // Market stats
  getMarketStats(): Promise<{
    totalAssets: number;
    totalVolume: string;
    activeUsers: number;
    avgPrice: string;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private vrAssets: Map<number, VRAsset>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentAssetId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.vrAssets = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentAssetId = 1;
    this.currentTransactionId = 1;

    // Add sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Create sample users
    const sampleUsers = [
      { username: "cyberpunk_dev", walletAddress: "ic1234...abcd", balance: "5.25" },
      { username: "workspace_pro", walletAddress: "ic5678...efgh", balance: "3.80" },
      { username: "artsmith_vr", walletAddress: "ic9012...ijkl", balance: "7.15" },
      { username: "nature_vr", walletAddress: "ic3456...mnop", balance: "2.40" },
      { username: "space_explorer", walletAddress: "ic7890...qrst", balance: "10.50" },
      { username: "fantasy_realm", walletAddress: "ic2468...uvwx", balance: "4.95" },
      { username: "social_architect", walletAddress: "ic1357...yzab", balance: "6.30" },
      { username: "ocean_edu", walletAddress: "ic9753...cdef", balance: "1.75" },
    ];

    sampleUsers.forEach(userData => {
      const user: User = {
        id: this.currentUserId++,
        ...userData,
        createdAt: new Date(),
      };
      this.users.set(user.id, user);
    });

    // Create sample VR assets
    const sampleAssets = [
      {
        title: "Neon Cyberpunk Arena",
        description: "High-tech gaming environment with interactive elements",
        category: "gaming",
        price: "2.5",
        previewUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        modelUrl: "/models/cyberpunk_arena.glb",
        fileSize: "15.2 MB",
        ownerId: 1,
      },
      {
        title: "Virtual Office Hub",
        description: "Modern workplace with collaborative tools",
        category: "workspace",
        price: "1.8",
        previewUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        modelUrl: "/models/office_hub.glb",
        fileSize: "8.7 MB",
        ownerId: 2,
      },
      {
        title: "Digital Art Gallery",
        description: "Immersive gallery showcasing digital masterpieces",
        category: "art",
        price: "3.2",
        previewUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        modelUrl: "/models/art_gallery.glb",
        fileSize: "22.1 MB",
        ownerId: 3,
      },
      {
        title: "Paradise Island",
        description: "Peaceful tropical getaway with crystal clear waters",
        category: "nature",
        price: "1.5",
        previewUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        modelUrl: "/models/paradise_island.glb",
        fileSize: "18.9 MB",
        ownerId: 4,
      },
      {
        title: "Space Station Alpha",
        description: "Advanced orbital facility with interactive systems",
        category: "sci-fi",
        price: "4.1",
        previewUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        modelUrl: "/models/space_station.glb",
        fileSize: "31.5 MB",
        ownerId: 5,
      },
      {
        title: "Dragon's Keep Castle",
        description: "Immersive medieval fortress with quest elements",
        category: "fantasy",
        price: "2.8",
        previewUrl: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        modelUrl: "/models/dragons_keep.glb",
        fileSize: "26.3 MB",
        ownerId: 6,
      },
      {
        title: "City Skyline Lounge",
        description: "Premium social space with stunning city views",
        category: "social",
        price: "1.9",
        previewUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        modelUrl: "/models/city_lounge.glb",
        fileSize: "14.6 MB",
        ownerId: 7,
      },
      {
        title: "Ocean Depths Explorer",
        description: "Interactive marine biology learning experience",
        category: "educational",
        price: "0.9",
        previewUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        modelUrl: "/models/ocean_depths.glb",
        fileSize: "12.8 MB",
        ownerId: 8,
      },
    ];

    sampleAssets.forEach(assetData => {
      const asset: VRAsset = {
        id: this.currentAssetId++,
        ...assetData,
        isForSale: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.vrAssets.set(asset.id, asset);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      balance: "0",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(id: number, balance: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, balance };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getAssets(): Promise<VRAssetWithOwner[]> {
    const assets = Array.from(this.vrAssets.values());
    const result: VRAssetWithOwner[] = [];
    
    for (const asset of assets) {
      const owner = this.users.get(asset.ownerId);
      if (owner) {
        result.push({ ...asset, owner });
      }
    }
    
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAssetById(id: number): Promise<VRAssetWithOwner | undefined> {
    const asset = this.vrAssets.get(id);
    if (asset) {
      const owner = this.users.get(asset.ownerId);
      if (owner) {
        return { ...asset, owner };
      }
    }
    return undefined;
  }

  async getAssetsByOwner(ownerId: number): Promise<VRAssetWithOwner[]> {
    const assets = Array.from(this.vrAssets.values()).filter(asset => asset.ownerId === ownerId);
    const result: VRAssetWithOwner[] = [];
    
    for (const asset of assets) {
      const owner = this.users.get(asset.ownerId);
      if (owner) {
        result.push({ ...asset, owner });
      }
    }
    
    return result;
  }

  async createAsset(insertAsset: InsertVRAsset): Promise<VRAsset> {
    const id = this.currentAssetId++;
    const asset: VRAsset = {
      ...insertAsset,
      id,
      isForSale: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.vrAssets.set(id, asset);
    return asset;
  }

  async updateAssetOwner(id: number, newOwnerId: number): Promise<VRAsset | undefined> {
    const asset = this.vrAssets.get(id);
    if (asset) {
      const updatedAsset = { ...asset, ownerId: newOwnerId, updatedAt: new Date() };
      this.vrAssets.set(id, updatedAsset);
      return updatedAsset;
    }
    return undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.buyerId === userId || tx.sellerId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      const updatedTransaction = { ...transaction, status };
      this.transactions.set(id, updatedTransaction);
      return updatedTransaction;
    }
    return undefined;
  }

  async getMarketStats(): Promise<{
    totalAssets: number;
    totalVolume: string;
    activeUsers: number;
    avgPrice: string;
  }> {
    const assets = Array.from(this.vrAssets.values());
    const completedTransactions = Array.from(this.transactions.values())
      .filter(tx => tx.status === "completed");
    
    const totalVolume = completedTransactions
      .reduce((sum, tx) => sum + parseFloat(tx.price), 0);
    
    const avgPrice = assets.length > 0 
      ? assets.reduce((sum, asset) => sum + parseFloat(asset.price), 0) / assets.length
      : 0;

    return {
      totalAssets: assets.length,
      totalVolume: totalVolume.toFixed(2),
      activeUsers: this.users.size,
      avgPrice: avgPrice.toFixed(2),
    };
  }
}

export const storage = new MemStorage();
