import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for existing wallet connection on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("vr_wallet_address");
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, []);

  // Get user data when wallet is connected
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["/api/wallet", walletAddress],
    enabled: !!walletAddress,
  });

  const connectWalletMutation = useMutation({
    mutationFn: async () => {
      // Simulate wallet connection
      const mockWalletAddress = `ic${Math.random().toString(36).substring(2, 15)}`;
      const mockUsername = `user_${Math.random().toString(36).substring(2, 8)}`;
      
      const response = await apiRequest("POST", "/api/wallet/connect", {
        walletAddress: mockWalletAddress,
        username: mockUsername,
      });
      
      return { walletAddress: mockWalletAddress, user: await response.json() };
    },
    onSuccess: ({ walletAddress, user }) => {
      setWalletAddress(walletAddress);
      localStorage.setItem("vr_wallet_address", walletAddress);
      toast({
        title: "Wallet Connected",
        description: `Connected as ${user.username}`,
      });
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    },
  });

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem("vr_wallet_address");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return {
    user,
    walletAddress,
    isConnected: !!walletAddress,
    isConnecting: connectWalletMutation.isPending,
    isLoadingUser,
    connectWallet: connectWalletMutation.mutate,
    disconnectWallet,
  };
}
