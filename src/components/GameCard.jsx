import React from 'react';
import { FaUsers } from 'react-icons/fa';
import Button from './Button';

const GameCard = ({ game, size = 'md', onPlayNow }) => {
  const isSmall = size === 'sm';

  return (
    <div className={`group ${isSmall ? '' : 'w-full'}`}>
      <div
        className={`relative rounded-xl overflow-hidden mb-2 ${isSmall
            ? 'aspect-[3/4]'
            : 'aspect-[3/4] md:aspect-video'
          }`}
      >
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 rounded-xl">
          <button
            className={`w-full text-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold ${isSmall ? 'text-xs py-1' : 'text-sm py-2'} rounded-full shadow-lg transition-transform duration-200 hover:scale-105`}
            onClick={onPlayNow}
          >
            Play Now
          </button>
        </div>

        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full text-xs flex items-center">
          <FaUsers className="mr-1" />
          {game.players}
        </div>
      </div>
      <div>
        <h3 className={`font-medium ${isSmall ? 'text-sm' : 'text-base'} truncate`}>
          {game.title}
        </h3>
        <span className="text-xs text-gray-400">{game.category}</span>
      </div>
    </div>
  );
};

export default GameCard;

