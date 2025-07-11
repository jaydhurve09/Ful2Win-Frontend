import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGamepad, FaUsers, FaTrophy, FaSearch } from 'react-icons/fa';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';
import { toast } from 'react-toastify';
import api from '../services/api';

const Tournaments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredGames = useCallback(() => {
    return games.filter(game =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [games, searchQuery]);

  const handleViewGameTournaments = (gameId) => {
    navigate(`/tournament-lobby/${gameId}`);
  };

  const formatPlayerCount = (players, total) => {
    if (total === 0) return 'No players';
    return `${players || 0} players`;
  };

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // First, fetch all tournaments
      const [gamesResponse, tournamentsResponse] = await Promise.all([
        api.get('/games'),
        api.get('/tournaments', { headers })
      ]);

      if (gamesResponse.data.success) {
        const gamesData = gamesResponse.data.data || [];
        const tournaments = tournamentsResponse.data.success ? (tournamentsResponse.data.data || []) : [];

        const gamesWithDetails = gamesData.map((game) => {
          const gameId = game._id || game.id;
          if (!gameId) return { ...game, tournamentCount: 0, activePlayers: 0, maxPlayers: 0 };

          // Filter tournaments for this game
          const gameTournaments = tournaments.filter(t => {
            const tournamentGameId = t.game?._id || t.game || t.gameId;
            return tournamentGameId === gameId || tournamentGameId === game._id;
          });

          // Calculate active players from currentPlayers array length
          const activePlayers = gameTournaments.reduce((sum, t) => {
            const currentPlayersCount = Array.isArray(t.currentPlayers) ? t.currentPlayers.length : 0;
            return sum + currentPlayersCount;
          }, 0);
          
          const maxPlayers = gameTournaments.reduce((sum, t) => {
            // Use maxPlayers if available, otherwise use currentPlayers length as fallback
            if (t.maxPlayers !== undefined) return sum + (Number(t.maxPlayers) || 0);
            return sum + (Array.isArray(t.currentPlayers) ? t.currentPlayers.length : 0);
          }, 0);

          return {
            ...game,
            tournamentCount: gameTournaments.length,
            activePlayers,
            maxPlayers: maxPlayers || 1 // Ensure at least 1 to avoid division by zero
          };
        });

        setGames(gamesWithDetails);
      } else {
        throw new Error('Failed to load games');
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      setError(error.response?.data?.message || 'Failed to load games.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-blueGradient text-white">
        <BackgroundBubbles />
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
        <Navbar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-24 pb-28 bg-blueGradient text-white">
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
    <div className="min-h-screen bg-blueGradient text-white">
      <BackgroundBubbles />
      <Header />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col space-y-6 mb-6">
          <h1 className="text-3xl font-bold">Games</h1>
          <div className="relative">
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

        {getFilteredGames().length === 0 ? (
          <div className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {getFilteredGames().map((game) => {
              const gameId = game._id || game.id;
              const displayName = game.displayName || game.name;
              const thumbnail = game.assets?.thumbnail || game.image;

              return (
                <div
                  key={gameId}
                  className="group bg-black/30 border border-white/10 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 cursor-pointer text-sm flex flex-col max-w-[160px] mx-auto"
                  onClick={() => handleViewGameTournaments(gameId)}
                >
                  <div className="relative w-full h-40 bg-black overflow-hidden rounded-t-xl">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={displayName}
                        className="w-full h-full object-contain rounded-t-xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-game.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-t-xl">
                        <FaGamepad className="text-4xl text-yellow-500 opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] bg-yellow-500 text-gray-900 font-semibold px-2 py-0.5 rounded-full">
                        {game.tournamentCount || 0} Tournaments
                      </span>
                    </div>
                  </div>

                  <div className="p-2 flex flex-col flex-1">
                    <h3 className="font-bold truncate">{displayName}</h3>
                    {game.type && (
                      <p className="text-[10px] text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded-full inline-block mb-1">
                        {game.type}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 line-clamp-2 flex-1">{game.description}</p>

                    <div className="pt-2 mt-auto border-t border-gray-700/40 flex items-center justify-between">
                      <div className="flex items-center text-xs">
                        <FaUsers className="text-yellow-500 mr-1" />
                        {formatPlayerCount(game.activePlayers || 0, game.maxPlayers || 0)}
                      </div>
                      <button
                        className="ml-2 px-2 py-1 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold text-xs rounded flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewGameTournaments(gameId);
                        }}
                      >
                        <FaTrophy className="mr-1 text-xs" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
};

export default Tournaments;
