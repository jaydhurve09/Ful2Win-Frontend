import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrophy, FaCoins, FaArrowLeft } from 'react-icons/fa';

const GamePlay = ({ game, mode, tournament, onExit }) => {
  const { gameId } = useParams();
  const gameContainerRef = useRef(null);

  // Initialize the game based on gameId
  useEffect(() => {
    if (!gameContainerRef.current) return;

    // This is where you would initialize your actual game
    // For now, we'll just show a placeholder
    const container = gameContainerRef.current;
    container.innerHTML = `
      <div class="bg-gray-100 rounded-lg p-8 text-center">
        <h2 class="text-2xl font-bold mb-4">Playing: ${game?.name || 'Game'}</h2>
        <p class="mb-4">Mode: ${mode}</p>
        ${
          tournament 
            ? `<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 text-left">
                 <div class="flex items-center">
                   <FaTrophy class="text-yellow-500 mr-2" />
                   <p class="font-bold">Tournament: ${tournament.name}</p>
                 </div>
                 <p class="text-sm mt-1">Prize Pool: ${tournament.prizePool} ${tournament.tournamentType === 'cash' ? '₹' : 'Coins'}</p>
               </div>`
            : ''
        }
        <div class="bg-white p-6 rounded-lg shadow-inner border-2 border-dashed border-gray-300">
          <p class="text-gray-500">Game content will be rendered here</p>
          <p class="text-sm text-gray-400 mt-2">Game ID: ${gameId}</p>
        </div>
      </div>
    `;
  }, [game, gameId, mode, tournament]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onExit}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <FaArrowLeft className="mr-2" /> Exit Game
          </button>
          
          {tournament && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 flex items-center">
              <FaTrophy className="text-yellow-500 mr-2" />
              <span className="font-medium">Tournament Mode</span>
              {tournament.entryFee > 0 && (
                <span className="ml-3 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <FaCoins className="mr-1" />
                  Entry: {tournament.entryFee} {tournament.tournamentType === 'cash' ? '₹' : 'Coins'}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div ref={gameContainerRef} className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Game will be rendered here */}
          <div className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Loading game...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
