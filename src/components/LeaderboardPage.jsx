import React, { useState, useEffect } from "react";
import { FaUser, FaTrophy, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LeaderboardPage = () => {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tournamentName, setTournamentName] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const apiUrl = 
          (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
          || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) 
          || 'http://localhost:5000';

        const response = await axios.get(
          `${apiUrl}/api/tournaments/${tournamentId}/leaderboard`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setLeaderboard(response.data.leaderboard || []);
        setCurrentUserRank(response.data.currentUserRank || null);
        setTournamentName(response.data.tournamentName || 'Tournament');
        setBannerImageUrl(response.data.bannerImageUrl || null);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        toast.error('Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (tournamentId) {
      fetchLeaderboard();
    }
  }, [tournamentId, navigate]);

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

  const renderPodium = () => {
    const top3 = leaderboard.slice(0, 3);
    
    if (top3.length === 0) {
      return (
        <div className="text-center py-8">
          <p>No leaderboard data available yet</p>
        </div>
      );
    }

    return (
      <div className="flex justify-center items-end space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-10 mb-8">
        {top3.length > 1 && (
          <div className="flex flex-col items-center w-1/3">
            <div className="bg-yellow-500 text-black w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              2
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 w-full text-center">
              <div className="font-medium truncate">{top3[1].username}</div>
              <div className="text-yellow-400 font-bold">{top3[1].score}</div>
            </div>
          </div>
        )}

        {top3.length > 0 && (
          <div className="flex flex-col items-center w-1/3">
            <div className="bg-yellow-400 text-black w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              1
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 w-full text-center">
              <div className="font-bold truncate">{top3[0].username}</div>
              <div className="text-yellow-300 font-bold text-lg">{top3[0].score}</div>
            </div>
          </div>
        )}

        {top3.length > 2 && (
          <div className="flex flex-col items-center w-1/3">
            <div className="bg-yellow-600 text-black w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold mb-2">
              3
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 w-full text-center">
              <div className="font-medium truncate">{top3[2].username}</div>
              <div className="text-yellow-400 font-bold">{top3[2].score}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLeaderboardList = () => {
    const rest = leaderboard.slice(3);
    
    if (rest.length === 0) return null;

    return (
      <div className="space-y-2">
        {rest.map((user, index) => (
          <div 
            key={user._id || index}
            className={`flex items-center justify-between p-3 rounded-lg ${
              currentUserRank && currentUserRank.userId === user.userId 
                ? 'bg-yellow-500/20 border border-yellow-400/50' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium">
                {index + 4}
              </div>
              <div className="flex items-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
                    <FaUser className="text-white/70" />
                  </div>
                )}
                <span className="font-medium">{user.username}</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-yellow-400 mr-2">{user.score}</span>
              <FaTrophy className="text-yellow-400" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCurrentUserRank = () => {
    if (!currentUserRank) return null;
    
    const rank = leaderboard.findIndex(u => u.userId === currentUserRank.userId) + 1;
    
    return (
      <div className="mt-6 pt-4 border-t border-white/10">
        <h3 className="text-lg font-semibold mb-3">Your Rank</h3>
        <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold">
                {rank}
              </div>
              <div>
                <div className="font-medium">You</div>
                <div className="text-sm text-white/70">Rank: {rank} of {leaderboard.length}</div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-yellow-400 mr-2 text-lg">{currentUserRank.score}</span>
              <FaTrophy className="text-yellow-400 text-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blueGradient text-white pb-24 overflow-hidden">
      <div className="relative z-10">
        <div className="px-4 max-w-3xl mx-auto pt-6">
          {/* Tournament Banner */}
          {bannerImageUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={bannerImageUrl}
                alt="Tournament Banner"
                className="max-h-48 w-full object-cover rounded-xl shadow-lg border border-white/10"
                style={{background: '#222'}}
              />
            </div>
          )}
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-white/10 mr-4 transition-colors"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h1 className="text-2xl font-bold">
              {tournamentName} Leaderboard
            </h1>
          </div>
          {/* Podium */}
          {renderPodium()}
          {/* Leaderboard list */}
          {renderLeaderboardList()}
          {/* Current user rank */}
          {renderCurrentUserRank()}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
