// Mock data for demonstration - this would be replaced with real API calls in production
export const mockVRAssets = [
  {
    id: 1,
    title: "Neon Cyberpunk Arena",
    description: "High-tech gaming environment with interactive elements",
    category: "gaming",
    price: "2.5",
    previewUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    modelUrl: "/models/cyberpunk_arena.glb",
    fileSize: "15.2 MB",
    owner: {
      id: 1,
      username: "cyberpunk_dev",
      walletAddress: "ic1234...abcd",
      balance: "5.25",
      createdAt: new Date(),
    },
    isForSale: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more mock assets as needed
];

export const mockMarketStats = {
  totalAssets: 1247,
  totalVolume: "45.2",
  activeUsers: 892,
  avgPrice: "0.34",
};

export const mockUser = {
  id: 1,
  username: "demo_user",
  walletAddress: "ic1234567890abcdef",
  balance: "10.5",
  createdAt: new Date(),
};
