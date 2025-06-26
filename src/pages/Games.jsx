import React, { useState, useEffect } from 'react';
import { FaSearch, FaFire, FaStar, FaArrowRight, FaGamepad } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import BackgroundBubbles from '../components/BackgroundBubbles';

// Game images
import rummy from '../assets/rummy.png';
import mazeRunner from '../assets/maze-runner.png';
import poker from '../assets/poker.png';
import ludo from '../assets/ludo.png';
import flappyball from '../assets/Flappy-Ball.png';
import gravityhop from '../assets/GravityHop.png';

// Game data
const games = [
  { 
    id: 1, 
    title: 'Flappy Bird', 
    category: 'arcade', 
    players: '10K+', 
    image: flappyball, 
    path: 'flappyball', 
    featured: true,
    rating: 4.8,
    tags: ['Popular', 'Trending']
  },
  { 
    id: 2, 
    title: 'Rummy', 
    category: 'Card', 
    players: '25K+', 
    image: rummy, 
    featured: true,
    rating: 4.9,
    tags: ['Hot', 'Multiplayer']
  },
  { 
    id: 3, 
    title: 'Maze Runner', 
    category: 'Puzzle', 
    players: '8K+', 
    image: mazeRunner, 
    featured: true,
    rating: 4.5,
    tags: ['Adventure', 'Single Player']
  },
  { 
    id: 4, 
    title: 'Poker', 
    category: 'Card', 
    players: '15K+', 
    image: poker, 
    featured: false,
    rating: 4.7,
    tags: ['Classic', 'Multiplayer']
  },
  { 
    id: 5, 
    title: 'Ludo', 
    category: 'Board', 
    players: '30K+', 
    image: ludo, 
    featured: true,
    rating: 4.6,
    tags: ['Family', 'Multiplayer']
  },
  { 
    id: 6, 
    title: 'Gravity Hop', 
    category: 'arcade', 
    players: '5K+', 
    image: gravityhop, 
    featured: false,
    rating: 4.3,
    tags: ['New', 'Challenging']
  },
];

const Games = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const categories = ['all', 'Card', 'Puzzle', 'Board', 'arcade'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredGames = games.filter((game) => {
    const matchesCategory = activeCategory === 'all' || game.category === activeCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredGames = games.filter(game => game.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-x-hidden flex flex-col">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />
        
        {/* Sticky Search Bar */}
        <div 
          className={`sticky top-16 z-20 transition-all duration-300 ${isScrolled ? 'bg-gray-900/90 backdrop-blur-md py-3 shadow-lg' : 'pt-4'}`}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex space-x-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        activeCategory === category
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {category === 'all' ? 'All Games' : category}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 flex-1 flex flex-col">
          {/* Hero Section */}
          <div className="mb-8 md:mb-12 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 mb-4"
            >
              Game Lobby
            </motion.h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover and compete in our exciting collection of games. Win rewards, challenge friends, and climb the leaderboards!
            </p>
          </div>

          {/* Featured Games Carousel */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <FaFire className="text-orange-400 mr-2" />
                Featured Games
              </h2>
              <button className="flex items-center text-purple-300 hover:text-white transition-colors">
                View All <FaArrowRight className="ml-1 text-sm" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
              <AnimatePresence>
                {featuredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                  >
                    <GameCard game={game} featured />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* All Games Section */}
          <section>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-2xl font-bold mb-4 md:mb-0">All Games</h2>
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
                <span className="text-sm text-gray-400 px-3">Sort by:</span>
                <select className="bg-transparent border-0 text-sm focus:ring-2 focus:ring-purple-500 rounded-lg px-3 py-2 focus:outline-none">
                  <option>Popularity</option>
                  <option>Newest</option>
                  <option>Alphabetical</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>
            
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 px-2 sm:px-0">
                <AnimatePresence>
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                      className="w-full"
                    >
                      <GameCard game={game} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                  <FaGamepad className="text-2xl text-purple-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No games found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  We couldn't find any games matching your search. Try a different category or search term.
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