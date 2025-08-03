import { useEffect, useState } from "react";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header({ onOpenMintModal }: { onOpenMintModal: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [principal, setPrincipal] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0 ICP");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedPrincipal = localStorage.getItem("userPrincipal");
    const storedBalance = localStorage.getItem("userBalance") || "0 ICP";
    setPrincipal(storedPrincipal);
    setBalance(storedBalance);
  }, []);

  const handleConnect = () => {
    navigate("/wallet"); // ✅ this will now work
  };

  return (
    <header className="glass-morphism border-b border-neon-cyan/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm">VR</span>
              </div>
              <span className="text-xl font-bold gradient-text">VRMarket</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/" 
                className={`transition-colors ${
                  location === "/" ? "text-neon-cyan" : "text-gray-400 hover:text-neon-cyan"
                }`}
              >
                Marketplace
              </Link>
              <button 
                onClick={onOpenMintModal}
                className="text-gray-400 hover:text-neon-cyan transition-colors"
              >
                Create
              </button>
              <Link 
                href="/my-assets" 
                className={`transition-colors ${
                  location === "/my-assets" ? "text-neon-cyan" : "text-gray-400 hover:text-neon-cyan"
                }`}
              >
                My Assets
              </Link>
              <Link 
                href="/analytics" 
                className={`transition-colors ${
                  location === "/analytics" ? "text-neon-cyan" : "text-gray-400 hover:text-neon-cyan"
                }`}
              >
                Analytics
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Input
                type="text"
                placeholder="Search VR assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-secondary border-gray-700 w-64 pr-10 focus:border-neon-cyan"
              />
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
            </div>

            {principal ? (
  <div className="flex items-center space-x-3">
    <div className="text-right hidden sm:block">
      <div className="text-sm font-medium">
        {principal.slice(0, 6)}...{principal.slice(-4)}
      </div>
      <div className="text-xs text-gray-400">{balance}</div>
    </div>

    <div className="w-8 h-8 bg-neon-purple rounded-full flex items-center justify-center">
      <span className="text-sm font-semibold">
        {principal.slice(0, 2).toUpperCase()}
      </span>
    </div>

    {/* 🔴 Logout Button */}
    <Button
      onClick={() => {
        // Optional: disconnect from Plug wallet
        if (window.ic?.plug?.disconnect) {
          window.ic.plug.disconnect();
        }

        // Clear saved wallet data
        localStorage.removeItem("userPrincipal");
        localStorage.removeItem("userBalance");

        // Clear UI state
        setPrincipal(null);
        setBalance("0 ICP");

        // Optional: redirect to homepage
        navigate("/");
      }}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
    >
      Logout
    </Button>
  </div>
) : (
  <Button
    onClick={handleConnect}
    className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-blue hover:to-neon-purple animate-glow"
  >
    Connect Wallet
  </Button>
)}


            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
