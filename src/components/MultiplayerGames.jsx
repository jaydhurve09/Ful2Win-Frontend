import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import snakeLadder from '../assets/snake-and-ladder.png';
import bladeRunner from '../assets/blade-runner.png';
import templeRun from '../assets/temple-run.png';

const MultiplayerGames = () => {
  const navigate = useNavigate();
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-pink-200">🎮 Multiplayer Games</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        <div  onClick={() => navigate("/game-lobby")}  className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1">
          <img src={snakeLadder} alt="Snake and Ladder" className="w-full aspect-square object-cover" />
          <div   className="hidden md:block p-3">
            <h3 className="text-lg font-semibold text-pink-200">Snake & Ladder</h3>
            <p className="text-gray-400 mt-1 text-sm">Classic board game with friends</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1">
          <img src={bladeRunner} alt="Blade Runner" className="w-full aspect-square object-cover" />
          <div className="hidden md:block p-4">
            <h3 className="text-xl font-semibold text-pink-200">Blade Runner</h3>
            <p className="text-gray-400 mt-2">Run and slice through obstacles</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1">
          <img src={templeRun} alt="Temple Run" className="w-full aspect-square object-cover" />
          <div className="hidden md:block p-4">
            <h3 className="text-xl font-semibold text-pink-200">Temple Run</h3>
            <p className="text-gray-400 mt-2">Endless running adventure</p>
          </div>
        </div>
      </div>
    </section>
  );

};

export default MultiplayerGames;
