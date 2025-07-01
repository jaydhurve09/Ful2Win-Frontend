import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGamepad, FaUsers, FaTrophy, FaArrowRight, FaClock, FaUserFriends } from 'react-icons/fa';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import BackgroundBubbles from '../components/BackgroundBubbles';
import axios from 'axios';
import { toast } from 'react-toastify';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;

const Tournaments = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [tournaments, setTournaments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get filtered tournaments based on active filter and search query
  const getFilteredTournaments = useCallback(() => {
    return tournaments.filter(tournament => {
      // Filter by active filter
      const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'live' && tournament.status === 'live') ||
                         (activeFilter === 'upcoming' && tournament.status === 'upcoming') ||
                         (activeFilter === 'completed' && tournament.status === 'completed');
      
      // Filter by search query
      const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tournament.gameName && tournament.gameName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesFilter && matchesSearch;
    });
  }, [tournaments, activeFilter, searchQuery]);
  
  // Handle view game tournaments - navigates to the game's tournament lobby
  const handleViewGameTournaments = (gameId, gameName) => {
    navigate(`/game-tournaments/${gameId}?game=${encodeURIComponent(gameName || '')}`);
  };

  // Get thumbnail URL for game
  const getGameThumbnail = (game) => {
    if (!game) return null;
    
    // Check for thumbnail in different possible locations
    if (game.assets?.thumbnail) {
      if (game.assets.thumbnail.startsWith('http')) {
        return game.assets.thumbnail;
      }
      return `${API_URL}/games/${game.id}/assets/${game.assets.thumbnail}`;
    }
    
    // Fallback to game image if available
    if (game.image) {
      if (game.image.startsWith('http')) {
        return game.image;
      }
      return `${API_URL}/games/${game.id}/assets/${game.image}`;
    }
    
    return null;
  };

  const gameFilters = [
    { id: 'all', label: 'All Games' },
    { id: 'trending', label: 'Trending' },
    { id: 'new', label: 'New' },
    { id: 'popular', label: 'Most Played' },
  ];

  // Fetch all games with their tournament counts
  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all games
      const [gamesResponse, tournamentsResponse] = await Promise.all([
        axios.get(`${API_URL}/games`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }),
        axios.get(`${API_URL}/tournaments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        })
      ]);
      
      if (gamesResponse.data.success) {
        const gamesData = gamesResponse.data.data || [];
        const allTournaments = tournamentsResponse.data?.data || [];
        
        // Process tournaments data
        const processedTournaments = allTournaments.map(tournament => {
          const gameId = tournament.gameId || tournament.game?._id;
          const game = gamesData.find(g => g.id === gameId);
          
          return {
            ...tournament,
            gameId,
            gameName: game?.name,
            gameImage: getGameThumbnail(game)
          };
        });
        
        // Set tournaments state
        setTournaments(processedTournaments);
        
        // Count tournaments per game and get the next tournament time
        const gameTournaments = {};
        allTournaments.forEach(tournament => {
          const gameId = tournament.gameId || tournament.game?._id;
          if (gameId) {
            if (!gameTournaments[gameId]) {
              gameTournaments[gameId] = {
                count: 0,
                nextTournamentTime: null,
                activeTournaments: 0
              };
            }
            gameTournaments[gameId].count++;
            
            // Check if tournament is upcoming or active
            const startTime = new Date(tournament.startTime || 0);
            const endTime = tournament.endTime ? new Date(tournament.endTime) : null;
            const now = new Date();
            
            if (tournament.status === 'live' || (startTime <= now && (!endTime || endTime > now))) {
              gameTournaments[gameId].activeTournaments++;
            } else if (startTime > now && (!gameTournaments[gameId].nextTournamentTime || startTime < gameTournaments[gameId].nextTournamentTime)) {
              gameTournaments[gameId].nextTournamentTime = startTime;
            }
          }
        });
        
        // Add tournament info to games
        const gamesWithTournamentInfo = gamesData.map(game => ({
          ...game,
          tournamentCount: gameTournaments[game.id]?.count || 0,
          nextTournamentTime: gameTournaments[game.id]?.nextTournamentTime,
          activeTournaments: gameTournaments[game.id]?.activeTournaments || 0
        }));
        
        setGames(gamesWithTournamentInfo);
      } else {
        throw new Error('Failed to fetch games');
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      setError(error.response?.data?.message || 'Failed to load games. Please try again later.');
      toast.error('Failed to load games');
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to get game asset URL
  const getGameAssetUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}/games/assets/${path}`;
  };
  
  // Format date to readable string
  const formatDate = (date) => {
    if (!date) return 'No upcoming tournaments';
    
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    };
    return new Date(date).toLocaleString('en-US', options);
  };

  const getFilteredGames = () => {
    return games.filter(game => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'trending') return game.isTrending;
      if (activeFilter === 'new') return game.isNew;
      if (activeFilter === 'popular') return game.popular;
      return true;
    });
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="bg-blueGradient text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading games...</p>
        </div>
      </div>
    );

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
              return (
                <div 
                  key={game.id} 
                  className="bg-gradient-to-br from-gray-800/10 to-black/10 backdrop-blur-lg border border-white/30 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all duration-200 flex flex-col h-full"
                >
                  <div className="relative overflow-hidden group">
                    {hasActiveTournaments && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        {game.activeTournaments} Active
                      </div>
                    )}
                    <div className="aspect-video w-full bg-gray-800 flex items-center justify-center">
                      {thumbnail ? (
                        <img 
                          src={thumbnail} 
                          alt={game.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-game.jpg';
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <FaGamepad className="text-4xl text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">{game.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-300">
                        <FaTrophy className="mr-1 text-yellow-400" />
                        <span>{game.tournamentCount} {game.tournamentCount === 1 ? 'Tournament' : 'Tournaments'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-300 mb-2">
                        <FaClock className="mr-2 text-blue-400" />
                        <span>Next: {formatDate(game.nextTournamentTime)}</span>
                      </div>
                      {game.activeTournaments > 0 && (
                        <div className="flex items-center text-sm text-green-400 mb-2">
                          <FaUserFriends className="mr-2" />
                          <span>{game.activeTournaments} active tournaments</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {game.description || 'Join exciting tournaments and win big!'}
                    </p>
                    <div className="mt-auto">
                      <Button 
                        variant="primary" 
                        fullWidth
                        className="mt-2"
                        onClick={() => handleViewGameTournaments(game.id, game.name)}
                      >
                        Join Tournament <FaArrowRight className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tournament Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-800 text-red-200 rounded-lg p-4 text-center">
            {error}
          </div>
        ) : getFilteredTournaments().length === 0 ? (
          <div className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
            <div className="text-yellow-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Tournaments Found</h3>
            <p className="text-gray-400">
              {searchQuery 
                ? 'No tournaments match your search. Try different keywords.'
                : 'There are no tournaments available right now. Check back later!'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredTournaments().map((tournament) => (
              <div 
                key={tournament.id} 
                className="bg-gradient-to-br from-gray-800/10 to-black/10 backdrop-blur-lg border border-white/30 rounded-xl p-6 cursor-pointer hover:border-yellow-400/50 transition-all duration-200"
                onClick={() => handleViewGameTournaments(tournament.gameId, tournament.gameName || 'Game')}
              >
                <div className="flex gap-6">
                  <div className="w-2/5">
                    {console.log(`Rendering desktop image for tournament ${tournament.id}:`, {
                      gameId: tournament.gameId,
                      gameImage: tournament.gameImage,
                      fallback: '/placeholder-game.jpg'
                    })}
                    <div className="w-full aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={tournament.gameImage || '/placeholder-game.jpg'} 
                        alt={tournament.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Error loading image for tournament ${tournament.id}:`, e.target.src);
                          e.target.onerror = null;
                          e.target.src = '/placeholder-game.jpg';
                        }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="w-3/5">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{tournament.name}</h3>
                      {tournament.status === 'live' && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">LIVE</span>}
                      {tournament.status === 'completed' && <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-md font-medium">COMPLETED</span>}
                      {tournament.status === 'upcoming' && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md font-medium">UPCOMING</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-300">
                      <div>
                        <p>Entry Fee</p>
                        <p className="text-yellow-500 font-medium">{tournament.entryFee} {tournament.mode === 'coin' ? 'Coins' : '₹'}</p>
                      </div>
                      <div>
                        <p>Prize Pool</p>
                        <p className="text-yellow-500 font-medium">{tournament.prizePool} {tournament.mode === 'coin' ? 'Coins' : '₹'}</p>
                      </div>
                      <div>
                        <p>Players</p>
                        <p className="text-yellow-500 font-medium">{tournament.players}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="primary" 
                        className="flex-1"
                        onClick={(e) => handleJoinTournament(tournament, e)}
                      >
                        {tournament.status === 'completed' ? 'View Results' : 'Join Now'}
                      </Button>
                      <Button 
                        variant="gradient"
                        className="px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewGameTournaments(tournament.gameId, tournament.gameName || 'Game');
                        }}
                        title="View all tournaments for this game"
                      >
                        ⋮
                      </Button>
                    </div>
                    <p className="text-center text-sm text-gray-400">{tournament.timeLeft}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tournament Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {getFilteredTournaments().map((tournament) => (
              <div key={tournament.id} className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4 relative overflow-hidden">
                {tournament.status === 'live' && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md">
                    LIVE
                  </div>
                )}
                {tournament.status === 'completed' && (
                  <div className="absolute top-2 right-2 bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md">
                    DONE
                  </div>
                )}
                {tournament.status === 'upcoming' && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md">
                    SOON
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    {console.log(`Rendering mobile image for tournament ${tournament.id}:`, {
                      gameId: tournament.gameId,
                      gameImage: tournament.gameImage,
                      fallback: '/placeholder-game.jpg'
                    })}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={tournament.gameImage || '/placeholder-game.jpg'} 
                        alt={tournament.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-game.jpg';
                        }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{tournament.name}</h3>
                    <div className="flex justify-between text-sm text-gray-300 mb-3">
                      <div>
                        <span className="text-gray-400">Entry Fee</span>
                        <p className="text-yellow-400 font-medium">{tournament.entryFee} {tournament.mode === 'coin' ? 'Coins' : '₹'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Prize Pool</span>
                        <p className="text-yellow-400 font-medium">{tournament.prizePool} {tournament.mode === 'coin' ? 'Coins' : '₹'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Players</span>
                        <p className="text-yellow-400 font-medium">{tournament.players}</p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg mb-2"
                      onClick={() => handleJoinTournament(tournament)}
                    >
                      {tournament.status === 'completed' ? 'View Results' : 'Join Tournament'}
                    </Button>
                    <p className="text-center text-xs text-gray-400">{tournament.timeLeft}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Tournaments;
