import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { VRAssetWithOwner } from "@shared/schema";

interface TransactionLoadingModalProps {
  open: boolean;
  onClose: () => void;
  asset: VRAssetWithOwner | null;
}

type TransactionStep = "submitted" | "confirming" | "completed" | "failed";

export default function TransactionLoadingModal({ 
  open, 
  onClose, 
  asset 
}: TransactionLoadingModalProps) {
  const [currentStep, setCurrentStep] = useState<TransactionStep>("submitted");
  const [transactionHash] = useState(`0x${Math.random().toString(16).substring(2, 18)}...`);

  useEffect(() => {
    if (!open) {
      setCurrentStep("submitted");
      return;
    }

    const timer1 = setTimeout(() => {
      setCurrentStep("confirming");
    }, 1000);

    const timer2 = setTimeout(() => {
      setCurrentStep("completed");
    }, 3000);

    const timer3 = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [open, onClose]);

  const getStepStatus = (step: TransactionStep) => {
    const steps = ["submitted", "confirming", "completed"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const getStatusMessage = () => {
    switch (currentStep) {
      case "submitted":
        return "Transaction submitted to the blockchain...";
      case "confirming":
        return "Awaiting blockchain confirmation...";
      case "completed":
        return `Successfully purchased ${asset?.title || "asset"}!`;
      case "failed":
        return "Transaction failed. Please try again.";
      default:
        return "Processing transaction...";
    }
  };

  const getStatusTitle = () => {
    switch (currentStep) {
      case "submitted":
        return "Processing Transaction";
      case "confirming":
        return "Confirming Transaction";
      case "completed":
        return "Transaction Complete";
      case "failed":
        return "Transaction Failed";
      default:
        return "Processing Transaction";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-morphism neon-border max-w-md">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-6">
            {currentStep === "completed" ? (
              <CheckCircle className="w-16 h-16 text-green-400" />
            ) : currentStep === "failed" ? (
              <AlertCircle className="w-16 h-16 text-red-400" />
            ) : (
              <div className="w-16 h-16 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-neon-cyan">
            {getStatusTitle()}
          </h3>
          <p className="text-gray-400 mb-6">
            {getStatusMessage()}
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-dark-secondary rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Transaction Hash:</span>
              </div>
              <div className="font-mono text-xs bg-dark-primary p-2 rounded border break-all">
                {transactionHash}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <div className={`w-4 h-4 rounded-full ${
                  getStepStatus("submitted") === "completed" 
                    ? "bg-green-500" 
                    : getStepStatus("submitted") === "active"
                    ? "bg-neon-cyan animate-pulse"
                    : "bg-gray-600"
                }`} />
                <span>Transaction submitted</span>
                {getStepStatus("submitted") === "completed" && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className={`w-4 h-4 rounded-full ${
                  getStepStatus("confirming") === "completed" 
                    ? "bg-green-500" 
                    : getStepStatus("confirming") === "active"
                    ? "bg-neon-cyan animate-pulse-neon"
                    : "bg-gray-600"
                }`} />
                <span>Awaiting confirmation</span>
                {getStepStatus("confirming") === "completed" && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className={`w-4 h-4 rounded-full ${
                  getStepStatus("completed") === "completed" 
                    ? "bg-green-500" 
                    : getStepStatus("completed") === "active"
                    ? "bg-neon-cyan animate-pulse-neon"
                    : "bg-gray-600"
                }`} />
                <span>Asset transferred</span>
                {getStepStatus("completed") === "completed" && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
          </div>

          {asset && (
            <div className="bg-dark-secondary/50 rounded-lg p-3 text-left">
              <div className="text-sm text-gray-400 mb-1">Purchasing:</div>
              <div className="font-semibold">{asset.title}</div>
              <div className="text-neon-cyan font-semibold">{asset.price} ICP</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
