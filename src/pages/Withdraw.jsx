<<<<<<< HEAD
import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
=======
import React, { useState, useEffect, useCallback } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const navigate = useNavigate();

  const handleWithdraw = async () => {
    if (!amount || !upiId) return alert('Please enter valid fields');

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
=======
  const [refreshing, setRefreshing] = useState(false);
  const [walletData, setWalletData] = useState({
    balance: 0,
    profilePicture: '',
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      setRefreshing(true);
      const userData = await authService.getCurrentUserProfile();
      
      if (userData) {
        setWalletData({
          balance: userData.balance || userData.Balance || 0,
          profilePicture: userData.profilePicture || userData.avatar || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load wallet data');
      
      // Fallback to local storage if available
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (localUser) {
        setWalletData({
          balance: localUser.balance || localUser.Balance || 0,
          profilePicture: localUser.profilePicture || localUser.avatar || '',
        });
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleRefresh = () => {
    fetchUserData();
  };

  const handleWithdraw = async () => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }

    setLoading(true);
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b

    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, upiId }),
      });

<<<<<<< HEAD
      if (!response.ok) throw new Error('Withdrawal failed');
      alert('Withdrawal request submitted');
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
=======
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Withdrawal failed');
      }
      
      toast.success('Withdrawal request submitted successfully');
      setAmount('');
      setUpiId('');
      fetchUserData(); // Refresh wallet data after successful withdrawal
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error(error.message || 'Failed to process withdrawal');
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff] pb-24">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

        {/* Back Button and Heading */}
        <div className="flex items-center gap-2 max-w-md mx-auto px-4 mt-20">
          <button
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate('/wallet'); // fallback route
              }
            }}
            className="bg-white/10 p-2 rounded-full hover:bg-white/20"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold ml-11">Withdraw Money</h1>
        </div>

        <div className="max-w-md mx-auto mt-4 text-center px-4">
<<<<<<< HEAD
          {/* Wallet Icon */}
          <div className="w-20 h-20 rounded-full bg-yellow-400 mx-auto flex items-center justify-center overflow-hidden mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3069/3069172.png"
              alt="Wallet"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold">Full2Win Wallet</h2>
          <h4 className="text-sm text-white/70">Wallet Balance: ₹124.00</h4>
=======
          {/* Profile Picture */}
          <div className="w-20 h-20 rounded-full bg-yellow-400 mx-auto flex items-center justify-center overflow-hidden mb-4 border-[3px] border-dullBlue">
            {walletData.profilePicture ? (
              <img
                src={walletData.profilePicture}
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
          <h2 className="text-xl font-semibold">Full2Win Wallet</h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h4 className="text-yellow-200 text-sm">Balance: ₹{walletData.balance.toLocaleString()}</h4>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-yellow-200/60 hover:text-yellow-200 transition-colors"
            >
              <FiArrowLeft size={14} className={refreshing ? 'animate-spin' : 'rotate-180'} />
            </button>
          </div>
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b

          {/* Amount Input */}
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
<<<<<<< HEAD
            className="mt-4 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60"
=======
            className="mt-4 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 text-center"
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
          />

          {/* UPI Input */}
          <input
            type="text"
            placeholder="Enter your UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="mt-3 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60"
          />

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className={`mt-4 w-full py-3 rounded-lg font-bold transition ${
              loading
                ? 'bg-yellow-400 text-blue-900 cursor-wait'
                : 'border-2 border-white text-white hover:bg-white/20'
            }`}
          >
            {loading ? 'Processing...' : 'Withdraw Money'}
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Withdraw;
