import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaTrophy, 
  FaGamepad,
  FaUsers,
  FaClock,
  FaSearch,
  FaCoins,
  FaRupeeSign
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import Header from './Header';
import Navbar from './Navbar';
import BackgroundBubbles from './BackgroundBubbles';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;

// Format date and time
const formatDateTime = (dateString) => {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Format prize pool
const formatPrize = (amount, isCoin = false) => {
  if (!amount) return '0';
  return isCoin 
    ? `${amount.toLocaleString()} Coins` 
    : `₹${amount.toLocaleString()}`;
};

// Format player count
const formatPlayerCount = (current, max) => {
  if (max === 0) return 'No players';
  if (max === 1) return '1 player';
  return `${current || 0}/${max} players`;
};

const TournamentLobby = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [game, setGame] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
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
  
  // Handle view/join tournament
  const handleViewTournament = (tournamentId) => {
    // Find the tournament details
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) {
      toast.error('Tournament not found');
      return;
    }

    // Show confirmation dialog
    if (window.confirm(
      `Register for ${tournament.name}?\n\n` +
      `Entry Fee: ${formatPrize(tournament.entryFee || 0, tournament.mode === 'coin')}\n` +
      `Prize Pool: ${formatPrize(tournament.prizePool || 0, tournament.mode === 'coin')}\n` +
      `Players: ${tournament.currentPlayers?.length || 0}/${tournament.maxPlayers || '∞'}\n\n` +
      'Do you want to proceed?'
    )) {
      // User confirmed, navigate to the game wrapper with tournament context
      navigate(`/games/${gameId}`, { 
        state: { 
          tournamentId,
          mode: 'tournament',
          fromTournament: true,
          tournamentName: tournament.name
        } 
      });
    }
  };

  // Fetch game and tournaments
  const fetchGameAndTournaments = useCallback(async () => {
    if (!gameId) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: `/tournament-lobby/${gameId}` } });
        return;
      }
      
      // Fetch game details and tournaments in parallel
      const [gameResponse, tournamentsResponse] = await Promise.all([
        axios.get(`${API_URL}/games/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500
        }),
        axios.get(`${API_URL}/tournaments?gameId=${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500
        })
      ]);

      if (gameResponse.data.success) {
        setGame(gameResponse.data.data);
      } else {
        throw new Error('Failed to load game details');
      }

      if (tournamentsResponse.data.success) {
        setTournaments(tournamentsResponse.data.data || []);
      } else {
        console.warn('Failed to load tournaments');
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || 'Failed to load game data. Please try again later.');
      toast.error('Failed to load game data');
      
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: `/tournament-lobby/${gameId}` } });
      }
    } finally {
      setLoading(false);
    }
  }, [gameId, navigate]);

  useEffect(() => {
    if (gameId) {
      fetchGameAndTournaments();
    }
  }, [gameId, fetchGameAndTournaments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <BackgroundBubbles />
        <Header />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        </div>
        <Navbar />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <BackgroundBubbles />
        <Header />
        <div className="container mx-auto px-4 py-8 text-center relative z-10">
          <div className="bg-red-900/30 border border-red-800 text-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-2">Error Loading Game</h2>
            <p className="mb-4">{error || 'Game not found'}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/tournaments')}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
        <Navbar />
      </div>
    );
  }

  // Tournament card component with existing styling
  const TournamentCard = ({ id, name, entryFee, prizePool, currentPlayers, maxPlayers, startTime, status, mode }) => (
    <div 
      className="bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-6 shadow-md hover:border-yellow-400/50 transition-all duration-200 cursor-pointer"
      onClick={() => handleViewTournament(id)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold line-clamp-2">{name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          status === 'live' ? 'bg-red-500' :
          status === 'upcoming' ? 'bg-blue-500' :
          'bg-gray-600'
        }`}>
          {status?.toUpperCase() || 'UNKNOWN'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-400">Entry Fee</p>
          <p className="text-yellow-500 font-medium flex items-center">
            {mode === 'coin' ? (
              <FaCoins className="mr-1" />
            ) : (
              <FaRupeeSign className="mr-1" />
            )}
            {formatPrize(entryFee || 0, mode === 'coin')}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Prize Pool</p>
          <p className="text-green-400 font-medium">
            {formatPrize(prizePool || 0, mode === 'coin')}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Players</p>
          <p className="font-medium flex items-center">
            <FaUsers className="mr-1 text-blue-400" />
            {formatPlayerCount(currentPlayers?.length || 0, maxPlayers || '∞')}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Starts</p>
          <p className="font-medium flex items-center">
            <FaClock className="mr-1 text-yellow-400" />
            {formatDateTime(startTime)}
          </p>
        </div>
      </div>
      
      <div className="bg-gray-800/50 rounded-full h-2 mb-4">
        <div 
          className="bg-yellow-500 h-full rounded-full" 
          style={{ 
            width: `${Math.min(100, ((currentPlayers?.length || 0) / (maxPlayers || 1)) * 100)}%` 
          }}
        />
      </div>
      
      <button 
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          handleViewTournament(id);
        }}
      >
        <FaTrophy className="mr-2" />
        {status === 'upcoming' ? 'View Details' : 'Join Tournament'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <BackgroundBubbles />
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-800/50 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <div className="flex items-center gap-6">
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0 shadow-lg border border-gray-700">
              {game.assets?.thumbnail || game.thumbnail ? (
                <img 
                  src={game.assets?.thumbnail || game.thumbnail} 
                  alt={game.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-game.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <FaGamepad className="text-3xl text-yellow-500" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{game.displayName || game.name} Tournaments</h1>
              {game.type && (
                <span className="text-sm text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded-full">
                  {game.type}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search tournaments..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2.5 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['all', 'upcoming', 'live', 'completed'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? 'bg-yellow-500 text-gray-900 font-semibold'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredTournaments().length === 0 ? (
            <div className="col-span-full bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
              <FaGamepad className="mx-auto text-4xl text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Tournaments Found</h3>
              <p className="text-gray-400">
                {searchQuery 
                  ? 'No tournaments match your search. Try different keywords.'
                  : 'There are no tournaments available for this game right now.'}
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
            getFilteredTournaments().map(tournament => (
              <TournamentCard
                key={tournament.id}
                id={tournament.id}
                name={tournament.name}
                entryFee={tournament.entryFee}
                prizePool={tournament.prizePool}
                currentPlayers={tournament.currentPlayers}
                maxPlayers={tournament.maxPlayers}
                startTime={tournament.startTime}
                status={tournament.status}
                mode={tournament.mode}
              />
            ))
          )}
        </div>
      </main>
      <Navbar />
    </div>
  );
};

export default TournamentLobby;
