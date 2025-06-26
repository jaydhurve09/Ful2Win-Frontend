import React from 'react';
import { FaUsers, FaStar, FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';

const GameCard = ({ game, featured = false, size = 'md' }) => {
  const isSmall = size === 'sm';
  const rating = game.rating || 4.0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-400" />);
    }
    return stars;
  };

  return (
    <div className="group w-full h-full flex flex-col">
      <div
        className={`relative rounded-xl overflow-hidden flex-1 ${
          isSmall ? 'aspect-square' : 'aspect-[3/4] md:aspect-[4/5]'
        }`}
      >
        {/* Game Image */}
        <div className="relative w-full h-full">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <FaFire className="mr-1" />
              Featured
            </div>
          )}
          
          {/* Player Count */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs flex items-center">
            <FaUsers className="mr-1 text-blue-300" />
            <span>{game.players}</span>
          </div>
          
          {/* Game Tags */}
          {game.tags && (
            <div className="absolute bottom-16 left-0 right-0 px-3 flex flex-wrap gap-2">
              {game.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Play Button */}
          <motion.div 
            className="absolute bottom-3 left-3 right-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100">
              Play Now
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Game Info */}
      <div className="px-0 sm:px-1 mt-2">
        <div className="flex justify-between items-start mb-1">
          <h3 className={`font-bold ${isSmall ? 'text-sm' : 'text-base'} text-white truncate`}>
            {game.title}
          </h3>
          <div className="flex items-center bg-white/5 px-2 py-1 rounded-full">
            <FaStar className="text-yellow-400 mr-1 text-xs" />
            <span className="text-xs font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
            {game.category}
          </span>
          <div className="flex -space-x-1">
            {Array(5).fill(null).map((_, i) => (
              <div 
                key={i}
                className={`w-5 h-5 rounded-full border-2 border-gray-800 ${i < 5 - 1 ? 'bg-gray-600' : 'bg-gray-700'} flex items-center justify-center text-xs`}
              >
                {i < 5 - 1 ? '' : '+5'}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center mt-2 text-yellow-400 text-xs">
          {renderStars()}
          <span className="ml-1 text-gray-400">({game.rating?.toFixed(1) || '4.0'})</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;

