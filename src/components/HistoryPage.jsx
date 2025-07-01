<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaCoins } from 'react-icons/fa';
=======
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaCoins, FaRedoAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
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
    case 'top-up':
      return 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';
    case 'purchase':
      return 'https://cdn-icons-png.flaticon.com/512/1170/1170627.png';
    default:
      return 'https://cdn-icons-png.flaticon.com/512/3468/3468373.png';
  }
};

const HistoryPage = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
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
            { id: '1', type: 'Coins Earned', title: 'Coins Earned', date: '2024-01-20 14:30', amount: 500, isPositive: true, category: 'coins' },
            { id: '2', type: 'Game Reward', title: 'Game Reward', date: '2024-01-20 13:15', amount: 200, isPositive: true, category: 'coins' },
            { id: '3', type: 'Coins Withdrawn', title: 'Coins Withdrawn', date: '2024-01-19 16:45', amount: 300, isPositive: false, category: 'coins' },
            { id: '4', type: 'Top-Up', title: 'Wallet Top-Up', date: '2024-01-18 11:00', amount: 1000, isPositive: true, category: 'cash' },
            { id: '5', type: 'Purchase', title: 'Item Purchase', date: '2024-01-17 09:00', amount: 500, isPositive: false, category: 'cash' },
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

  const cashTxns = wallet.transactions.filter(t => t.category === 'cash');
  const coinTxns = wallet.transactions.filter(t => t.category === 'coins');
=======
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState({ 
    balance: 0, 
    coins: 0, 
    transactions: [],
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const fetchWalletData = useCallback(async () => {
    try {
      setRefreshing(true);
      const userData = await authService.getCurrentUserProfile();
      
      if (userData) {
        // Transform transactions from the user data to match our format
        const transactions = userData.transactions || [];
        const formattedTxns = transactions.map(txn => ({
          id: txn._id || Date.now().toString(),
          type: txn.type || 'Transaction',
          title: txn.description || 'Transaction',
          date: new Date(txn.createdAt || Date.now()).toLocaleString(),
          amount: txn.amount || 0,
          isPositive: txn.transactionType === 'credit',
          category: txn.currency === 'coins' ? 'coins' : 'cash',
          status: txn.status || 'completed'
        }));

        setWallet({
          balance: userData.balance || userData.Balance || 0,
          coins: userData.coins || 0,
          transactions: formattedTxns,
          profilePicture: userData.profilePicture || userData.avatar || ''
        });
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load transaction history');
      
      // Fallback to local storage if available
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (localUser) {
        setWallet(prev => ({
          ...prev,
          balance: localUser.balance || localUser.Balance || 0,
          coins: localUser.coins || 0,
          profilePicture: localUser.profilePicture || localUser.avatar || ''
        }));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const cashTxns = wallet.transactions
    .filter(t => t.category === 'cash')
    .sort((a, b) => new Date(b.date) - new Date(a.date));
    
  const coinTxns = wallet.transactions
    .filter(t => t.category === 'coins')
    .sort((a, b) => new Date(b.date) - new Date(a.date));
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b

  const renderTransactions = (txns) => (
    <div className="space-y-3">
      {txns.map((txn) => (
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
          <div className={`font-bold text-sm ${txn.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {txn.isPositive ? '+' : '-'} {txn.amount} {txn.category === 'cash' ? '₹' : 'Coins'}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff] pb-24">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

        <div className="pt-20 px-4 max-w-md mx-auto">
<<<<<<< HEAD
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-full hover:bg-white/20"
          >
            <FaArrowLeft size={18} /> <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <div className="px-4 pt-6 space-y-6 max-w-md mx-auto">
          <div className="bg-blue-600 rounded-xl px-4 py-3 flex justify-between items-center shadow-inner">
            <div>
              <p className="text-sm">Wallet Balance</p>
              <h2 className="text-xl font-bold">₹{wallet.balance.toFixed(2)}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm">Total Coins</p>
              <h2 className="text-xl font-bold flex items-center gap-1 justify-end">
                {wallet.coins.toLocaleString()} <FaCoins className="text-yellow-300 ml-1" />
              </h2>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Cash Transactions</h3>
            {loading ? <p className="text-center text-white/70">Loading...</p> : renderTransactions(cashTxns)}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Coin Transactions</h3>
            {loading ? <p className="text-center text-white/70">Loading...</p> : renderTransactions(coinTxns)}
          </div>
=======
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-full hover:bg-white/20"
            >
              <FaArrowLeft size={18} /> <span className="hidden sm:inline">Back</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-full hover:bg-white/20 disabled:opacity-50"
            >
              <FaRedoAlt className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        <div className="px-4 pt-6 space-y-6 max-w-md mx-auto">
          <div className="bg-blue-600 rounded-xl p-4 flex items-center gap-4 shadow-inner">
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex-shrink-0 overflow-hidden border-[3px] border-dullBlue">
              {wallet.profilePicture ? (
                <img
                  src={wallet.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-2xl font-bold">
                  {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white/80">Wallet Balance</p>
                  <h2 className="text-lg font-bold">₹{wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80">Total Coins</p>
                  <h2 className="text-lg font-bold flex items-center justify-end">
                    {wallet.coins.toLocaleString()} <FaCoins className="text-yellow-300 ml-1" />
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Cash Transactions</h3>
                <span className="text-sm text-white/70">{cashTxns.length} transactions</span>
              </div>
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : cashTxns.length > 0 ? (
                renderTransactions(cashTxns)
              ) : (
                <div className="bg-white/5 rounded-xl p-4 text-center text-white/70">
                  No cash transactions found
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Coin Transactions</h3>
                <span className="text-sm text-white/70">{coinTxns.length} transactions</span>
              </div>
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : coinTxns.length > 0 ? (
                renderTransactions(coinTxns)
              ) : (
                <div className="bg-white/5 rounded-xl p-4 text-center text-white/70">
                  No coin transactions found
                </div>
              )}
            </div>
          </div>
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
        </div>
      </div>

      <Navbar />

      {selectedTxn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end" onClick={() => setSelectedTxn(null)}>
          <div className="bg-white text-black w-full rounded-t-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Transaction Details</h3>
              <button onClick={() => setSelectedTxn(null)} className="text-gray-600 text-xl">
                <FaTimes />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-purple-100">
                <img src={getIcon(selectedTxn.type)} alt="" className="w-6 h-6 object-contain" />
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
                <span className={`font-bold ${selectedTxn.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedTxn.amount > 0 ? '+' : ''}{selectedTxn.amount} {selectedTxn.category === 'coins' ? 'Coins' : '₹'}
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
