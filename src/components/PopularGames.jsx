import React from 'react';
import poker from '../assets/poker.png';
import ludo from '../assets/ludo.png';
import carrom from '../assets/carrom.png';

const PopularGames = () => {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-pink-200">⭐ Popular Games</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        <div className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1">
          <img src={poker} alt="Poker" className="w-full aspect-square object-cover" />
          <div className="hidden md:block p-3">
            <h3 className="text-lg font-semibold text-pink-200">Poker</h3>
            <p className="text-gray-400 mt-1 text-sm">Test your poker face</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1">
          <img src={ludo} alt="Ludo" className="w-full aspect-square object-cover" />
          <div className="hidden md:block p-4">
            <h3 className="text-xl font-semibold text-pink-200">Ludo</h3>
            <p className="text-gray-400 mt-2">Family favorite board game</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1">
          <img src={carrom} alt="Carrom" className="w-full aspect-square object-cover" />
          <div className="hidden md:block p-4">
            <h3 className="text-xl font-semibold text-pink-200">Carrom</h3>
            <p className="text-gray-400 mt-2">Strike and pocket with precision</p>
          </div>
        </div>
      </div>
    </section>
  );

};

export default PopularGames;
