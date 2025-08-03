import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AssetCard from "@/components/AssetCard";
import MintAssetModal from "@/components/MintAssetModal";
import Asset3DPreviewModal from "@/components/Asset3DPreviewModal";
import TransactionLoadingModal from "@/components/TransactionLoadingModal";
import { SkyboxScene } from "@/components/SkyboxScene";
import { SpinningShowcase } from "@/components/SpinningShowcase";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Grid, List } from "lucide-react";
import type { VRAssetWithOwner } from "@shared/schema";

export default function Marketplace() {
  const [showMintModal, setShowMintModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<VRAssetWithOwner | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const { data: assets = [], isLoading } = useQuery<VRAssetWithOwner[]>({
    queryKey: ["/api/assets"],
  });

  const { data: marketStats } = useQuery<{
    totalAssets: number;
    totalVolume: string;
    activeUsers: number;
    avgPrice: string;
  }>({
    queryKey: ["/api/market/stats"],
  });

  const filteredAssets = assets.filter(asset => {
    const price = parseFloat(asset.price);
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesCategory = category === "all" || asset.category === category;
    return matchesPrice && matchesCategory;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "popular":
        return Math.random() - 0.5; // Random for demo
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  const handlePreview3D = (asset: VRAssetWithOwner) => {
    setSelectedAsset(asset);
    setShowAssetModal(true);
  };

  const handlePurchase = (asset: VRAssetWithOwner) => {
    setSelectedAsset(asset);
    setShowTransactionModal(true);
    // Simulate transaction completion
    setTimeout(() => {
      setShowTransactionModal(false);
    }, 4000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading VR Marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      <Header onOpenMintModal={() => setShowMintModal(true)} />
      
      <div className="flex">
        <Sidebar 
          marketStats={marketStats}
          onOpenMintModal={() => setShowMintModal(true)} 
        />
        
        <main className="flex-1 p-6">
          {/* Hero Section with Skybox */}
          <div className="mb-8">
            <div className="relative rounded-2xl overflow-hidden h-96">
              <div className="absolute inset-0">
                <SkyboxScene width={1200} height={400} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
              <div className="relative z-10 p-8 h-full flex items-center">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
                    Discover VR Worlds
                  </h1>
                  <p className="text-xl text-gray-300 mb-6">
                    Mint, trade, and experience immersive VR assets on the Internet Computer blockchain. 
                    Join the next generation of decentralized virtual reality.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-blue hover:to-neon-purple px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform animate-glow">
                      Explore Marketplace
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-neon-purple text-neon-purple hover:bg-neon-purple/10"
                      onClick={() => setShowMintModal(true)}
                    >
                      Start Creating
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Showcase */}
          {sortedAssets.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 gradient-text">Featured Asset</h2>
              <div className="glass-morphism p-6 rounded-xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <SpinningShowcase 
                      width={400} 
                      height={400} 
                      item={{ title: sortedAssets[0].title }}
                    />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-4 text-neon-cyan">{sortedAssets[0].title}</h3>
                    <p className="text-gray-300 mb-4">{sortedAssets[0].description}</p>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-2xl font-bold text-neon-purple">{sortedAssets[0].price} ICP</span>
                      <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-sm">
                        {sortedAssets[0].category}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => handlePreview3D(sortedAssets[0])}
                        variant="outline"
                        className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                      >
                        Preview in 3D
                      </Button>
                      <Button 
                        onClick={() => handlePurchase(sortedAssets[0])}
                        className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-blue hover:to-neon-purple"
                      >
                        Purchase Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Stats */}
          {marketStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-morphism p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-neon-cyan">{marketStats.totalAssets}</div>
                    <div className="text-sm text-gray-400">Total Assets</div>
                  </div>
                  <div className="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
                    <Grid className="w-6 h-6 text-neon-cyan" />
                  </div>
                </div>
              </div>
              <div className="glass-morphism p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-neon-purple">{marketStats.totalVolume} ICP</div>
                    <div className="text-sm text-gray-400">Total Volume</div>
                  </div>
                </div>
              </div>
              <div className="glass-morphism p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-neon-blue">{marketStats.activeUsers}</div>
                    <div className="text-sm text-gray-400">Active Users</div>
                  </div>
                </div>
              </div>
              <div className="glass-morphism p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{marketStats.avgPrice} ICP</div>
                    <div className="text-sm text-gray-400">Average Price</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48 bg-dark-secondary border-gray-700">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="gaming">Gaming Worlds</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="art">Art Galleries</SelectItem>
                  <SelectItem value="social">Social Spaces</SelectItem>
                  <SelectItem value="workspace">Workspace</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-dark-secondary border-gray-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2 bg-dark-secondary rounded-lg p-2">
                <label className="text-sm text-gray-400 whitespace-nowrap">Price Range:</label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10}
                  step={0.1}
                  className="w-32"
                />
                <span className="text-sm text-neon-cyan whitespace-nowrap">{priceRange[0]}-{priceRange[1]} ICP</span>
              </div>
            </div>
            
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

          {/* Asset Gallery */}
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            : "space-y-4 mb-8"
          }>
            {sortedAssets.map((asset, index) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onPreview={() => handlePreview3D(asset)}
                onPurchase={() => handlePurchase(asset)}
                animationDelay={index * 0.1}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center">
            <Button 
              variant="outline"
              className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
            >
              Load More Assets
            </Button>
          </div>
        </main>
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
        onPurchase={() => {
          setShowAssetModal(false);
          if (selectedAsset) handlePurchase(selectedAsset);
        }}
      />
      
      <TransactionLoadingModal
        open={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        asset={selectedAsset}
      />
    </div>
  );
}
