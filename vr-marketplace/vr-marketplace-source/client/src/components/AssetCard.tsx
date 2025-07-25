import { Play, Heart, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VRAssetWithOwner } from "@shared/schema";

interface AssetCardProps {
  asset: VRAssetWithOwner;
  onPreview: () => void;
  onPurchase: () => void;
  animationDelay?: number;
  viewMode?: "grid" | "list";
}

export default function AssetCard({ 
  asset, 
  onPreview, 
  onPurchase, 
  animationDelay = 0,
  viewMode = "grid"
}: AssetCardProps) {
  const categoryColors = {
    gaming: "bg-neon-purple/80",
    workspace: "bg-neon-blue/80",
    art: "bg-gradient-to-r from-neon-purple to-neon-cyan",
    nature: "bg-green-500/80",
    "sci-fi": "bg-indigo-500/80",
    fantasy: "bg-amber-600/80",
    social: "bg-pink-500/80",
    educational: "bg-teal-500/80",
  };

  const categoryColor = categoryColors[asset.category as keyof typeof categoryColors] || "bg-gray-500/80";

  if (viewMode === "list") {
    return (
      <div className="glass-morphism rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 neon-border">
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={asset.previewUrl}
              alt={asset.title}
              className="w-full h-full object-cover"
            />
            <Button
              size="sm"
              className="absolute bottom-2 right-2 w-6 h-6 p-0 bg-black/50 backdrop-blur-sm hover:bg-neon-cyan/20"
              onClick={onPreview}
            >
              <Play className="w-3 h-3 text-neon-cyan" />
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{asset.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{asset.description}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className={`${categoryColor} text-white text-xs`}>
                    {asset.category}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-neon-blue rounded-full"></div>
                    <span className="text-sm text-gray-400">@{asset.owner.username}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-neon-cyan font-semibold text-lg">{asset.price} ICP</div>
                <div className="text-xs text-gray-400">${(parseFloat(asset.price) * 36).toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Share className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={onPurchase}
              className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-blue hover:to-neon-purple"
            >
              Purchase
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="glass-morphism rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 neon-border animate-float"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className="relative">
        <img
          src={asset.previewUrl}
          alt={asset.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className={`${categoryColor} text-white text-xs`}>
            {asset.category}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <Button
            size="sm"
            className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-neon-cyan/20"
            onClick={onPreview}
          >
            <Play className="w-5 h-5 text-neon-cyan" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{asset.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{asset.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-neon-blue rounded-full"></div>
            <span className="text-sm text-gray-400">@{asset.owner.username}</span>
          </div>
          <div className="text-right">
            <div className="text-neon-cyan font-semibold">{asset.price} ICP</div>
            <div className="text-xs text-gray-400">${(parseFloat(asset.price) * 36).toFixed(2)}</div>
          </div>
        </div>
        
        <Button
          onClick={onPurchase}
          className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-blue hover:to-neon-purple transition-all duration-300"
        >
          Purchase Asset
        </Button>
      </div>
    </div>
  );
}
