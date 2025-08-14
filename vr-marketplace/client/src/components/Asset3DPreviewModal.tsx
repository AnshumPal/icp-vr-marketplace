import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Heart, Share, RotateCcw } from "lucide-react";
import ThreeJSViewer from "./ThreeJSViewer";
import type { VRAssetWithOwner } from "@shared/schema";
import CyberpunkArena from "./models/CyberpunkArena";




const modelMapping: Record<string, React.FC> = {
  "/models/cyberpunk_arena.glb": CyberpunkArena,
};

interface ModelPreviewProps {
  modelKey: string;
}

function ModelPreview({ modelKey }: { modelKey: string }) {
  const ModelComponent = modelMapping[modelKey];
  if (!ModelComponent) return <p>Model not found</p>;
  return <ModelComponent />;
}



interface Asset3DPreviewModalProps {
  open: boolean;
  onClose: () => void;
  asset: VRAssetWithOwner | null;
  onPurchase: () => void;
}


export default function Asset3DPreviewModal({ 
  open, 
  onClose, 
  asset, 
  onPurchase 
}: Asset3DPreviewModalProps) {
  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-morphism neon-border max-w-6xl w-full h-[80vh] p-0">
  <div className="flex flex-col h-full overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between p-6 border-b border-neon-cyan/20 shrink-0">
      <div className="overflow-hidden">
        <h2 className="text-2xl font-bold text-white truncate">{asset.title}</h2>
        <p className="text-gray-400 truncate">{asset.description}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X className="w-6 h-6" />
      </Button>
    </div>

    {/* Main content */}
    <div className="p-6 flex-1 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Model viewer */}
        <div className="lg:col-span-3 h-full overflow-hidden rounded-xl">
          {/* <ThreeJSViewer
            modelUrl={asset.modelUrl}
            className="bg-dark-secondary rounded-xl w-full h-full"
          /> */}
          {/* <CyberpunkArena  /> */}
          <ModelPreview modelKey={asset.modelUrl} />
        </div>

        {/* Side panel */}
        <div className="space-y-6 overflow-y-auto pr-2">
          {/* Asset details */}
          <div className="glass-morphism p-4 rounded-xl">
            <h3 className="font-semibold mb-3 text-neon-cyan">Asset Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Owner:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-6 h-6 bg-neon-purple rounded-full"></div>
                  <span>@{asset.owner.username}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Price:</span>
                <div className="text-neon-cyan font-semibold mt-1">{asset.price} ICP</div>
              </div>
              <div>
                <span className="text-gray-400">Category:</span>
                <div className="mt-1 capitalize">{asset.category}</div>
              </div>
              {asset.fileSize && (
                <div>
                  <span className="text-gray-400">File Size:</span>
                  <div className="mt-1">{asset.fileSize}</div>
                </div>
              )}
              <div>
                <span className="text-gray-400">Created:</span>
                <div className="mt-1">{new Date(asset.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="glass-morphism p-4 rounded-xl">
            <h3 className="font-semibold mb-3 text-neon-cyan">Controls</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <kbd className="bg-dark-secondary px-2 py-1 rounded text-xs">Mouse</kbd>
                <span className="text-gray-400">Rotate view</span>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="bg-dark-secondary px-2 py-1 rounded text-xs">Wheel</kbd>
                <span className="text-gray-400">Zoom in/out</span>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="bg-dark-secondary px-2 py-1 rounded text-xs">R</kbd>
                <span className="text-gray-400">Reset view</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onPurchase}
              className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-blue hover:to-neon-purple transition-all duration-300"
            >
              Purchase Asset
            </Button>
            <Button
              variant="outline"
              className="w-full border-neon-purple text-neon-purple hover:bg-neon-purple/10"
            >
              <Heart className="w-4 h-4 mr-2" />
              Add to Wishlist
            </Button>
            <Button
              variant="outline"
              className="w-full hover:bg-gray-700"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Asset
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</DialogContent>

    </Dialog>
  );
}
