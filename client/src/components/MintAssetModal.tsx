import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { apiRequest } from "@/lib/queryClient";
import type { InsertVRAsset } from "@shared/schema";

interface MintAssetModalProps {
  open: boolean;
  onClose: () => void;
}

export default function MintAssetModal({ open, onClose }: MintAssetModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    previewUrl: "",
    modelUrl: "",
    fileSize: ""
  });

  const { user } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mintAssetMutation = useMutation({
    mutationFn: async (data: InsertVRAsset) => {
      const response = await apiRequest("POST", "/api/assets", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Asset Minted Successfully!",
        description: "Your VR asset has been minted and is now available in the marketplace.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Minting Failed",
        description: "There was an error minting your asset. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      price: "",
      previewUrl: "",
      modelUrl: "",
      fileSize: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint assets.",
        variant: "destructive",
      });
      return;
    }

    const assetData: InsertVRAsset = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      previewUrl: formData.previewUrl,
      modelUrl: formData.modelUrl || undefined,
      fileSize: formData.fileSize || undefined,
      ownerId: user.id,
    };

    mintAssetMutation.mutate(assetData);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const mintingFee = "0.001";
  const platformFee = "0.002";
  const gasFee = "0.0005";
  const totalCost = (parseFloat(mintingFee) + parseFloat(platformFee) + parseFloat(gasFee)).toFixed(4);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-morphism neon-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold gradient-text">
              Mint New VR Asset
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="title">Asset Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                placeholder="Enter asset title..."
                className="bg-dark-secondary border-gray-700 focus:border-neon-cyan"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Describe your VR asset..."
                className="bg-dark-secondary border-gray-700 focus:border-neon-cyan h-24"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                <SelectTrigger className="bg-dark-secondary border-gray-700 focus:border-neon-cyan">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="art">Art Gallery</SelectItem>
                  <SelectItem value="social">Social Space</SelectItem>
                  <SelectItem value="workspace">Workspace</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price (ICP)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => updateFormData("price", e.target.value)}
                placeholder="0.00"
                className="bg-dark-secondary border-gray-700 focus:border-neon-cyan"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="previewUrl">Preview URL</Label>
              <Input
                id="previewUrl"
                type="url"
                value={formData.previewUrl}
                onChange={(e) => updateFormData("previewUrl", e.target.value)}
                placeholder="https://example.com/preview.jpg"
                className="bg-dark-secondary border-gray-700 focus:border-neon-cyan"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label>3D Asset File</Label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-neon-cyan transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Drag and drop your 3D asset file here, or</p>
                <Button type="button" variant="link" className="text-neon-cyan hover:text-neon-blue">
                  browse files
                </Button>
                <p className="text-xs text-gray-500 mt-2">Supports .glb, .gltf, .fbx files (max 50MB)</p>
              </div>
            </div>
          </div>

          {/* Transaction Preview */}
          <div className="bg-dark-secondary/50 rounded-lg p-4 border border-neon-cyan/20">
            <h4 className="font-medium text-neon-cyan mb-3">Transaction Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Minting Fee:</span>
                <span>{mintingFee} ICP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Platform Fee:</span>
                <span>{platformFee} ICP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gas Fee:</span>
                <span>{gasFee} ICP</span>
              </div>
              <hr className="border-gray-700" />
              <div className="flex justify-between font-semibold">
                <span>Total Cost:</span>
                <span className="text-neon-cyan">{totalCost} ICP</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mintAssetMutation.isPending || !user}
              className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-blue hover:to-neon-purple animate-glow"
            >
              {mintAssetMutation.isPending ? "Minting..." : "Mint Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
