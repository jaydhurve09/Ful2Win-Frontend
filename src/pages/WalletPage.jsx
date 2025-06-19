import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header"; 
import WalletCard from "../components/Wallet/WalletCard";
import ActionButtons from "../components/Wallet/ActionButtons";
import History from "../components/Wallet/History";
import WithdrawPage from "../components/Wallet/WithdrawPage";
import AddMoneyPage from "../components/Wallet/AddMoneyPage";
import BackgroundBubbles from "../components/BackgroundBubbles";

// CSS Imports
import "../components/Wallet/WalletCard.css";
import "../components/Wallet/ActionButtons.css";
import "../components/Wallet/History.css";
import "../components/Wallet/TransactionPage.css";

const WalletPage = () => {
  const [view, setView] = useState("main"); // options: main, add, withdraw

  const handleAction = (action) => {
    setView(action); // 'add' or 'withdraw'
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-blueGradient">
      {/* Background bubbles */}
      <BackgroundBubbles />

      {/* Foreground content */}
      <div className="relative z-10">
        <Header /> 

        {view === "main" && (
          <div className="container mx-auto px-4 py-6 flex flex-col items-center gap-6">
            <WalletCard onAction={handleAction} />
            <ActionButtons onAction={handleAction} />
            <History />
          </div>
        )}

        {view === "add" && (
          <div className="container mx-auto px-4 py-6">
            <AddMoneyPage />
          </div>
        )}

        {view === "withdraw" && (
          <div className="container mx-auto px-4 py-6">
            <WithdrawPage />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full z-20">
        <Navbar />
      </div>
    </div>
  );
};

export default WalletPage;