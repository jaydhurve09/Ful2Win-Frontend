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

  // Mock data for fallback
  const mockGames = [
    {
      id: '1',
      name: 'trex-runner',
      displayName: 'T-Rex Runner',
      category: 'arcade',
      featured: true,
      players: '1.2K',
      rating: 4.5,
      tags: ['popular', 'adventure'],
      assets: {
        thumbnail: 'https://cdn.dribbble.com/users/1787323/screenshots/11372433/media/6a9d7cc0f732b4e9d0c1f5d4e9e4e4d0.png'
      }
    },
    {
      id: '2',
      name: 'snake-game',
      displayName: 'Snake Game',
      category: 'arcade',
      featured: true,
      players: '2.5K',
      rating: 4.2,
      tags: ['classic', 'addictive'],
      assets: {
        thumbnail: 'https://cdn.dribbble.com/users/1787323/screenshots/11372433/media/6a9d7cc0f732b4e9d0c1f5d4e9e4e4d0.png'
      }
    },
    // Add more mock games as needed
  ];

  // Fetch games from the backend with fallback to mock data
  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Try to fetch from backend
        const response = await axios.get('http://localhost:5000/api/games', {
          timeout: 3000 // 3 second timeout
        }).catch(() => ({ data: { data: [] } })); // Fallback to empty array if request fails
        
        // Use backend data if available, otherwise use mock data
        const gamesData = response?.data?.data?.length > 0 
          ? response.data.data 
          : mockGames;
          
        setGames(gamesData);
      } catch (err) {
        console.warn('Using mock games data due to error:', err);
        // Use mock data if there's an error
        setGames(mockGames);
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
    <div className="min-h-screen bg-blueGradient text-white flex flex-col">
      <BackgroundBubbles />
      
      <div className="sticky top-0 z-30">
        <Header />
        
        {/* Sticky header with search and filters */}
        <div className="mt-16 py-3">
          <div className="container mx-auto px-3">
            {/* Search Bar */}
            <div className="relative w-full mb-3">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search games..."
                className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Categories - Responsive grid for mobile */}
            <div className="w-full">
              <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {GAME_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 text-center truncate ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-gray-800/60 text-gray-300 active:bg-gray-700/60'
                    }`}
                    title={category.name}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-3 pt-4 pb-6 sm:py-6 md:py-8 relative z-10">
        {/* Hero Section */}
        <div className="mb-4 sm:mb-6 pt-2">
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto text-center leading-relaxed">
            Discover and compete in our exciting collection of games. Win rewards, challenge friends, and climb the leaderboards!
          </p>
        </div>

        {/* Featured Games */}
        {featuredGames.length > 0 && (
          <section className="mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-lg font-bold flex items-center">
                <FaFire className="text-orange-400 mr-2" size={18} />
                Featured Games
              </h2>
              <button 
                className="flex items-center text-xs text-purple-300 active:text-white transition-colors group"
                onClick={() => setActiveCategory('all')}
              >
                View All <FaArrowRight className="ml-1 text-xs group-active:translate-x-0.5 transition-transform" />
              </button>
            </div>
            
            <div className="relative">
              <div className="flex overflow-x-auto pb-3 -mx-2 px-2 scrollbar-hide">
                <div className="flex space-x-3">
                  <AnimatePresence>
                    {featuredGames.map((game) => (
                      <motion.div
                        key={game._id || game.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64"
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
        <section className="mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <h2 className="text-base sm:text-lg font-bold">
              {activeCategory === 'all' ? 'All Games' : `${activeCategory} Games`}
              {searchQuery && (
                <span className="text-purple-300 font-normal ml-1 text-xs sm:text-sm">"{searchQuery}"</span>
              )}
            </h2>
            <div className="flex items-center bg-gray-800/60 rounded-lg p-1 w-full sm:w-auto">
              <span className="text-2xs sm:text-xs text-gray-300 px-2 whitespace-nowrap">Sort by:</span>
              <select 
                className="bg-gray-900/60 border-0 text-xs focus:ring-2 focus:ring-purple-500 rounded-lg px-2 py-1.5 focus:outline-none w-full sm:w-auto"
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
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
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
            <div className="text-center py-12 bg-gray-800/30 rounded-lg px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/30 mb-4">
                <FaGamepad className="text-2xl text-purple-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No games found</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
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
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 active:from-purple-700 active:to-blue-700 rounded-lg text-white text-sm transition-all active:scale-95"
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