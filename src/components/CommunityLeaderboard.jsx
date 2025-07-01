import React, { useState, useEffect, useCallback } from 'react';
import { FaTrophy, FaArrowLeft, FaCoins, FaGamepad } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './Header';
import BackgroundBubbles from './BackgroundBubbles';
import Navbar from './Navbar';
import authService from '../services/authService';
import api from '../services/api';

const CommunityLeaderboard = () => {
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
        className={`flex items-center p-4 rounded-lg ${
          isCurrentUser 
            ? 'ring-2 ring-yellow-400 bg-yellow-500/10' 
            : isTop3 
              ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-500/5' 
              : 'bg-white/5 hover:bg-white/10'
        } transition-all`}
      >
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
      <div className="min-h-screen bg-blueGradient text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blueGradient py-16 text-white overflow-hidden relative">
      <BackgroundBubbles />
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-10">
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

        {/* Time Range Selector - Temporarily hidden until backend supports it */}
        <div className="flex justify-center mb-6 space-x-4 opacity-50 cursor-not-allowed" title="Coming soon">
          {['all', 'monthly', 'weekly'].map((range) => (
            <button
              key={range}
              disabled
              className="px-4 py-2 rounded-lg bg-white/5 text-white/50"
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === 'all' ? 'bg-yellow-500 text-black' : 'bg-white/10 hover:bg-white/20'
            } transition-colors`}
          >
            All Time
          </button>
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
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 max-w-3xl mx-auto">
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
