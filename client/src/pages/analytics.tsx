import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import MintAssetModal from "@/components/MintAssetModal";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, Package } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import type { VRAssetWithOwner } from "@shared/schema";

export default function Analytics() {
  const [showMintModal, setShowMintModal] = useState(false);
  const { user } = useWallet();

  const { data: assets = [] } = useQuery<VRAssetWithOwner[]>({
    queryKey: ["/api/assets"],
  });

  const { data: marketStats } = useQuery({
    queryKey: ["/api/market/stats"],
  });

  const { data: userAssets = [] } = useQuery<VRAssetWithOwner[]>({
    queryKey: user ? ["/api/users", user.id, "assets"] : ["/api/users", "0", "assets"],
    enabled: !!user,
  });

  const { data: userTransactions = [] } = useQuery<any[]>({
    queryKey: user ? ["/api/users", user.id, "transactions"] : ["/api/users", "0", "transactions"],
    enabled: !!user,
  });

  // Calculate category distribution
  const categoryStats = (assets || []).reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalAssets = (assets || []).length;
  const categoryData = Object.entries(categoryStats).map(([category, count]) => ({
    category,
    count,
    percentage: (count / totalAssets) * 100
  })).sort((a, b) => b.count - a.count);

  // Price range analysis
  const priceRanges = {
    "0-1 ICP": (assets || []).filter(a => parseFloat(a.price) < 1).length,
    "1-3 ICP": (assets || []).filter(a => parseFloat(a.price) >= 1 && parseFloat(a.price) < 3).length,
    "3-5 ICP": (assets || []).filter(a => parseFloat(a.price) >= 3 && parseFloat(a.price) < 5).length,
    "5+ ICP": (assets || []).filter(a => parseFloat(a.price) >= 5).length,
  };

  // User portfolio analysis
  const userPortfolioValue = (userAssets || []).reduce((sum, asset) => sum + parseFloat(asset.price), 0);
  const userSales = (userTransactions || []).filter((tx: any) => tx.sellerId === user?.id && tx.status === "completed");
  const userPurchases = (userTransactions || []).filter((tx: any) => tx.buyerId === user?.id && tx.status === "completed");
  const totalSalesRevenue = userSales.reduce((sum: number, tx: any) => sum + parseFloat(tx.price), 0);

  // Recent trends (mock data for demonstration)
  const weeklyData = [
    { week: "Week 1", assets: 156, volume: 42.3 },
    { week: "Week 2", assets: 189, volume: 58.7 },
    { week: "Week 3", assets: 234, volume: 73.1 },
    { week: "Week 4", assets: 287, volume: 91.4 },
  ];

  const growthRate = ((weeklyData[3].assets - weeklyData[0].assets) / weeklyData[0].assets) * 100;
  const volumeGrowth = ((weeklyData[3].volume - weeklyData[0].volume) / weeklyData[0].volume) * 100;

  const categoryColors = {
    gaming: "bg-neon-purple",
    workspace: "bg-neon-blue",
    art: "bg-gradient-to-r from-neon-purple to-neon-cyan",
    nature: "bg-green-500",
    "sci-fi": "bg-indigo-500",
    fantasy: "bg-amber-600",
    social: "bg-pink-500",
    educational: "bg-teal-500",
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      <Header onOpenMintModal={() => setShowMintModal(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">VR Marketplace Analytics</h1>
          <p className="text-gray-400">Market insights and performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-neon-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Assets</CardTitle>
              <Package className="h-4 w-4 text-neon-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-cyan">{(marketStats as any)?.totalAssets || 0}</div>
              <div className="flex items-center text-xs text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{growthRate.toFixed(1)}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-neon-purple/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-neon-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-purple">{(marketStats as any)?.totalVolume || 0} ICP</div>
              <div className="flex items-center text-xs text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{volumeGrowth.toFixed(1)}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-neon-blue/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
              <Users className="h-4 w-4 text-neon-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-blue">{(marketStats as any)?.activeUsers || 0}</div>
              <div className="flex items-center text-xs text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.3% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-green-400/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg Price</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{(marketStats as any)?.avgPrice || 0} ICP</div>
              <div className="flex items-center text-xs text-red-400">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Distribution */}
          <Card className="glass-morphism border-neon-cyan/20">
            <CardHeader>
              <CardTitle className="text-neon-cyan">Category Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryData.map(({ category, count, percentage }) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${categoryColors[category as keyof typeof categoryColors] || 'bg-gray-500'} text-white text-xs`}>
                        {category}
                      </Badge>
                      <span className="text-sm text-gray-400">{count} assets</span>
                    </div>
                    <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Price Range Analysis */}
          <Card className="glass-morphism border-neon-purple/20">
            <CardHeader>
              <CardTitle className="text-neon-purple">Price Range Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(priceRanges).map(([range, count]) => {
                const percentage = (count / totalAssets) * 100;
                return (
                  <div key={range} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{range}</span>
                      <span className="text-sm text-gray-400">{count} assets ({percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* User Portfolio Analytics (if logged in) */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="glass-morphism border-neon-blue/20">
              <CardHeader>
                <CardTitle className="text-neon-blue">My Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assets Owned:</span>
                    <span className="font-semibold">{userAssets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Portfolio Value:</span>
                    <span className="font-semibold text-neon-cyan">{userPortfolioValue.toFixed(2)} ICP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wallet Balance:</span>
                    <span className="font-semibold text-neon-purple">{user.balance} ICP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-green-400/20">
              <CardHeader>
                <CardTitle className="text-green-400">Sales Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assets Sold:</span>
                    <span className="font-semibold">{userSales.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Revenue:</span>
                    <span className="font-semibold text-green-400">{totalSalesRevenue.toFixed(2)} ICP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Sale Price:</span>
                    <span className="font-semibold">
                      {userSales.length > 0 ? (totalSalesRevenue / userSales.length).toFixed(2) : '0.00'} ICP
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-neon-cyan/20">
              <CardHeader>
                <CardTitle className="text-neon-cyan">Purchase Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assets Purchased:</span>
                    <span className="font-semibold">{userPurchases.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Spent:</span>
                    <span className="font-semibold text-neon-blue">
                      {userPurchases.reduce((sum: number, tx: any) => sum + parseFloat(tx.price), 0).toFixed(2)} ICP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Activity:</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {(userTransactions || []).length > 5 ? 'High' : (userTransactions || []).length > 2 ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Market Trends */}
        <Card className="glass-morphism border-neon-purple/20">
          <CardHeader>
            <CardTitle className="text-neon-purple">Market Trends (Last 4 Weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {weeklyData.map((week, index) => (
                <div key={week.week} className="text-center p-4 bg-dark-secondary/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">{week.week}</div>
                  <div className="text-lg font-bold text-neon-cyan mb-1">{week.assets}</div>
                  <div className="text-xs text-gray-400 mb-2">Assets Listed</div>
                  <div className="text-lg font-bold text-neon-purple">{week.volume} ICP</div>
                  <div className="text-xs text-gray-400">Volume Traded</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <MintAssetModal 
        open={showMintModal} 
        onClose={() => setShowMintModal(false)} 
      />
    </div>
  );
}