import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import AssetCard from "@/components/AssetCard";
import MintAssetModal from "@/components/MintAssetModal";
import Asset3DPreviewModal from "@/components/Asset3DPreviewModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Grid, List, TrendingUp, Eye } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import type { VRAssetWithOwner } from "@shared/schema";

export default function MyAssets() {
  const [showMintModal, setShowMintModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<VRAssetWithOwner | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const { user } = useWallet();

  const { data: userAssets = [], isLoading } = useQuery<VRAssetWithOwner[]>({
    queryKey: user ? ["/api/users", user.id, "assets"] : undefined,
    enabled: !!user,
  });

  const { data: userTransactions = [] } = useQuery({
    queryKey: user ? ["/api/users", user.id, "transactions"] : undefined,
    enabled: !!user,
  });

  const sortedAssets = [...userAssets].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handlePreview3D = (asset: VRAssetWithOwner) => {
    setSelectedAsset(asset);
    setShowAssetModal(true);
  };

  const totalValue = userAssets.reduce((sum, asset) => sum + parseFloat(asset.price), 0);
  const completedSales = userTransactions.filter((tx: any) => tx.status === "completed" && tx.sellerId === user?.id);
  const totalSales = completedSales.reduce((sum: number, tx: any) => sum + parseFloat(tx.price), 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-primary">
        <Header onOpenMintModal={() => setShowMintModal(true)} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to view your assets</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-primary">
        <Header onOpenMintModal={() => setShowMintModal(true)} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your assets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      <Header onOpenMintModal={() => setShowMintModal(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">My VR Assets</h1>
          <p className="text-gray-400">Manage and track your VR asset collection</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-morphism p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-neon-cyan">{userAssets.length}</div>
                <div className="text-sm text-gray-400">Assets Owned</div>
              </div>
              <div className="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
                <Grid className="w-6 h-6 text-neon-cyan" />
              </div>
            </div>
          </div>
          
          <div className="glass-morphism p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-neon-purple">{totalValue.toFixed(2)} ICP</div>
                <div className="text-sm text-gray-400">Total Value</div>
              </div>
              <div className="w-12 h-12 bg-neon-purple/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-neon-purple" />
              </div>
            </div>
          </div>
          
          <div className="glass-morphism p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-neon-blue">{completedSales.length}</div>
                <div className="text-sm text-gray-400">Assets Sold</div>
              </div>
              <div className="w-12 h-12 bg-neon-blue/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-neon-blue" />
              </div>
            </div>
          </div>
          
          <div className="glass-morphism p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">{totalSales.toFixed(2)} ICP</div>
                <div className="text-sm text-gray-400">Sales Revenue</div>
              </div>
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-dark-secondary border-gray-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button
            onClick={() => setShowMintModal(true)}
            className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-blue hover:to-neon-purple animate-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Asset
          </Button>
        </div>

        {/* Assets Grid */}
        {userAssets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-dark-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Grid className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Assets Yet</h3>
            <p className="text-gray-400 mb-6">Start building your VR asset collection</p>
            <Button
              onClick={() => setShowMintModal(true)}
              className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-blue hover:to-neon-purple"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Asset
            </Button>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {sortedAssets.map((asset, index) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onPreview={() => handlePreview3D(asset)}
                onPurchase={() => {}} // Owner can't purchase their own asset
                animationDelay={index * 0.1}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Recent Transaction History */}
        {userTransactions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="glass-morphism rounded-xl p-6">
              <div className="space-y-4">
                {userTransactions.slice(0, 5).map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-dark-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.sellerId === user.id ? 'bg-green-400/20' : 'bg-neon-blue/20'
                      }`}>
                        <TrendingUp className={`w-5 h-5 ${
                          tx.sellerId === user.id ? 'text-green-400' : 'text-neon-blue'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium">
                          {tx.sellerId === user.id ? 'Sold Asset' : 'Purchased Asset'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        tx.sellerId === user.id ? 'text-green-400' : 'text-neon-cyan'
                      }`}>
                        {tx.sellerId === user.id ? '+' : '-'}{tx.price} ICP
                      </div>
                      <div className={`text-xs ${
                        tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {tx.status === 'completed' ? 'Completed' : 'Pending'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <MintAssetModal 
        open={showMintModal} 
        onClose={() => setShowMintModal(false)} 
      />
      
      <Asset3DPreviewModal
        open={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        asset={selectedAsset}
        onPurchase={() => {}} // Owner can't purchase their own asset
      />
    </div>
  );
}