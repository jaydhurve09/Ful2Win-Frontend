
// 🎮 Improved, Responsive & Appealing Community Leaderboard UI

import React, { useState, useEffect, useCallback } from 'react';
import { FaTrophy, FaArrowLeft, FaCoins, FaGamepad } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './Header';
import BackgroundBubbles from './BackgroundBubbles';
import Navbar from './Navbar';
import authService from '../services/authService';
import api from '../services/api';
import first from '../assets/first.png';
import second from '../assets/second.png';
import third from '../assets/third.png';



const CommunityLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wins');
  const [timeRange, setTimeRange] = useState('all');
  const navigate = useNavigate();

  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getCurrentUserProfile();
      if (!currentUser || !currentUser._id) return navigate('/login');
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

      try {
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

        const allUsers = [currentUserData];
        for (let i = 0; i < 9; i++) {
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

        const sortedLeaderboard = [...allUsers].sort((a, b) =>
          activeTab === 'wins'
            ? b.stats.wins - a.stats.wins || b.stats.winRate - a.stats.winRate
            : b.stats.coins - a.stats.coins
        );

        setLeaderboard(sortedLeaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setLeaderboard([currentUserData]);
      }
    } catch (error) {
      console.error('Error in fetchLeaderboard:', error);
      toast.error('Failed to load leaderboard data. Showing limited information.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);
  
  const badgeImages = [first, second, third];


  const renderLeaderboardItem = (user, index) => {
    const isTop3 = index < 3;
    const trophyColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
    const isCurrentUser = user._id === JSON.parse(localStorage.getItem('user') || '{}')._id;

    return (
   <div
  key={`${user._id}-${index}`}
  onClick={() => console.log('Clicked:', user.username)}
  className={`cursor-pointer flex items-center p-4 rounded-lg flex-wrap md:flex-nowrap gap-4 md:gap-0
    ${isTop3
      ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-500/5'
      : 'bg-white/5'}
    ${isCurrentUser ? 'bg-yellow-400/10' : ''}
    hover:scale-[1.01] hover:shadow-md transition-transform duration-200 ease-in-out`}
>


<div className="w-8 flex-shrink-0 text-center">
  {isTop3 ? (
    <img
      src={index === 0 ? first : index === 1 ? second : third}
      alt={`Rank ${index + 1}`}
      className="w-8 h-8 object-contain mx-auto drop-shadow-md transition-transform duration-200 ease-in-out hover:scale-110 hover:drop-shadow-xl"
    />
  ) : (
    <span className={`${isCurrentUser ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>
      {index + 1}
    </span>
  )}
</div>



        <div className="flex items-center flex-1 md:ml-4">
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
        <div className="text-yellow-400 font-bold flex items-center ml-auto">
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
     <main className="container mx-auto px-4 pt-1 relative z-10">
  {/* Remove left padding and space it tight to the edge */}
  <div className="flex items-center gap-2 mb-4">
 <button
    onClick={() => navigate(-1)}
    className="text-blue-100 text-4xl sm:text-[2.5rem] font-bold leading-none relative -top-1"
  >
    &#8249;
  </button>

 <h1 className="px-4 text-2xl sm:text-3xl font-bold text-center text-blue-100">
           Community Leaderboard
          </h1>


  </div>
 

        <div className="flex justify-center mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('wins')}
            className={`px-4 sm:px-6 py-3 font-medium flex items-center text-sm sm:text-base
              ${activeTab === 'wins' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'} transition-colors`}
          >
            <FaGamepad className="mr-2" /> Most Wins
          </button>
          <button
            onClick={() => setActiveTab('coins')}
            className={`px-4 sm:px-6 py-3 font-medium flex items-center text-sm sm:text-base
              ${activeTab === 'coins' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'} transition-colors`}
          >
            <FaCoins className="mr-2 text-yellow-400" /> Most Coins
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 max-w-3xl mx-auto">
          {leaderboard.length === 0 ? (
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
