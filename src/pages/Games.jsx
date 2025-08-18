import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaStar, FaGamepad } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// --- FIXED: ADDED MISSING IMPORT FOR BackgroundBubbles ---
import CachedImage from '../components/CachedImage';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundCircles from '../components/BackgroundCircles';
import BackgroundBubbles from '../components/BackgroundBubbles'; // The missing import

import api from '../services/api';

const defaultGameImage = 'https://via.placeholder.com/300x200/1a1a2e/ffffff?text=Game+Image';

const GAME_CATEGORIES = [
  { id: 'all', name: 'All Games' },
  { id: 'card', name: 'Card' },
  { id: 'board', name: 'Board' },
  { id: 'action', name: 'Action' },
];

const Games = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [glowGameId, setGlowGameId] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await api.get('/games', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        });

        let gamesData = [];
        if (response.data?.success !== undefined) {
          gamesData = Array.isArray(response.data.data) ? response.data.data : [];
        } else if (Array.isArray(response.data)) {
          gamesData = response.data;
        } else if (response.data?.games) {
          gamesData = Array.isArray(response.data.games) ? response.data.games : [];
        }

        setGames(gamesData);
      } catch (err) {
        let errorMsg = 'Failed to load games. Please try again later.';
        if (err.response?.data?.error) {
          errorMsg = `Server error: ${err.response.data.error}`;
        } else if (err.message) {
          errorMsg = `Error: ${err.message}`;
        }
        setError(errorMsg);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // --- IMPROVEMENT: Simplified the useMemo return ---
  const filteredGames = useMemo(() => {
    if (!Array.isArray(games)) return [];

    const filtered = games.filter((game) => {
      if (!game || typeof game !== 'object') return false;

      const gameType = game.type || '';
      const gameName = game.name || '';
      const displayName = game.displayName || '';

      const categoryMatch =
        activeCategory === 'all' || gameType.toLowerCase() === activeCategory.toLowerCase();

      const searchLower = searchQuery.toLowerCase();
      const searchMatch =
        !searchQuery ||
        gameName.toLowerCase().includes(searchLower) ||
        displayName.toLowerCase().includes(searchLower);

      return categoryMatch && searchMatch;
    });

    return filtered;
  }, [games, activeCategory, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-royalBlueGradient text-white flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-base">Loading games...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-royalBlueGradient text-white flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-2">Error Loading Games</h2>
            <p className="text-red-200 mb-4 text-base">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royalBlueGradient text-white flex flex-col">
      <BackgroundCircles />

      <Header />

      <div className="flex-1 overflow-y-auto pt-[64px] pb-[64px]">
        {/* Search + Categories */}
        <div className="sticky top-0 z-20 pt-4 pb-4 backdrop-blur-md">
          <div className="absolute inset-0 z-[-1] pointer-events-none">
            <BackgroundBubbles />
          </div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-300 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-400/20 border border-dullBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-white placeholder-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Categories Desktop */}
              <div className="hidden sm:flex flex-wrap gap-2">
                {GAME_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-active text-gray-800'
                        : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Mobile */}
            <div className="sm:hidden mt-3 flex flex-wrap gap-2">
              {GAME_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-active text-gray-800'
                      : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <main className="container mx-auto px-4 relative z-10">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {activeCategory === 'all'
                  ? 'All Games'
                  : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Games`}
                {searchQuery && (
                  <span className="text-sm text-purple-300 ml-2">
                    "{searchQuery}"
                  </span>
                )}
              </h2>
              <div className="bg-gray-400/20 rounded-lg px-3 py-1.5 text-xs">
                {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} found
              </div>
            </div>

            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4">
                <AnimatePresence>
                  {filteredGames.map((game) => {
                    const gameId = game._id || game.name;
                    const isGlowing =
                      selectedGameId === gameId || glowGameId === gameId;

                    return (
                      <motion.div
                        key={gameId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer
                          ${
                            isGlowing
                              ? 'border-green-500 shadow-lg shadow-green-500/50 scale-105'
                              : 'border-transparent hover:border-green-500 hover:shadow-lg hover:shadow-green-500/50'
                          }`}
                        onTouchStart={() => setGlowGameId(gameId)}
                        onTouchEnd={() => setTimeout(() => setGlowGameId(null), 300)}
                        onClick={() => {
                          setSelectedGameId(gameId);
                          if (gameId) navigate(`/game-lobby/${gameId}`);
                        }}
                      >
                        <div className="aspect-square bg-gray-900 relative overflow-hidden">
                          <CachedImage
                            src={game.assets?.thumbnail || defaultGameImage}
                            alt={game.displayName || game.name || 'Game'}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultGameImage;
                            }}
                            loading="lazy"
                          />
                          {game.status?.isFeatured && (
                            <div className="absolute top-2 left-2 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center z-10">
                              <FaStar className="mr-1" />
                              <span>Featured</span>
                            </div>
                          )}
                        </div>
                        <div className="p-1 min-h-[30px] flex items-center justify-center">
                          <h3
                            className="font-semibold text-white text-[0.65rem] text-center"
                            title={game.displayName || game.name || 'Untitled Game'}
                          >
                            {game.displayName || game.name || 'Untitled Game'}
                          </h3>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-800/30 rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <FaGamepad className="text-xl text-gray-500" />
                </div>
                <h3 className="text-base font-medium text-gray-200 mb-1">
                  {searchQuery
                    ? `No games match "${searchQuery}"`
                    : activeCategory !== 'all'
                    ? `No ${activeCategory} games available`
                    : 'No games found'}
                </h3>
                <p className="text-xs text-gray-400">
                  {searchQuery || activeCategory !== 'all'
                    ? 'Try a different search term or category'
                    : 'Check back later for new games'}
                </p>
              </div>
            )}
          </section>
        </main>
      </div>

      <Navbar />
    </div>
  );
};

export default Games;
