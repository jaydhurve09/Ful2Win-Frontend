import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GameLogo from './GameLogo';
import { IoPerson } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { IoMdWallet } from "react-icons/io";
import { FiRefreshCw } from "react-icons/fi";
import logo from '../assets/logo.png';
import defaultProfile from '../assets/default-profile.jpg';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/api';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [profilePicture, setProfilePicture] = useState(defaultProfile);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Format balance for display with proper error handling
  const formattedBalance = useMemo(() => {
    const safeBalance = Number(balance) || 0;
    return safeBalance.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).replace('₹', '₹ '); // Add space after currency symbol
  }, [balance]);

  const setLoadingBalance = (isLoading) => {
    setIsLoading(isLoading);
  };

  const fetchWalletBalance = useCallback(async () => {
    if (!isAuthenticated) {
      setBalance(0);
      return 0;
    }
    
    try {
      setLoadingBalance(true);
      const result = await authService.getWalletBalance();
      const balance = result?.balance || 0;
      console.log('Setting wallet balance:', balance); // Debug log
      setBalance(balance);
      return balance;
    } catch (error) {
      console.error('Error in fetchWalletBalance:', error);
      setBalance(0);
      return 0;
    } finally {
      setLoadingBalance(false);
    }
  }, [isAuthenticated]);

  // Function to refresh balance
  const refreshBalance = useCallback(() => {
    if (isAuthenticated) {
      return fetchWalletBalance();
    } else {
      // If not authenticated, reset balance to 0
      setBalance(0);
      return Promise.resolve(0);
    }
  }, [isAuthenticated, fetchWalletBalance]);

  // Initial load and refresh when authenticated state changes
  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  // Refresh balance when the tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshBalance();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshBalance]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const userData = await authService.getCurrentUserProfile();
          if (userData.profilePicture) {
            setProfilePicture(userData.profilePicture);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden mb-4 md:block mx-4 md:mx-20 pt-2">
        <div className="flex justify-between items-center">
          <GameLogo />
          <div className="flex items-center gap-2 p-2">
            {/* Wallet (clickable) */}
            <div
              onClick={() => navigate('/wallet')}
              className="flex items-center justify-center mx-auto py-[4px] px-2 gap-2 rounded-xl text-black bg-active cursor-pointer hover:opacity-90 transition"
            >
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-1 text-black font-semibold'>
                  <IoMdWallet className='text-2xl' />
                  {isLoading ? (
                    <div className='h-4 w-12 bg-gray-600 animate-pulse rounded'></div>
                  ) : (
                    <span>{formattedBalance}</span>
                  )}
                </div>
                {/* <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    refreshBalance();
                  }}
                  className='text-white/70 hover:text-white text-sm p-1 hover:bg-white/10 rounded-full transition-colors'
                  title='Refresh balance'
                >
                  <FiRefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                </button> */}
              </div>
            </div>

            {/* Bell Notification */}
            <button
              className="text-xl"
              onClick={() => navigate('/notifications')}
            >
              <FaBell />
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full overflow-hidden ml-2 border-2 border-yellow-500 hover:opacity-90 transition-opacity"
            >
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfile;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-yellow-500 flex items-center justify-center">
                  <IoPerson className="text-black" />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-blueGradient z-40 rounded-b-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logo} alt="Ludo Logo" className="h-10 w-auto object-contain" />

          <div className="flex items-center space-x-3">
            {/* Wallet */}
            <div
              onClick={() => navigate('/wallet')}
              className="flex items-center bg-dullBlue px-3 py-1.5 rounded-full cursor-pointer hover:opacity-90 transition"
            >
              <IoMdWallet className="bg-active rounded-full p-1 text-lg mr-1.5" />
              {isLoading ? (
                <div className='h-4 w-12 bg-gray-600 animate-pulse rounded'></div>
              ) : (
                <span className="text-black font-medium text-sm">{formattedBalance}</span>
              )}
            </div>

            {/* Bell Notification */}
            <button
              className="text-white text-xl hover:opacity-80 transition-opacity"
              onClick={() => navigate('/notifications')}
            >
              <FaBell />
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-yellow-500 hover:opacity-90 transition-opacity"
            >
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfile;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-yellow-500 flex items-center justify-center">
                  <IoPerson className="text-black text-lg" />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
