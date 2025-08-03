// storage.ts (MongoDB Version)
import { UserModel, VRAssetModel, TransactionModel } from "./models";
import type {
  User,
  InsertUser,
  VRAsset,
  InsertVRAsset,
  Transaction,
  InsertTransaction,
  VRAssetWithOwner,
} from "@shared/schema";

type PopulatedVRAsset = Omit<VRAsset, "ownerId"> & {
  ownerId: User;
};

export interface IStorage {
  getUser(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserByWalletAddress(walletAddress: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(id: string, balance: string): Promise<User | null>;

  getAssets(): Promise<VRAssetWithOwner[]>;
  getAssetById(id: string): Promise<VRAssetWithOwner | null>;
  getAssetsByOwner(ownerId: string): Promise<VRAssetWithOwner[]>;
  createAsset(asset: InsertVRAsset): Promise<VRAsset>;
  updateAssetOwner(id: string, newOwnerId: string): Promise<VRAsset | null>;

  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  updateTransactionStatus(id: string, status: string): Promise<Transaction | null>;

  getMarketStats(): Promise<{
    totalAssets: number;
    totalVolume: string;
    activeUsers: number;
    avgPrice: string;
  }>;
}

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<User | null> {
  return await UserModel.findById(id).lean() as User | null;
}

async getUserByUsername(username: string): Promise<User | null> {
  return await UserModel.findOne({ username }).lean() as User | null;
}

async getUserByWalletAddress(walletAddress: string): Promise<User | null> {
  return await UserModel.findOne({ walletAddress }).lean() as User | null;
}

async createUser(user: InsertUser): Promise<User> {
  const newUser = new UserModel({ ...user, balance: "0" });
  return await newUser.save() as User;
}

async updateUserBalance(id: string, balance: string): Promise<User | null> {
  return await UserModel.findByIdAndUpdate(id, { balance }, { new: true }).lean() as User | null;
}


  async getAssets(): Promise<VRAssetWithOwner[]> {
  const assets = await VRAssetModel.find().populate("ownerId").lean<PopulatedVRAsset[]>();
  return assets.map(({ ownerId, ...rest }) => ({
  ...rest,
  owner: ownerId,
})) as VRAssetWithOwner[];
}

async getAssetById(id: string): Promise<VRAssetWithOwner | null> {
  const asset = await VRAssetModel.findById(id)
    .populate("ownerId")
    .lean<PopulatedVRAsset | null>();

  if (!asset) return null;

  const { ownerId, ...rest } = asset;

  return {
    ...rest,
    owner: ownerId,
  } as VRAssetWithOwner;
}


async getAssetsByOwner(ownerId: string): Promise<VRAssetWithOwner[]> {
  const assets = await VRAssetModel.find({ ownerId })
    .populate("ownerId")
    .lean<PopulatedVRAsset[]>();

  return assets.map(({ ownerId, ...rest }) => ({
    ...rest,
    owner: ownerId,
  })) as VRAssetWithOwner[];
}


  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
  const newTx = new TransactionModel(transaction);
  return (await newTx.save()).toObject() as Transaction;
}

async getTransactionsByUser(userId: string): Promise<Transaction[]> {
  const txs = await TransactionModel.find({
    $or: [{ buyerId: userId }, { sellerId: userId }],
  }).sort({ createdAt: -1 }).lean();
  return txs as Transaction[];

}

async updateTransactionStatus(id: string, status: string): Promise<Transaction | null> {
  return await TransactionModel.findByIdAndUpdate(id, { status }, { new: true }).lean() as Transaction | null;
}


  async getMarketStats(): Promise<{
    totalAssets: number;
    totalVolume: string;
    activeUsers: number;
    avgPrice: string;
  }> {
    const [totalAssets, completedTxs, userCount, allAssets] = await Promise.all([
      VRAssetModel.countDocuments(),
      TransactionModel.find({ status: "completed" }).lean(),
      UserModel.countDocuments(),
      VRAssetModel.find().lean(),
    ]);

    const totalVolume = completedTxs.reduce((sum, tx) => sum + parseFloat(tx.price), 0);

    const avgPrice =
      allAssets.length > 0
        ? allAssets.reduce((sum, asset) => sum + parseFloat(asset.price), 0) / allAssets.length
        : 0;

    return {
      totalAssets,
      totalVolume: totalVolume.toFixed(2),
      activeUsers: userCount,
      avgPrice: avgPrice.toFixed(2),
    };
  }
}

export const storage = new MongoStorage();
