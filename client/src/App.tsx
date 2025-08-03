import React from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Marketplace from "@/pages/marketplace";
import MyAssets from "@/pages/my-assets";
import Analytics from "@/pages/analytics";
import Wallet from "./pages/wallet";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/" element={<Marketplace />} />
              <Route path="/my-assets" element={<MyAssets />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </TooltipProvider>
    </div>
  );
}

export default App;
