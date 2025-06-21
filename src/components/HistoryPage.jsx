import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaTimes,
  FaCoins,
} from 'react-icons/fa';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';

const getIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'coins earned':
      return 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png';
    case 'game reward':
      return 'https://cdn-icons-png.flaticon.com/512/1185/1185581.png';
    case 'coins withdrawn':
      return 'https://cdn-icons-png.flaticon.com/512/891/891419.png';
    default:
      return 'https://cdn-icons-png.flaticon.com/512/3468/3468373.png';
  }
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ balance: 0, coins: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = {
          balance: 1234.56,
          coins: 12345,
          transactions: [
            {
              id: '1',
              type: 'Coins Earned',
              title: 'Coins Earned',
              date: '2024-01-20 14:30',
              amount: 500,
              isPositive: true,
            },
            {
              id: '2',
              type: 'Game Reward',
              title: 'Game Reward',
              date: '2024-01-20 13:15',
              amount: 200,
              isPositive: true,
            },
            {
              id: '3',
              type: 'Coins Withdrawn',
              title: 'Coins Withdrawn',
              date: '2024-01-19 16:45',
              amount: 300,
              isPositive: false,
            },
            {
              id: '4',
              type: 'Daily Bonus',
              title: 'Daily Bonus',
              date: '2024-01-19 10:00',
              amount: 100,
              isPositive: true,
            }
          ]
        };
        setTimeout(() => {
          setWallet(data);
          setLoading(false);
        }, 500);
      } catch {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff] pb-24">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

        {/* Top Section */}
        <div className="px-4 pt-20 space-y-4 max-w-md mx-auto">
          {/* Balance Card */}
          <div className="bg-blue-600 rounded-xl px-4 py-3 flex justify-between items-center shadow-inner">
            <div>
              <p className="text-sm">Wallet Balance</p>
              <h2 className="text-xl font-bold">₹{wallet.balance.toFixed(2)}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm">Total Coins</p>
              <h2 className="text-xl font-bold flex items-center gap-1 justify-end">
                {wallet.coins.toLocaleString()}
                <FaCoins className="text-yellow-300 ml-1" />
              </h2>
            </div>
          </div>

          {/* Transactions */}
          {loading ? (
            <div className="text-center mt-10 text-white/80">Loading...</div>
          ) : wallet.transactions.length === 0 ? (
            <p className="text-center text-white/80 mt-10">No transaction history yet</p>
          ) : (
            <div className="space-y-3">
              {wallet.transactions.map((txn) => (
                <div
                  key={txn.id}
                  onClick={() =>
                    setSelectedTxn({
                      ...txn,
                      source: txn.title,
                      balanceAfter: txn.isPositive
                        ? wallet.balance + txn.amount
                        : wallet.balance - txn.amount,
                    })
                  }
                  className="bg-white text-black rounded-xl p-3 flex items-center justify-between cursor-pointer shadow hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <img src={getIcon(txn.type)} alt="icon" className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{txn.title}</p>
                      <p className="text-xs text-gray-500">{txn.date}</p>
                    </div>
                  </div>
                  <div
                    className={`font-bold text-sm ${
                      txn.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {txn.isPositive ? '+' : '-'} {txn.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Navbar />

      {/* Modal */}
      {selectedTxn && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setSelectedTxn(null)}
        >
          <div
            className="bg-white text-black w-full rounded-t-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Transaction Details</h3>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-gray-600 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-purple-100">
                <img
                  src={getIcon(selectedTxn.type)}
                  alt=""
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-sm font-medium">{selectedTxn.type}</span>
            </div>

            <div className="bg-gray-100 rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Date & Time</span>
                <span className="text-black">{selectedTxn.date}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Amount</span>
                <span
                  className={`font-bold ${
                    selectedTxn.amount > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {selectedTxn.amount > 0 ? '+' : ''}
                  {selectedTxn.amount} Coins
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Transaction ID</span>
                <span className="text-sm font-mono">{selectedTxn.id}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Source</span>
                <span className="text-black">{selectedTxn.source}</span>
              </div>
              <div className="flex justify-between text-gray-600 pt-2 border-t">
                <span>Wallet Balance After</span>
                <span className="text-blue-700 font-bold">
                  ₹{selectedTxn.balanceAfter.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
