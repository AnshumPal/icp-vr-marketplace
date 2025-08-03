import "../types/plug.d";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Wallet: React.FC = () => {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("Loading...");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const loadWallet = async () => {
    try {
      if (!window.ic?.plug) {
        setError("⚠️ Plug Wallet not found.");
        return;
      }

      const isConnected = await window.ic.plug.isConnected();
      const isLocked = window.ic.plug.isWalletLocked;

      if (!isConnected || isLocked) {
        await window.ic.plug.requestConnect(); // Prompt unlock
      }

      const principalObj = await window.ic.plug.agent.getPrincipal();
      const principalText = principalObj.toText();
      setPrincipal(principalText);
      localStorage.setItem("userPrincipal", principalText);

      const balances = await window.ic.plug.requestBalance();
      const icp = balances.find((b) => b.symbol === "ICP");

      if (icp) {
        const icpValue = icp.amount / Math.pow(10, icp.decimals);
        const formatted = `${icpValue.toFixed(4)} ICP`;
        setBalance(formatted);
        localStorage.setItem("userBalance", formatted);
      } else {
        setBalance("0 ICP");
      }

      setError("");
    } catch (err) {
      console.error("❌ Wallet error:", err);
      setError("❌ Failed to connect or load wallet.");
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-6">🔐 My Wallet</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!error && principal && (
        <div className="bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-xl text-center">
          <p className="mb-4 break-all">
            <strong>Principal ID:</strong><br />
            {principal}
          </p>
          <p className="text-2xl font-semibold">
            💰 Balance: <span className="text-green-400">{balance}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Wallet;
