import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGamepad, FaUsers, FaTrophy, FaClock, FaSearch } from 'react-icons/fa';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';
import axios from 'axios';
import { toast } from 'react-toastify';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;

const Tournaments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get filtered games based on search query
  const getFilteredGames = useCallback(() => {
    return games.filter(game => {
      return game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  }, [games, searchQuery]);
  
  // Handle view game tournaments
  const handleViewGameTournaments = (gameId) => {
    navigate(`/game-tournaments/${gameId}`);
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format player count
  const formatPlayerCount = (players, total) => {
    if (total === 0) return 'No players';
    if (total === 1) return '1 player';
    return `${players || 0} of ${total} players`;
  };

  // Fetch games
  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/games`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const gamesData = response.data.data || [];
        
        // Fetch tournament counts for each game
        const gamesWithTournamentCounts = await Promise.all(
          gamesData.map(async (game) => {
            // Use _id if available (MongoDB), otherwise use id
            const gameId = game._id || game.id;
            
            // Skip if game doesn't have an ID
            if (!gameId) {
              console.warn('Game is missing ID:', game);
              return {
                ...game,
                id: game._id || null,
                tournamentCount: 0
              };
            }

            try {
              // Ensure we use the correct ID (_id or id) for the API call
              const tournamentsRes = await axios.get(`${API_URL}/tournaments?gameId=${gameId}`, {
                headers: { Authorization: `Bearer ${token}` },
                validateStatus: (status) => status < 500 // Don't throw for 4xx errors
              });
              
              // Handle successful response
              if (tournamentsRes.status === 200 && tournamentsRes.data?.success) {
                return {
                  ...game,
                  tournamentCount: Array.isArray(tournamentsRes.data.data) 
                    ? tournamentsRes.data.data.length 
                    : 0
                };
              }
              
              // If we get here, the response wasn't successful
              console.warn(`Unexpected response for game ${gameId}:`, tournamentsRes.data);
              return {
                ...game,
                tournamentCount: 0
              };
            } catch (error) {
              console.error(`Error fetching tournaments for game ${gameId || 'unknown'}:`, error);
              return {
                ...game,
                tournamentCount: 0
              };
            }
          })
        );

        setGames(gamesWithTournamentCounts);
      } else {
        throw new Error('Failed to load games');
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      setError(error.response?.data?.message || 'Failed to load games. Please try again later.');
      toast.error('Failed to load games');
      
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: '/tournaments' } });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <BackgroundBubbles />
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
        <Navbar />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <BackgroundBubbles />
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-red-900/30 border border-red-800 text-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-2">Error Loading Tournaments</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Navbar />
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <BackgroundBubbles />
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col space-y-6 mb-8">
          <h1 className="text-3xl font-bold">Games</h1>
          
          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search games..."
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2.5 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {getFilteredGames().length === 0 ? (
          <div className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
            <div className="text-yellow-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Games Found</h3>
            <p className="text-gray-400">
              {searchQuery 
                ? 'No games match your search. Try different keywords.'
                : 'There are no games available right now. Check back later!'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getFilteredGames().map((game) => {
              const gameId = game._id || game.id;
              const displayName = game.displayName || game.name;
              const thumbnail = game.thumbnail || game.image;
              
              return (
                <div 
                  key={gameId}
                  className="group bg-gradient-to-br from-gray-800/30 to-black/20 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden cursor-pointer hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 flex flex-col"
                  onClick={() => handleViewGameTournaments(gameId)}
                >
                  {/* Game Thumbnail */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    {thumbnail ? (
                      <img 
                        src={thumbnail}
                        alt={displayName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-game.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaGamepad className="text-5xl text-yellow-500 opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-sm bg-yellow-500 text-gray-900 font-semibold px-2 py-1 rounded-full">
                        {game.tournamentCount || 0} Tournaments
                      </span>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{displayName}</h3>
                      {game.type && (
                        <p className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded-full inline-block mb-2">
                          {game.type}
                        </p>
                      )}
                      {game.description && (
                        <p className="text-sm text-gray-400 line-clamp-2 mt-2">
                          {game.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <FaUsers className="text-yellow-500 mr-2" />
                        <span>{formatPlayerCount(game.activePlayers || 0, game.maxPlayers || 0)}</span>
                      </div>
                      <button 
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-medium text-sm rounded-lg transition-colors flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewGameTournaments(gameId);
                        }}
                      >
                        <FaTrophy className="mr-2" />
                        View Tournaments
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            ))}
          </div>
        )}
      </main>
      
      <Navbar />
    </div>
  );
};

export default Tournaments;
