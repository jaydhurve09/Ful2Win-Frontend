import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaTrophy, 
  FaGamepad,
  FaUsers,
  FaClock,
  FaSearch,
  FaRupeeSign,
  FaArrowLeft,
  FaBell,
  FaCoins
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import Header from './Header';
import BackgroundBubbles from './BackgroundBubbles';
import Navbar from './Navbar';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;

// Countdown timer hook
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!targetDate) return;
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft('Starting soon...');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

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

// Format prize pool with appropriate currency/coin display
const formatPrize = (amount, isCoin = false) => {
  if (isCoin) {
    return (
      <span>
        {amount.toLocaleString()} coins
      </span>
    );
  }
  return (
    <span className="flex items-center">
      <FaRupeeSign className="mr-1" />
      {amount.toLocaleString()}
    </span>
  );
};

// Format player count
const formatPlayerCount = (current, max) => {
  if (!max) return `${current} joined`;
  return `${current}/${max} players`;
};

const TournamentLobby = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  const [game, setGame] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState(null);

  // Get user ID from local storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData._id) {
          setUserId(userData._id);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Format prize as string for confirmation dialog
  const formatPrizeString = (amount, isCoin = false) => {
    if (isCoin) return `${amount.toLocaleString()} coins`;
    return `₹${amount.toLocaleString()}`;
  };
