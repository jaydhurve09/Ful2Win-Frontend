import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaTrophy, 
  FaGamepad,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaPlay,
  FaMedal,
  FaInfoCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';
import '../styles/TournamentRegistration.css';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;

// Mock data for when API fails
const MOCK_TOURNAMENT = {
  _id: 'mock-tournament-123',
  tournamentId: 'BST0000',
  name: 'Demo Tournament',
  description: 'This is a demo tournament with mock data. The actual tournament details could not be loaded.',
  entryFee: 100,
  prizePool: 1000,
  startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  endTime: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
  maxPlayers: 100,
  registeredPlayers: 25,
  status: 'upcoming',
  game: {
    name: 'Demo Game',
    icon: 'https://via.placeholder.com/100',
    _id: 'mock-game-123'
  },
  rules: [
    'This is a mock tournament',
    'All rules are for demonstration purposes',
    'Register to join once the real tournament is available'
  ]
};

const MOCK_LEADERBOARD = [
  { username: 'Player1', rank: 1, score: 1000, prize: 500 },
  { username: 'Player2', rank: 2, score: 950, prize: 300 },
  { username: 'Player3', rank: 3, score: 900, prize: 200 },
  { username: 'You', rank: 4, score: 850, prize: 0, isCurrentUser: true },
];

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

