import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import BackgroundBubbles from '../components/BackgroundBubbles';
import ludo from '../assets/ludo.png';
import rummy from '../assets/rummy.png';
import carrom from '../assets/carrom.png';
import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;

const Tournaments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [tournamentType, setTournamentType] = useState(null); // Set to null to show all types by default
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameThumbnails, setGameThumbnails] = useState({});
  const [gameDetails, setGameDetails] = useState({});
  
  // Handle join tournament - navigates to the tournament lobby
  const handleJoinTournament = (tournament) => {
    console.log('Tournament object:', tournament);
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/tournaments' } });
      return;
    }
    
    if (!tournament) {
      console.error('No tournament data provided');
      return;
    }
    
    // Determine if it's a cash or coin tournament
    const isCashTournament = tournament.mode === 'cash' || tournament.entryFee > 0;
    const tournamentType = isCashTournament ? 'cash' : 'coin';
    
    // Navigate to the tournament lobby
    navigate(`/tournament/${tournament.id}?type=${tournamentType}`);
  };

  const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'live', label: 'Live' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
  ];

  // Fetch game details by gameId and update tournaments with thumbnails
  const fetchGameDetails = useCallback(async (gameIds) => {
    try {
      console.log('Fetching game details for IDs:', gameIds);
      const token = localStorage.getItem('token');
      const uniqueGameIds = [...new Set(gameIds.filter(id => id))];
      
      const gamePromises = uniqueGameIds.map(async (gameId) => {
        try {
          console.log(`Fetching game ${gameId}...`);
          const response = await axios.get(`${API_URL}/games/${gameId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: true
          });
          
          console.log(`Game ${gameId} response:`, response.data);
          const gameData = response.data?.data || {};
          console.log('Game data:', gameData);
          
          // Function to construct game asset URL
          const getGameAssetUrl = (assetPath) => {
            if (!assetPath) return null;
            
            // Handle full URLs
            if (assetPath.startsWith('http')) return assetPath;
            
            // Handle protocol-relative URLs
            if (assetPath.startsWith('//')) return `https:${assetPath}`;
            
            // Handle relative paths - construct URL to the game's assets
            // Format: /api/games/{gameId}/assets/{filename}
            return `${API_URL}/games/${gameId}/assets/${assetPath}`;
          };

          // Try to get thumbnail from different possible locations in order of preference
          let thumbnail = null;
          
          // Check for thumbnail in different possible locations
          if (gameData.assets?.thumbnail) {
            thumbnail = getGameAssetUrl(gameData.assets.thumbnail);
          } else if (gameData.thumbnail) {
            thumbnail = getGameAssetUrl(gameData.thumbnail);
          } else if (gameData.image) {
            thumbnail = getGameAssetUrl(gameData.image);
          } else if (gameData.bannerImage?.url) {
            thumbnail = getGameAssetUrl(gameData.bannerImage.url);
          }
          
          console.log(`Game ${gameId} thumbnail:`, thumbnail);
            
          return {
            gameId,
            thumbnail,
            name: gameData.name || 'Game'
          };
        } catch (err) {
          console.error(`Error fetching game ${gameId}:`, err);
          return { gameId, thumbnail: null, name: 'Game' };
        }
      });
      
      const gameResults = await Promise.all(gamePromises);
      const newGameDetails = {};
      
      gameResults.forEach(game => {
        if (game && game.gameId) {
          newGameDetails[game.gameId] = {
            thumbnail: game.thumbnail,
            name: game.name
          };
        }
      });
      
      console.log('New game details:', newGameDetails);
      
      // Update the game details state
      setGameDetails(prev => ({
        ...prev,
        ...newGameDetails
      }));
      
      // Also update the tournaments with the new thumbnails
      setTournaments(prevTournaments => 
        prevTournaments.map(tournament => {
          const gameId = tournament.gameId;
          if (gameId && newGameDetails[gameId]?.thumbnail) {
            return {
              ...tournament,
              gameImage: newGameDetails[gameId].thumbnail
            };
          }
          return tournament;
        })
      );
      
      return newGameDetails;
    } catch (err) {
      console.error('Error in fetchGameDetails:', err);
      return {};
    }
  }, []);

  // Fetch tournaments from the backend
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${API_URL}/tournaments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });

        if (response.data && Array.isArray(response.data.data || response.data)) {
          const data = response.data.data || response.data;
          // Extract all unique game IDs and create formatted tournaments
          const uniqueGameIds = [];
          const gameIdMap = {};
          
          const formattedTournaments = data.map(tournament => {
            const gameId = tournament.gameId || tournament.game?._id || tournament.gameId;
            
            if (gameId && !gameIdMap[gameId]) {
              gameIdMap[gameId] = true;
              uniqueGameIds.push(gameId);
            }
            
            // Get entry fee and prize pool from the tournament data
            const entryFee = tournament.entryFee || 0;
            const prizePool = tournament.prizePool || 0;
            
            // Format players count
            const currentPlayers = tournament.currentPlayers || 0;
            const maxPlayers = tournament.maxPlayers || 100;
            
            // Get image with proper fallbacks
          let gameImage = ludo; // Default fallback
          
          // First check if we have the game details with thumbnail
          if (tournament.game?.assets?.thumbnail) {
            gameImage = tournament.game.assets.thumbnail;
          } 
          // Then check if we have a direct image reference
          else if (tournament.image) {
            gameImage = tournament.image;
          }
          // Then check banner image
          else if (tournament.bannerImage?.url) {
            gameImage = tournament.bannerImage.url;
          }
          // Then check game type for fallback
          else if (tournament.gameType) {
            const gameType = tournament.gameType.toLowerCase();
            if (gameType.includes('rummy')) gameImage = rummy;
            else if (gameType.includes('carrom')) gameImage = carrom;
          }
            
            return {
              id: tournament._id || tournament.id,
              gameId: gameId,
              game: tournament.game, // Store the full game object if available
              name: tournament.name || 'Tournament',
              image: gameImage,
              entryFee: entryFee,
              prizePool: prizePool,
              players: `${currentPlayers}/${maxPlayers}`,
              timeLeft: tournament.timeLeft || '2h 30m left',
              status: (tournament.status || 'upcoming').toLowerCase(),
              mode: (tournament.tournamentType || 'COIN').toLowerCase() === 'cash' ? 'cash' : 'coin',
              type: (tournament.gameType || 'ludo').toLowerCase()
            };
          });
          
          // First set the tournaments with initial data
          setTournaments(formattedTournaments);
          
          // Then fetch additional game details for all unique gameIds
          if (uniqueGameIds.length > 0) {
            fetchGameDetails(uniqueGameIds).then(updatedGameDetails => {
              // Update tournaments with the fetched game details
              setTournaments(prevTournaments => 
                prevTournaments.map(tournament => {
                  const gameId = tournament.gameId;
                  if (gameId && updatedGameDetails[gameId]?.thumbnail) {
                    return {
                      ...tournament,
                      gameImage: updatedGameDetails[gameId].thumbnail
                    };
                  }
                  return tournament;
                })
              );
            });
          }
        }
      } catch (err) {
        console.error('Error fetching tournaments:', err);
        setError(err.response?.data?.message || 'Failed to load tournaments. Please try again later.');
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login', { state: { from: '/tournaments' } });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const getFilteredTournaments = () => {
    return tournaments.filter(tournament => {
      // Only apply status filter if a specific status is selected
      const matchStatus = activeTab === 'all' || tournament.status === activeTab;
      // Only apply type filter if a specific type is selected
      const matchType = !tournamentType || tournament.mode === tournamentType;
      return matchStatus && matchType;
    });
  };

  if (loading) {
    return (
      <div className="bg-blueGradient text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading tournaments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-blueGradient text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-blue-900/30 backdrop-blur-md rounded-xl max-w-md mx-4">
          <p className="text-red-400 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blueGradient text-white min-h-screen pb-24">
      <BackgroundBubbles />
      <div className="bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Tournament Type Tabs - Desktop */}
          <div className="hidden md:flex gap-4 mb-6">
            <Button
              variant={tournamentType === null ? 'primary' : 'gradient'}
              onClick={() => setTournamentType(null)}
              className="rounded-full"
            >
              All Tournaments
            </Button>
            <Button
              variant={tournamentType === 'coin' ? 'primary' : 'gradient'}
              onClick={() => setTournamentType('coin')}
              className="rounded-full"
            >
              Coin Tournaments
            </Button>
            <Button
              variant={tournamentType === 'cash' ? 'primary' : 'gradient'}
              onClick={() => setTournamentType('cash')}
              className="rounded-full"
            >
              Cash Tournaments
            </Button>
          </div>

          {/* Tournament Type Tabs - Mobile */}
          <div className="flex md:hidden gap-2 mb-6 mt-16">
            <Button
              variant={tournamentType === null ? 'primary' : 'gradient'}
              onClick={() => setTournamentType(null)}
              className="rounded-full text-sm px-4 py-2 flex-1"
            >
              All
            </Button>
            <Button
              variant={tournamentType === 'coin' ? 'primary' : 'gradient'}
              onClick={() => setTournamentType('coin')}
              className="rounded-full text-sm px-4 py-2 flex-1"
            >
              Coin
            </Button>
            <Button
              variant={tournamentType === 'cash' ? 'primary' : 'gradient'}
              onClick={() => setTournamentType('cash')}
              className="rounded-full text-sm px-4 py-2 flex-1"
            >
              Cash
            </Button>
          </div>

          {/* Status Tabs - Desktop */}
          <div className="hidden md:flex gap-6 mb-8">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-yellow-400 text-black rounded-full'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tournament Cards - Desktop */}
          <div className="hidden md:grid md:grid-cols-2 gap-4">
            {getFilteredTournaments().map((tournament) => (
              <div key={tournament.id} className="bg-gradient-to-br from-gray-800/10 to-black/10 backdrop-blur-lg border border-white/30 rounded-xl p-6">
                <div className="flex gap-6">
                  <div className="w-2/5">
                    {console.log(`Rendering desktop image for tournament ${tournament.id}:`, {
                      gameId: tournament.gameId,
                      gameImage: tournament.gameImage,
                      fallback: ludo
                    })}
                    <div className="w-full aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={tournament.gameImage || ludo} 
                        alt={tournament.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Error loading image for tournament ${tournament.id}:`, e.target.src);
                          e.target.onerror = null;
                          e.target.src = ludo;
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
                    <Button 
                      variant="primary" 
                      fullWidth 
                      className="mb-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinTournament(tournament);
                      }}
                    >
                      {tournament.status === 'completed' ? 'View Results' : 'Join Tournament'}
                    </Button>
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
                      fallback: ludo
                    })}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={tournament.gameImage || ludo} 
                        alt={tournament.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = ludo;
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
