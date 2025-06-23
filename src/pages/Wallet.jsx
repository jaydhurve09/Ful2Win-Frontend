import React, { useEffect, useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi';
import { FaRedoAlt, FaPlay, FaBolt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';
import SpinWheelScreen from '../components/SpinWheelScreen';

const Wallet = () => {
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState({ balance: 0, coins: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [showSpinWheel, setShowSpinWheel] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const res = await fetch('/api/wallet');
        const contentType = res.headers.get('content-type');

        if (!res.ok || !contentType?.includes('application/json')) {
          throw new Error('Invalid JSON response from server');
        }

        const data = await res.json();
        setWalletData(data);
      } catch (error) {
        // fallback dummy data
        setWalletData({
          balance: 1234.56,
          coins: 12345,
          transactions: [
            { id: 1, type: 'Add', amount: 500 },
            { id: 2, type: 'Withdraw', amount: 200 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleSpinClick = () => setShowSpinWheel(true);
  const handleCloseSpin = () => setShowSpinWheel(false);

  const handleReward = (reward) => {
    if (reward.includes('Coins')) {
      const coinsWon = parseInt(reward);
      setWalletData((prev) => ({
        ...prev,
        coins: prev.coins + coinsWon,
      }));
    }
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff]">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

        <div className="pt-20 px-4 max-w-4xl mx-auto space-y-6">
          {/* Wallet Card */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-white text-center shadow-lg border border-white/20">
            <div className="w-20 h-20 rounded-full bg-yellow-400 mx-auto flex items-center justify-center overflow-hidden mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3069/3069172.png"
                alt="Profile"
                className="w-16 h-16 object-contain"
              />
            </div>

            <div className="text-left mt-2">
              <p className="text-sm text-white/80">Wallet Balance</p>
              <h2 className="text-2xl font-bold text-white">₹ {walletData.balance}</h2>
              <hr className="my-2 border-white/30" />
              <p className="text-sm text-white/80">Coins</p>
              <h3 className="flex items-center gap-2 text-yellow-300 font-semibold text-lg">
                {walletData.coins} <GiTwoCoins size={20} />
              </h3>
              <hr className="my-2 border-white/30" />
            </div>

            <button
              className="w-full mt-4 py-2 rounded-xl bg-yellow-400 text-blue-900 font-bold text-lg shadow-md hover:bg-yellow-300"
              onClick={() => navigate('/add')}
            >
              ADD ₹
            </button>
            <button
              className="w-full mt-3 py-2 rounded-xl border border-blue-300 bg-blue-900/60 hover:bg-white/10 transition"
              onClick={() => navigate('/withdraw')}
            >
              WITHDRAW ₹
            </button>

            <p className="text-xs text-yellow-100 mt-3 text-center">
              After KYC<br />
              Coins not Withdrawable
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {[
              { icon: <FaRedoAlt size={18} className="text-blue-900" />, label: 'Spin', onClick: handleSpinClick },
              { icon: <FaPlay size={18} className="text-blue-900" />, label: 'Ads', onClick: () => navigate('/ads') },
              { icon: <FaBolt size={18} className="text-blue-900" />, label: 'Challenges', onClick: () => navigate('/challenges') },
            ].map((action, idx) => (
              <div
                key={idx}
                onClick={action.onClick}
                className="w-24 h-24 rounded-xl border border-blue-300 bg-blue-900/60 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-blue-800 transition"
              >
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center mb-2">
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-white">{action.label}</span>
              </div>
            ))}
          </div>

          {/* History Button (Recent Transactions Removed) */}
          <div className="w-full px-4 mt-4">
            <button
              onClick={() => navigate('/history')}
              className="w-full py-3 border border-blue-300 bg-blue-900/60 text-white text-center rounded-xl text-base font-semibold hover:bg-white/10 transition"
            >
              History
            </button>
          </div>
        </div>
      </div>

      <Navbar />

      {showSpinWheel && (
        <SpinWheelScreen
          isVisible={showSpinWheel}
          onClose={handleCloseSpin}
          onReward={handleReward}
        />
      )}
    </div>
  );
};

export default Wallet;
