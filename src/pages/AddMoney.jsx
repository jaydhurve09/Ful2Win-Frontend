import React, { useState, useEffect, useCallback } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';

const AddMoney = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setLoading(true);

    try {
      const options = {
        key: 'YOUR_RAZORPAY_KEY',
        amount: amount * 100,
        currency: 'INR',
        name: 'Full2win Wallet',
        description: 'Add Money to Wallet',
        handler: function (response) {
          toast.success('Payment successful!');
          fetchUserData(); // Refresh wallet data after successful payment
        },
        prefill: {
          name: currentUser?.name || 'User',
          email: currentUser?.email || '',
          contact: currentUser?.phone || '',
        },
        theme: {
          color: '#002e6e',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment');
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
          <h1 className="text-xl font-bold ml-2">Add Money</h1>
        </div>

        {/* Wallet UI */}
        <div className="text-white p-6 rounded-lg max-w-md mx-auto mt-4 text-center bg-white/10 backdrop-blur border border-white/20 shadow-xl">
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

          <h2 className="text-xl font-semibold">Full2win Wallet</h2>
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

          {/* Quick Amount Buttons */}
          <div className="flex justify-center gap-3 my-3">
            {[50, 100, 200, 500].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className="bg-white/10 px-4 py-2 rounded-lg text-white hover:bg-white/20 transition"
              >
                ₹{val}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 my-2 rounded-md text-black text-base outline-none text-center"
          />

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={!amount || amount <= 0 || loading}
            className={`bg-yellow-400 text-blue-900 font-bold py-3 px-6 mt-4 text-base rounded-md w-full hover:bg-yellow-300 transition ${
              (!amount || amount <= 0 || loading) && 'opacity-50 cursor-not-allowed'
            }`}
          >
            {loading ? 'Processing...' : 'Add Money'}
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default AddMoney;
