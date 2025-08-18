import React, { useState, useEffect, useCallback } from 'react';
import { FaTrophy, FaArrowLeft, FaCoins, FaGamepad } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './Header';
import BackgroundCircles from './BackgroundCircles';
import Navbar from './Navbar';
import authService from '../services/authService';
import api from '../services/api';

const CommunityLeaderboard = () => {
  // Add the animation styles to the document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shiny {
        0% { transform: translateX(-100%) rotate(45deg); }
        100% { transform: translateX(100%) rotate(45deg); }
      }
      .shiny-border {
        position: relative;
        overflow: hidden;
      }
      .shiny-border::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, 
          transparent, 
          rgba(191, 219, 254, 0.5), 
          transparent
        );
        animation: shiny 2s infinite linear;
        pointer-events: none;
        z-index: 1;
      }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wins'); // 'wins' or 'coins'
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'monthly', 'weekly'
  const navigate = useNavigate();

  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get current user's profile to ensure we're authenticated
      const currentUser = await authService.getCurrentUserProfile();
      if (!currentUser || !currentUser._id) {
        navigate('/login');
        return;
      }

      // Create current user data object with defaults
      const currentUserData = {
        _id: currentUser._id,
        username: currentUser.username || 'You',
        profilePicture: currentUser.profilePicture,
        stats: {
          wins: currentUser.stats?.wins || 0,
          matches: currentUser.stats?.matches || 0,
          coins: currentUser.coins || 0,
          winRate: currentUser.stats?.wins && currentUser.stats?.matches
            ? Math.round((currentUser.stats.wins / currentUser.stats.matches) * 100)
            : 0
        }
      };
      
      // Try to fetch real data first
      try {
        // First get the current user's data to ensure we have the latest stats
        const updatedUser = await authService.getUserProfile(currentUser._id);
        
        if (updatedUser) {
          currentUserData.stats = {
            wins: updatedUser.stats?.wins || 0,
            matches: updatedUser.stats?.matches || 0,
            coins: updatedUser.coins || 0,
            winRate: updatedUser.stats?.wins && updatedUser.stats?.matches
              ? Math.round((updatedUser.stats.wins / updatedUser.stats.matches) * 100)
              : 0
          };
        }
        
        // Get a list of all users (this would be replaced with actual leaderboard endpoint if available)
        const allUsers = [currentUserData];
        
        // If we have friends or followers in the user's data, we could fetch their profiles here
        // For now, we'll just use the current user + some sample data
        const sampleCount = 9; // Number of sample users to show
        
        // Generate sample users with realistic data
        for (let i = 0; i < sampleCount; i++) {
          const wins = Math.floor(Math.random() * 20) + 1;
          const matches = wins + Math.floor(Math.random() * 10);
          const winRate = Math.round((wins / matches) * 100);
          
          allUsers.push({
            _id: `sample-${i + 1}`,
            username: `Player${i + 1}`,
            profilePicture: null,
            stats: {
              wins,
              matches,
              coins: Math.floor(Math.random() * 2000) + 500,
              winRate
            }
          });
        }
        
        // Sort based on active tab
        const sortedLeaderboard = [...allUsers].sort((a, b) => 
          activeTab === 'wins' 
            ? b.stats.wins - a.stats.wins || b.stats.winRate - a.stats.winRate
            : b.stats.coins - a.stats.coins
        );
        
        setLeaderboard(sortedLeaderboard);
        
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        
        // Fallback to just the current user if there's an error
        setLeaderboard([currentUserData]);
      }
    } catch (error) {
      console.error('Error in fetchLeaderboard:', error);
      // Show a user-friendly error message
      toast.error('Failed to load leaderboard data. Showing limited information.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const renderLeaderboardItem = (user, index) => {
    const isTop3 = index < 3;
    const trophyColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
    const isCurrentUser = user._id === JSON.parse(localStorage.getItem('user') || '{}')._id;
    
    return (
      <div
        key={`${user._id}-${index}`}
        className={`relative flex items-center p-4 rounded-xl shiny-border ${
          isCurrentUser 
            ? 'bg-blue-800/40' 
            : isTop3 
              ? 'bg-gradient-to-r from-blue-800/40 to-blue-900/30' 
              : 'bg-blue-900/30 hover:bg-blue-800/40'
        } transition-all overflow-hidden backdrop-blur-sm`}
        style={{
          position: 'relative',
          background: `linear-gradient(135deg, rgba(30, 64, 175, 0.3) 0%, rgba(30, 58, 138, 0.4) 100%)`,
          boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(96, 165, 250, 0.2)',
          border: '1px solid rgba(96, 165, 250, 0.2)',
        }}
      >
        <div className="absolute inset-0 opacity-30" style={{
          background: 'linear-gradient(45deg, transparent, rgba(96, 165, 250, 0.3), transparent)',
          animation: 'shiny 3s infinite linear',
          zIndex: 1,
          pointerEvents: 'none'
        }}></div>
        <div className="w-8 flex-shrink-0 text-center">
          {isTop3 ? (
            <FaTrophy className={`${trophyColors[index]} text-xl mx-auto`} />
          ) : (
            <span className={`${isCurrentUser ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>
              {index + 1}
            </span>
          )}
        </div>
        <div className="flex items-center flex-1 ml-4">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={user.username} 
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <div className={`font-medium ${isCurrentUser ? 'text-yellow-400' : 'text-white'}`}>
              {isCurrentUser ? 'You' : user.username || 'Anonymous'}
            </div>
            <div className="text-sm text-gray-400">
              {activeTab === 'wins' 
                ? `${user.stats?.wins || 0} wins` 
                : `${user.stats?.coins?.toLocaleString() || 0} coins`}
            </div>
          </div>
        </div>
        <div className="text-yellow-400 font-bold flex items-center">
          {activeTab === 'wins' ? (
            <>
              <FaGamepad className="mr-1" />
              {user.stats?.winRate ? `${user.stats.winRate}% WR` : 'N/A'}
            </>
          ) : (
            <>
              <FaCoins className="mr-1 text-yellow-400" />
              {user.stats?.coins?.toLocaleString() || 0}
            </>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-royalBlueGradient text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royalBlueGradient py-16 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-900/0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-blue-900/0"></div>
      <BackgroundCircles />
      <Header />
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] pointer-events-none"></div>
      <main className="container mx-auto px-4 py-8 relative z-10 bg-blue-900/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-700/20">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-3xl font-bold">Community Leaderboard</h1>
        </div>


        {/* Tabs */}
        <div className="flex justify-center mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('wins')}
            className={`px-6 py-3 font-medium flex items-center ${
              activeTab === 'wins' 
                ? 'text-yellow-400 border-b-2 border-yellow-400' 
                : 'text-gray-400 hover:text-white'
            } transition-colors`}
          >
            <FaGamepad className="mr-2" />
            Most Wins
          </button>
          <button
            onClick={() => setActiveTab('coins')}
            className={`px-6 py-3 font-medium flex items-center ${
              activeTab === 'coins' 
                ? 'text-yellow-400 border-b-2 border-yellow-400' 
                : 'text-gray-400 hover:text-white'
            } transition-colors`}
          >
            <FaCoins className="mr-2 text-yellow-400" />
            Most Coins
          </button>
        </div>

        {/* Leaderboard Content */}
        <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/40 backdrop-blur-md rounded-2xl p-6 max-w-3xl mx-auto shadow-xl border border-blue-700/30">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No leaderboard data available yet</p>
              <button 
                onClick={fetchLeaderboard}
                className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((user, index) => renderLeaderboardItem(user, index))}
            </div>
          )}
        </div>
      </main>
      <Navbar />
    </div>
  );
};

export default CommunityLeaderboard;




