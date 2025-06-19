import React from 'react';
import callBreak from '../assets/call-break.png';
import rummy from '../assets/rummy.png';
import mazeRunner from '../assets/maze-runner.png';
import poker from '../assets/poker.png';
import ludo from '../assets/ludo.png';

const TrendingGames = () => {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-pink-200">🔥 Trending Games</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        <div className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1">
          <img src={callBreak} alt="Call Break" className="w-full aspect-square object-cover" />
          <div className="hidden md:block p-3">
            <h3 className="text-lg font-semibold text-pink-200">Call Break</h3>
            <p className="text-gray-400 mt-1 text-sm">Play the classic card game with friends</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1">
          <img src={rummy} alt="Rummy" className="w-full aspect-square object-cover" />
          <div className="hidden md:block p-4">
            <h3 className="text-xl font-semibold text-pink-200">Rummy</h3>
            <p className="text-gray-400 mt-2">Master the art of card sequences</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1">
          <img src={mazeRunner} alt="Maze Runner" className="w-full aspect-square object-cover" />
          <div className="hidden md:block p-4">
            <h3 className="text-xl font-semibold text-pink-200">Maze Runner</h3>
            <p className="text-gray-400 mt-2">Navigate through challenging mazes</p>
          </div>
        </div>
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
      </div>
    </section>
  );

};

export default TrendingGames;