const goToLeaderboard = ({ gameName, tournamentId }) => {
  navigate(`/leaderboard_singlegame/${gameName}/${tournamentId}`);
};
const handleRegisterTournament = async (tournamentId) => {
  const tournament = tournaments.find(t => t.id === tournamentId || t._id === tournamentId);
    
  if (!tournament) {
    toast.error('Tournament not found');
    return;
  }

  const isCoinTournament = tournament.tournamentType === 'coin';
  const isConfirmed = window.confirm(
    `Register for ${tournament.name}?\n\n` +
    `Entry Fee: ${formatPrizeString(tournament.entryFee || 0, isCoinTournament)}\n` +
    `Prize Pool: ${formatPrizeString(tournament.prizePool || 0, isCoinTournament)}`
  );

  if (!isConfirmed) return;

  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !token) {
      toast.error('User not logged in');
      return;
    }

    const response = await axios.post(
      `${API_URL}/tournaments/${tournamentId}/register`,
      { playerId: user._id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast.success('Registered successfully!');
      // Redirect to play page
      handleViewTournament(tournamentId);
    } else {
      toast.error(response.data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    toast.error(
      error.response?.data?.message || 'Failed to register for tournament'
    );
  }
};
  // Handle view/join tournament
  const handleViewTournament = (tournamentId) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) {
      toast.error('Tournament not found');
      return;
    }

    const isCoinTournament = tournament.tournamentType === 'coin';
    
    // Show confirmation dialog first
    
    //  const isConfirmed = window.confirm(
    //   `Register for ${tournament.name}?\n\n` +
    //    `Entry Fee: ${formatPrizeString(tournament.entryFee || 0, isCoinTournament)}\n` +
    //    `Prize Pool: ${formatPrizeString(tournament.prizePool || 0, isCoinTournament)}`
      
    //  );

    // if (isConfirmed) {
    //   console.log('Tournament confirmed:', { userId, gameId, tournamentId });
      
     navigate(`/gameOn/${gameId}/${tournamentId}`);
   // }
  };
  //console.log(tournaments.currentPlayers);


  // Tournament card component
  const TournamentCard = ({ id, name, entryFee, prizePool, participants, maxParticipants, startTime, status, tournamentType }) => {
    const countdown = useCountdown(startTime);
    
    const handleCardClick = () => {
      // Only navigate if the tournament is live
      if (status === 'live') {
        handleViewTournament(id);
      }
    };
    
    const renderActionButtons = () => {
      if (status === 'completed' || status === 'cancelled') {
        return (
          <div className="flex gap-2 w-full text-sm sm:text-base">
            <div className="flex-1 text-center py-2 rounded-lg bg-gray-700 text-gray-300 text-xs sm:text-sm flex items-center justify-center">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
            <button 
               className="flex-1 bg-white/90 hover:bg-white text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Navigating to leaderboard for tournament:', id);
                 goToLeaderboard({ gameName: game.name, tournamentId: id });
              }}
            
            >
              <FaTrophy className="mr-1 sm:mr-2" size={14} />
              <span className="truncate">Leaderboard</span>
            </button>
          </div>
        );
      }
      
     if (status === 'live') {
const hasJoined = tournaments[0].currentPlayers?.some(p =>
  typeof p === 'string' ? p === userId : p?.userId === userId
);
console.log('hasJoined:', hasJoined);

  return (
    <div className="flex gap-2 w-full">
     <button 
  className={`flex-1 ${hasJoined ? 'bg-green-500 hover:bg-green-400' : 'bg-yellow-500 hover:bg-yellow-400'} text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center`}
  onClick={(e) => {
    e.stopPropagation();

    if (!hasJoined) {
         handleRegisterTournament(id);
       // agar confirm nahi kiya to ruk ja
    }

    handleViewTournament(id); // dono case me call hoga
  }}
>
  <FaGamepad className="mr-2" />
  {hasJoined ? 'Play' : 'Register'}
</button>

      <button 
        className="flex-1 bg-white/90 hover:bg-white text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          goToLeaderboard({ gameName: game.name, tournamentId: id });
        }}
      >
        <FaTrophy className="mr-2" />
        Leaderboard
      </button>
    </div>
  );
}
 
      // For upcoming tournaments
      return (
        <div className="flex gap-2 w-full">
          <button 
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Notify me clicked for tournament:', id);
              // TODO: Implement notification logic
            }}
          >
            <FaBell className="mr-2" />
            Notify Me
          </button>
          <button 
            className="flex-1 bg-yellow-500/50 text-gray-900 font-medium py-2 px-4 rounded-lg flex items-center justify-center cursor-not-allowed"
            disabled
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FaClock className="mr-2" />
            {countdown || 'Starting soon...'}
          </button>
        </div>
      );
    };
    
    return (
      <div 
        className="bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-2 sm:p-3 shadow-md hover:border-yellow-400/50 transition-all duration-200 cursor-pointer h-full flex flex-col overflow-hidden min-h-[180px] sm:min-h-[200px]"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm sm:text-base font-semibold line-clamp-1 pr-2">{name}</h3>
          <span className={`text-[9px] sm:text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${
            status === 'live' ? 'bg-red-500' :
            status === 'upcoming' ? 'bg-yellow-500' :
            status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
          }`}>
            {status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-1 text-xs sm:text-sm flex-grow">
          <div className="flex items-center truncate">
            {tournamentType === 'coin' ? (
              <FaCoins className="text-yellow-400 mr-1 flex-shrink-0" size={12} />
            ) : (
              <FaRupeeSign className="text-yellow-400 mr-1 flex-shrink-0" size={10} />
            )}
            <span className="truncate">
              {tournamentType === 'coin' ? `${entryFee || 0} coins` : formatPrize(entryFee || 0, false)}
            </span>
          </div>
          <div className="flex items-center truncate">
            <FaTrophy className="text-yellow-400 mr-1 flex-shrink-0" size={12} />
            <span className="truncate">
              {tournamentType === 'coin' ? `${prizePool || 0} coins` : formatPrize(prizePool || 0, false)}
            </span>
          </div>
          <div className="flex items-center truncate">
            <FaUsers className="text-yellow-400 mr-1 flex-shrink-0" size={12} />
            <span className="truncate">{formatPlayerCount(participants?.length || 0, maxParticipants)}</span>
          </div>
          <div className="flex items-center truncate">
            <FaClock className="text-yellow-400 mr-1 flex-shrink-0" size={12} />
            <span className="truncate text-[10px] sm:text-xs">
              {status === 'upcoming' ? 'Starts:' : 'Started:'} {formatDateTime(startTime).split(',').pop().trim()}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-full h-1 sm:h-1.5 mb-2">
          <div 
            className="bg-yellow-500 h-full rounded-full" 
            style={{ 
              width: `${Math.min(100, ((participants?.length || 0) / (maxParticipants || 1)) * 100)}%` 
            }}
          />
        </div>
        
        {renderActionButtons()}
      </div>
    );
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
        throw new Error(gameResponse.data.message || 'Failed to load game');
      }

      if (tournamentsResponse.data.success) {
        setTournaments(tournamentsResponse.data.data || []);
      } else {
        throw new Error(tournamentsResponse.data.message || 'Failed to load tournaments');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to load data');
      toast.error(error.message || 'Failed to load data');
      
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: `/tournament-lobby/${gameId}` } });
      } else if (error.response?.status === 404) {
        navigate('/tournaments');
      }
    } finally {
      setLoading(false);
    }
  }, [gameId, navigate]);

  // Initial data fetch
  useEffect(() => {
    fetchGameAndTournaments();
  }, [fetchGameAndTournaments]);

  // Filter and separate tournaments by type
  const filteredTournaments = tournaments.reduce((acc, tournament) => {
    const matchesFilter = activeFilter === 'all' || tournament.status === activeFilter;
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (matchesFilter && matchesSearch) {
      if (tournament.tournamentType === 'coin') {
        acc.coins.push(tournament);
      } else {
        acc.cash.push(tournament);
      }
    }
    return acc;
  }, { coins: [], cash: [] });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p>Loading tournaments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center p-6 bg-red-900/50 rounded-lg">
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen felx flex-col bg-blueGradient text-white">
      <BackgroundBubbles />
      <Header />
      <main className="container mx-auto mt-11 px-4 py-8 relative z-10">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-800/50 transition-colors"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-3xl font-bold">
            {game?.name ? `${game.displayName} Tournaments` : 'Tournaments'}
          </h1>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tournaments..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
            {['all', 'upcoming', 'live', 'completed', 'cancelled'].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-800/50 hover:bg-gray-700/50 text-white'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {filteredTournaments.coins.length === 0 && filteredTournaments.cash.length === 0 ? (
          <div className="text-center py-12">
            <FaTrophy className="mx-auto text-5xl text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-300">No tournaments found</h3>
            <p className="text-gray-500 mt-2">
              {searchQuery || activeFilter !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Check back later for new tournaments'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cash Tournaments Section */}
            {filteredTournaments.cash.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <FaRupeeSign className="text-yellow-500 mr-2" />
                  Cash Tournaments
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 auto-rows-fr">
                  {filteredTournaments.cash.map((tournament) => (
                    <TournamentCard
                      key={tournament._id}
                      id={tournament._id}
                      name={tournament.name}
                      entryFee={tournament.entryFee}
                      prizePool={tournament.prizePool}
                      participants={tournament.participants || []}
                      maxParticipants={tournament.maxParticipants}
                      startTime={tournament.startTime}
                      status={tournament.status}
                      tournamentType={tournament.tournamentType || 'cash'}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Coins Tournaments Section */}
            {filteredTournaments.coins.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <FaCoins className="text-yellow-500 mr-2" />
                  Coins Tournaments
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 auto-rows-fr">
                  {filteredTournaments.coins.map((tournament) => (
                    <TournamentCard
                      key={tournament._id}
                      id={tournament._id}
                      name={tournament.name}
                      entryFee={tournament.entryFee}
                      prizePool={tournament.prizePool}
                      participants={tournament.participants || []}
                      maxParticipants={tournament.maxParticipants}
                      startTime={tournament.startTime}
                      status={tournament.status}
                      tournamentType={tournament.tournamentType}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Navbar />
    </div>
  );
};

export default TournamentLobby;