const TournamentRegistration = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Initialize with mock data immediately for instant UI rendering
  const [tournament, setTournament] = useState({
    ...MOCK_TOURNAMENT,
    tournamentId: tournamentId || 'BST0000',
    name: `Tournament ${tournamentId || ''}`.trim() || 'Demo Tournament'
  });
  const [game, setGame] = useState({
    name: 'Demo Game',
    icon: 'https://via.placeholder.com/100',
    _id: 'mock-game-123'
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [entryFeeConfirmed, setEntryFeeConfirmed] = useState(false);
  const [leaderboard, setLeaderboard] = useState(MOCK_LEADERBOARD);
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Fetch tournament and game details in the background
  useEffect(() => {
    let isMounted = true;
    
    const fetchTournamentDetails = async () => {
      if (!tournamentId) return;
      
      setIsLoading(true);
      setApiError(null);
      
      try {
        const token = localStorage.getItem('token');
        
        // Fetch tournament data
        const tournamentResponse = await axios.get(`${API_URL}/tournaments/${tournamentId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: 5000 // 5 second timeout
        });
        
        if (isMounted) {
          setTournament(prev => ({
            ...prev,
            ...tournamentResponse.data,
            // Keep mock values for any missing fields
            name: tournamentResponse.data.name || prev.name,
            description: tournamentResponse.data.description || prev.description,
            prizePool: tournamentResponse.data.prizePool || prev.prizePool,
            entryFee: tournamentResponse.data.entryFee || prev.entryFee
          }));
          
          // Check if user is registered if we have a token
          if (token) {
            try {
              const userResponse = await axios.get(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 3000
              });
              const userId = userResponse.data._id;
              setIsRegistered(
                tournamentResponse.data.registeredPlayers?.some(p => p._id === userId) || false
              );
            } catch (userError) {
              console.log('Skipping user registration check:', userError.message);
            }
          }
          
          // Fetch leaderboard if tournament is live or completed
          if (['live', 'completed'].includes(tournamentResponse.data.status)) {
            fetchLeaderboard(tournamentId);
          }
        }
      } catch (error) {
        console.log('Using mock data:', error.message);
        setApiError('Using demo data - could not connect to server');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Only fetch if we have a tournament ID
    if (tournamentId) {
      fetchTournamentDetails();
    }
    
    return () => {
      isMounted = false;
    };
  }, [tournamentId]);

  // Fetch leaderboard data with fallback to mock data
  const fetchLeaderboard = async (tournamentId) => {
    if (!tournamentId) {
      setLeaderboard(MOCK_LEADERBOARD);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/tournaments/${tournamentId}/leaderboard`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 3000
      });
      setLeaderboard(response.data);
    } catch (error) {
      console.log('Using mock leaderboard data');
      setLeaderboard(MOCK_LEADERBOARD);
    }
  };

  // Handle tournament registration
  const handleRegister = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login', { state: { from: `/tournament/register/${tournamentId}` } });
      return;
    }
    
    // For demo purposes, just show success if using mock data
    if (apiError) {
      setIsRegistered(true);
      toast.success('Successfully registered for the tournament!');
      return;
    }
    
    if (tournament.entryFee > 0) {
      setShowConfirmation(true);
    } else {
      handleConfirmRegistration();
    }
  };

  // Handle play button click
  const handlePlay = () => {
    if (!game || !tournament) return;
    navigate(`/play/${game.gameId}`, { 
      state: { 
        tournamentId: tournament._id,
        mode: 'tournament'
      } 
    });
  };

  // Handle back button click
  const handleBack = () => {
    if (game) {
      navigate(`/tournament-lobby/${game._id || game}`);
    } else {
      navigate('/tournaments');
    }
  };

  // Handle confirmation of registration
  const handleConfirmRegistration = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: `/tournament/register/${tournamentId}` } });
      return;
    }
    
    try {
      // For demo purposes, just update the UI if using mock data
      if (apiError) {
        setIsRegistered(true);
        setTournament(prev => ({
          ...prev,
          registeredPlayers: (typeof prev.registeredPlayers === 'number' ? prev.registeredPlayers : 0) + 1
        }));
        toast.success('Successfully registered for the tournament!');
        setShowConfirmation(false);
        return;
      }
      
      // Try real registration if API is available
      const response = await axios.post(
        `${API_URL}/tournaments/${tournamentId}/register`,
        {},
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );
      
      setIsRegistered(true);
      setTournament(prev => ({
        ...prev,
        registeredPlayers: (prev.registeredPlayers || 0) + 1
      }));
      
      toast.success('Successfully registered for the tournament!');
      setShowConfirmation(false);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register for the tournament');
    }
  };

  // Show loading indicator only when we're actively loading and have no data yet
  if (isLoading && !tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-24 pb-20">
          {apiError && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 p-3 rounded-lg mb-6 text-sm">
              <p>{apiError}</p>
            </div>
          )}
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error banner if there was an API error but continue showing the UI
  const ErrorBanner = () => (
    <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 p-3 rounded-lg mb-6 text-sm">
      <p>{apiError || 'Using demo data'}</p>
    </div>
  );

  // Calculate time remaining until tournament starts
  const getTimeRemaining = () => {
    if (!tournament.startTime) return 'TBD';
    
    const now = new Date();
    const startTime = new Date(tournament.startTime);
    const endTime = tournament.endTime ? new Date(tournament.endTime) : null;
    
    if (tournament.status === 'completed') {
      return 'Tournament has ended';
    }
    
    if (tournament.status === 'live') {
      if (endTime) {
        const diff = endTime - now;
        if (diff <= 0) return 'Ending soon';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `Ends in ${hours}h ${minutes}m`;
      }
      return 'Live Now';
    }
    
    // For upcoming tournaments
    const diff = startTime - now;
    if (diff <= 0) return 'Starting soon';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Starts in ${days}d ${hours}h`;
    return `Starts in ${hours}h`;
  };

  // Render tournament details
  const renderTournamentDetails = () => (
    <div className="space-y-6">
      {/* Tournament Banner */}
      {tournament.bannerImage && (
        <div className="relative rounded-lg overflow-hidden bg-gray-800 h-48">
          <img 
            src={tournament.bannerImage} 
            alt={tournament.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <h1 className="text-2xl font-bold">{tournament.name}</h1>
            {game && <p className="text-blue-300">{game.name}</p>}
          </div>
          {tournament.status === 'live' && (
            <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
              LIVE
            </div>
          )}
        </div>
      )}

      {/* Tournament Info */}
      <div className="bg-gray-400/20 backdrop-blur-sm rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <FaTrophy className="text-yellow-400" />
            <div>
              <p className="text-sm text-dullBlue">Prize Pool</p>
              <p className="font-medium">
                {formatPrize(tournament.prizePool, tournament.tournamentType === 'coin')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FaUsers className="text-blue-400" />
            <div>
              <p className="text-sm text-dullBlue">Players</p>
              <p className="font-medium">
                {tournament.registeredPlayers || 0}/{tournament.maxPlayers || '∞'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FaClock className="text-green-400" />
            <div>
              <p className="text-sm text-dullBlue">Starts In</p>
              <p className="font-medium">{getTimeRemaining()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FaGamepad className="text-purple-400" />
            <div>
              <p className="text-sm text-dullBlue">Entry Fee</p>
              <p className="font-medium">
                {tournament.entryFee > 0 
                  ? formatPrize(tournament.entryFee, tournament.tournamentType === 'coin')
                  : 'Free'}
              </p>
            </div>
          </div>
        </div>

        {/* Tournament Description */}
        {tournament.description && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">About Tournament</h3>
            <p className="text-gray-300 text-sm">{tournament.description}</p>
          </div>
        )}

        {/* Rules & Prizes */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Rules & Prizes</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-start">
              <FaInfoCircle className="text-blue-400 mt-1 mr-2 flex-shrink-0" />
              <span>Top players will win prizes based on their final ranking.</span>
            </p>
            <p className="flex items-start">
              <FaInfoCircle className="text-blue-400 mt-1 mr-2 flex-shrink-0" />
              <span>In case of a tie, the player who reached the score first wins.</span>
            </p>
            {tournament.entryFee > 0 && (
              <p className="flex items-start text-yellow-300">
                <FaInfoCircle className="text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                <span>Entry fee is non-refundable once the tournament starts.</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render leaderboard
  const renderLeaderboard = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Leaderboard</h2>
      
      {leaderboard.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No leaderboard data available yet.</p>
          {tournament.status === 'upcoming' && (
            <p className="mt-2">Check back when the tournament starts!</p>
          )}
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-700/50 p-3 font-medium text-sm">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Player</div>
            <div className="col-span-3 text-right">Score</div>
            <div className="col-span-2 text-right">Prize</div>
          </div>
          
          {leaderboard.map((entry, index) => (
            <div 
              key={entry._id || index}
              className={`grid grid-cols-12 items-center p-3 border-b border-gray-700/50 ${
                index < 3 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' : ''
              }`}
            >
              <div className="col-span-1 font-medium">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </div>
              <div className="col-span-6 flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                  {entry.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="truncate">{entry.username || 'Anonymous'}</span>
              </div>
              <div className="col-span-3 text-right font-mono">
                {entry.score?.toLocaleString() || '0'}
              </div>
              <div className="col-span-2 text-right text-yellow-400 font-medium">
                {index < 3 && tournament.prizePool > 0 ? (
                  formatPrize(
                    Math.floor(tournament.prizePool * [0.5, 0.3, 0.2][index]),
                    tournament.tournamentType === 'coin'
                  )
                ) : '-'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-blueGradient text-white">
      <BackgroundBubbles />
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24 pb-28 relative z-10">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="flex items-center text-white hover:text-blue-300 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to {game ? game.name : 'Tournaments'}
        </button>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tournament Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'details' 
                    ? 'text-active border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              
              {['live', 'completed'].includes(tournament.status) && (
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'leaderboard'
                      ? 'text-blue-400 border-b-2 border-blue-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('leaderboard')}
                >
                  Leaderboard
                </button>
              )}
            </div>
            
            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'details' ? renderTournamentDetails() : renderLeaderboard()}
            </div>
          </div>
          
          {/* Right Column - Action Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-400/20 backdrop-blur-sm rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Tournament Status</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-dullBlue">Status:</span>
                  <span className={`font-medium ${
                    tournament.status === 'live' ? 'text-green-400' : 
                    tournament.status === 'completed' ? 'text-blue-400' : 'text-yellow-400'
                  }`}>
                    {tournament.status?.charAt(0).toUpperCase() + (tournament.status?.slice(1) || '')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-dullBlue">Starts:</span>
                  <span className="font-medium">
                    {tournament.startTime ? formatDateTime(tournament.startTime) : 'TBD'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-dullBlue">Ends:</span>
                  <span className="font-medium">
                    {tournament.endTime ? formatDateTime(tournament.endTime) : 'TBD'}
                  </span>
                </div>
                
                {isRegistered && (
                  <div className="pt-4 border-t border-gray-700 mt-4">
                    <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-lg text-center">
                      <FaCheckCircle className="inline-block mr-2" />
                      You are registered for this tournament
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-700 mt-4">
                  {isRegistered ? (
                    <div className="space-y-4">
                      <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-lg text-center">
                        <FaCheckCircle className="inline-block mr-2" />
                        You are registered for this tournament
                      </div>
                      
                      {tournament.status === 'live' && (
                        <button
                          onClick={handlePlay}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                        >
                          <FaPlay className="text-sm" />
                          <span>Play Now</span>
                        </button>
                      )}
                      
                      {tournament.status === 'upcoming' && (
                        <button
                          disabled
                          className="w-full bg-gray-600 text-gray-300 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
                        >
                          Starts {getTimeRemaining()}
                        </button>
                      )}
                      
                      {tournament.status === 'completed' && (
                        <div className="text-center py-2 text-gray-400">
                          Tournament has ended
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tournament.status === 'upcoming' ? (
                        <>
                          <button
                            onClick={handleRegister}
                            disabled={loading || tournament.status !== 'upcoming'}
                            className={`w-full ${
                              tournament.entryFee > 0
                                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                            } text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-70 disabled:transform-none`}
                          >
                            {loading ? (
                              'Processing...'
                            ) : tournament.entryFee > 0 ? (
                              `Join for ${formatPrize(tournament.entryFee, tournament.tournamentType === 'coin')}`
                            ) : (
                              'Join for Free'
                            )}
                          </button>
                          
                          {tournament.entryFee > 0 && (
                            <p className="text-xs text-center text-gray-400">
                              Entry fee will be deducted when the tournament starts
                            </p>
                          )}
                        </>
                      ) : tournament.status === 'live' ? (
                        <div className="text-center py-4 text-yellow-300">
                          Registration is closed
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-400">
                          Tournament has ended
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Game Info Card */}
            {game && (
              <div className="mt-6 bg-gray-400/20 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">About {game.name}</h3>
                <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                  {game.description || 'No description available.'}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {game.type && (
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                      {game.type}
                    </span>
                  )}
                  {game.modesAvailable?.map((mode, index) => (
                    <span key={index} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Confirm Entry Fee</h3>
            <p className="text-gray-300 mb-6">
              This tournament has an entry fee of{' '}
              <span className="text-yellow-400 font-medium">
                {formatPrize(tournament.entryFee, tournament.tournamentType === 'coin')}
              </span>
              . The fee will be deducted from your account when the tournament starts.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEntryFeeConfirmed(true);
                  handleRegister();
                }}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Confirm & Register
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Navbar />
    </div>
  );
};

export default TournamentRegistration;
