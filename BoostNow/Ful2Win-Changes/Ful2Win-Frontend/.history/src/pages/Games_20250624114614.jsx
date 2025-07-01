import React, { useState } from 'react';
import { FaSearch, FaFire } from 'react-icons/fa';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import BackgroundBubbles from '../components/BackgroundBubbles';
import { GravityHop } from '../components/GravityHop';

// Game images
import callBreak from '../assets/call-break.png';
import rummy from '../assets/rummy.png';
import mazeRunner from '../assets/maze-runner.png';
import poker from '../assets/poker.png';
import ludo from '../assets/ludo.png';

// Game data
const games = [
  { id: 1, title: 'Call Break', category: 'Card', players: '10K+', image: callBreak, featured: true },
  { id: 2, title: 'Rummy', category: 'Card', players: '25K+', image: rummy, featured: true },
  { id: 3, title: 'Maze Runner', category: 'Puzzle', players: '8K+', image: mazeRunner, featured: true },
  { id: 4, title: 'Poker', category: 'Card', players: '15K+', image: poker, featured: false },
  { id: 5, title: 'Ludo', category: 'Board', players: '30K+', image: ludo, featured: true },
  { id: 6, title: 'Gravity Hop', category: 'Puzzle', players: '5K+', image: <GravityHop />, featured: false },
];

const Games = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['all', 'Card', 'Puzzle', 'Board'];

  const filteredGames = games.filter((game) => {
    const matchesCategory = activeCategory === 'all' || game.category === activeCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-blueGradient">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />
        <div className="pt-16 md:pt-0">
          <div className="container mx-auto px-4 py-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-neonBlueGradient bg-clip-text text-transparent">
                  Popular Games
                </h1>
                <p className="text-gray-200 mt-1">Discover and compete in your favorite games</p>
              </div>
              <div className="mt-4 md:mt-0 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="bg-white/10 border border-white/20 rounded-full pl-10 pr-4 py-2 w-full md:w-64 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      activeCategory === category
                        ? 'bg-active text-black'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Games */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaFire className="text-orange-400 mr-2" />
                  Featured Games
                </h2>
                <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {filteredGames
                  .filter((game) => game.featured)
                  .map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
              </div>
            </div>

            {/* All Games */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">All Games</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Sort by:</span>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option>Popularity</option>
                    <option>Newest</option>
                    <option>Alphabetical</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Games;
