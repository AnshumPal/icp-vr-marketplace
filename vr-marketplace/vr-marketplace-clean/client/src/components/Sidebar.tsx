import { Plus, Upload, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  marketStats?: any;
  onOpenMintModal: () => void;
}

export default function Sidebar({ marketStats, onOpenMintModal }: SidebarProps) {
  const { user } = useWallet();

  const { data: userAssets = [] } = useQuery({
    queryKey: user ? ["/api/users", user.id, "assets"] : undefined,
    enabled: !!user,
  });

  const { data: userTransactions = [] } = useQuery({
    queryKey: user ? ["/api/users", user.id, "transactions"] : undefined,
    enabled: !!user,
  });

  const totalValue = userAssets.reduce((sum: number, asset: any) => sum + parseFloat(asset.price), 0);

  return (
    <aside className="w-64 glass-morphism border-r border-neon-cyan/20 p-6 hidden lg:block">
      <div className="space-y-6">
        {/* Portfolio Stats */}
        {user && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Portfolio</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-dark-secondary/50 border border-neon-cyan/20">
                <div className="text-2xl font-bold text-neon-cyan">{user.balance} ICP</div>
                <div className="text-sm text-gray-400">Wallet Balance</div>
              </div>
              <div className="p-3 rounded-lg bg-dark-secondary/50 border border-neon-purple/20">
                <div className="text-2xl font-bold text-neon-purple">{userAssets.length}</div>
                <div className="text-sm text-gray-400">Assets Owned</div>
              </div>
              <div className="p-3 rounded-lg bg-dark-secondary/50 border border-neon-blue/20">
                <div className="text-2xl font-bold text-neon-blue">{totalValue.toFixed(2)} ICP</div>
                <div className="text-sm text-gray-400">Total Value</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto hover:bg-dark-secondary/50"
              onClick={onOpenMintModal}
            >
              <Plus className="w-5 h-5 text-neon-cyan mr-3" />
              <span>Mint New Asset</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto hover:bg-dark-secondary/50"
            >
              <Upload className="w-5 h-5 text-neon-purple mr-3" />
              <span>Import from Files</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto hover:bg-dark-secondary/50"
            >
              <BarChart3 className="w-5 h-5 text-neon-blue mr-3" />
              <span>View Analytics</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        {user && userTransactions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Recent Activity</h3>
            <div className="space-y-3">
              {userTransactions.slice(0, 3).map((tx: any) => (
                <div key={tx.id} className="p-3 rounded-lg bg-dark-secondary/30 border border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Transaction</div>
                    <div className={`text-xs ${
                      tx.status === "completed" ? "text-green-400" : "text-yellow-400"
                    }`}>
                      {tx.status === "completed" ? "Completed" : "Pending"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Overview */}
        {marketStats && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Market Overview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">24h Volume:</span>
                <span className="text-neon-cyan">{marketStats.totalVolume} ICP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Price:</span>
                <span className="text-neon-purple">{marketStats.avgPrice} ICP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Assets:</span>
                <span className="text-neon-blue">{marketStats.totalAssets}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
