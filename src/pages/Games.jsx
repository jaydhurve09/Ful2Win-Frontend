import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaFire, FaStar, FaArrowRight, FaGamepad, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import BackgroundBubbles from '../components/BackgroundBubbles';

// Default game images (fallback)
// Using a placeholder image URL instead of local file
const defaultGameImage = 'https://via.placeholder.com/300x200/1a1a2e/ffffff?text=Game+Image'; // Make sure to add a default game image

// Game categories
const GAME_CATEGORIES = [
  { id: 'all', name: 'All Games' },
  { id: 'arcade', name: 'Arcade' },
  { id: 'card', name: 'Card' },
  { id: 'puzzle', name: 'Puzzle' },
  { id: 'board', name: 'Board' },
  { id: 'action', name: 'Action' },
  { id: 'adventure', name: 'Adventure' },
];

const Games = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch games from the backend
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('/api/games');
        setGames(response.data.data || []);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Memoize filtered and featured games to prevent unnecessary recalculations
  const { filteredGames, featuredGames } = useMemo(() => {
    if (!Array.isArray(games)) return { filteredGames: [], featuredGames: [] };
    
    const filtered = games.filter((game) => {
      if (!game) return false;
      
      const categoryMatch = activeCategory === 'all' || 
                         (game.category && game.category.toLowerCase() === activeCategory.toLowerCase());
      
      const searchMatch = !searchQuery || 
                        (game.name && game.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (game.displayName && game.displayName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return categoryMatch && searchMatch;
    });

    const featured = games
      .filter(game => game && game.featured)
      .slice(0, 5);

    return { filteredGames: filtered, featuredGames: featured };
  }, [games, activeCategory, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <FaSpinner className="animate-spin text-4xl text-purple-500" />
        </div>
        <Navbar />
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center p-6 bg-gray-800 rounded-lg max-w-md mx-4">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Navbar />
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-900 text-white flex flex-col">
      <BackgroundBubbles />
      <Header />
      
      {/* Search and Filter Bar */}
      <div className={`sticky top-16 z-20 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 transition-all duration-300 px-2 sm:px-0 ${isScrolled ? 'py-2' : 'py-3'}`}>
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Categories */}
            <div className="relative w-full">
              <div className="flex flex-wrap gap-2 pb-2 -mx-1">
                {GAME_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 mx-1 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 backdrop-blur-sm'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-6 sm:py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 mb-3 sm:mb-4"
          >
            Game Lobby
          </motion.h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover and compete in our exciting collection of games. Win rewards, challenge friends, and climb the leaderboards!
          </p>
        </div>

        {/* Featured Games */}
        {featuredGames.length > 0 && (
          <section className="mb-10 sm:mb-16">
            <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                <FaFire className="text-orange-400 mr-2" size={20} />
                Featured Games
              </h2>
              <button 
                className="flex items-center text-sm sm:text-base text-purple-300 hover:text-white transition-colors group"
                onClick={() => setActiveCategory('all')}
              >
                View All <FaArrowRight className="ml-1 text-xs sm:text-sm group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="relative">
              <div className="flex overflow-x-auto pb-4 sm:pb-6 -mx-2 sm:-mx-4 px-2 sm:px-4 scrollbar-hide">
                <div className="flex space-x-4 sm:space-x-6">
                  <AnimatePresence>
                    {featuredGames.map((game) => (
                      <motion.div
                        key={game._id || game.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex-shrink-0 w-56 sm:w-64 md:w-72"
                        onClick={() => navigate(`/game/${game.name || game._id}`)}
                      >
                        <GameCard 
                          game={{
                            ...game,
                            path: `/game/${game.name || game._id}`,
                            image: game.assets?.thumbnail || game.image,
                            title: game.displayName || game.name,
                            category: game.category || 'Game',
                            players: game.players || '1K+',
                            rating: game.rating || 4.5,
                            tags: game.tags || []
                          }} 
                          featured 
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Games */}
        <section className="px-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-0">
              {activeCategory === 'all' ? 'All Games' : `${activeCategory} Games`}
              {searchQuery && (
                <span className="text-purple-300 font-normal ml-2">"{searchQuery}"</span>
              )}
            </h2>
            <div className="flex items-center bg-gray-800/60 rounded-lg p-1 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-300 px-2 sm:px-3 whitespace-nowrap">Sort by:</span>
              <select 
                className="bg-gray-900/60 border-0 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none w-full sm:w-auto"
                defaultValue="popularity"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
          
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              <AnimatePresence>
                {filteredGames.map((game) => (
                  <motion.div
                    key={game._id || game.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    layout
                    className="w-full"
                    onClick={() => navigate(`/game/${game.name || game._id}`)}
                  >
                    <GameCard 
                      game={{
                        ...game,
                        path: `/game/${game.name || game._id}`,
                        image: game.assets?.thumbnail || game.image || defaultGameImage,
                        title: game.displayName || game.name,
                        category: game.category || 'Game',
                        players: game.players || '1K+',
                        rating: game.rating || 4.5,
                        tags: game.tags || []
                      }} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-gray-800/30 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-900/30 mb-4">
                <FaGamepad className="text-2xl sm:text-3xl text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium mb-2">No games found</h3>
              <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-6 px-4">
                {searchQuery 
                  ? `No games match "${searchQuery}".`
                  : activeCategory !== 'all'
                    ? `No ${activeCategory} games available.`
                    : 'No games available at the moment.'}
              </p>
              {(searchQuery || activeCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-5 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white text-sm sm:text-base transition-all shadow-lg hover:shadow-purple-500/20"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </section>
      </main>
      
      <Navbar />
    </div>
  );
};

export default Games;