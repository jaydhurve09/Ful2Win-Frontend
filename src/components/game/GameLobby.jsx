import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaGamepad, FaTrophy, FaUsers, FaArrowRight } from 'react-icons/fa';

const GameLobby = ({ game, onSelectMode }) => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [selectedMode, setSelectedMode] = useState(null);

  // Default modes if not provided in game object
  const modes = game?.modesAvailable?.length > 0 
    ? game.modesAvailable 
    : ['Classic', 'Tournament', 'Private'];

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    
    // If tournament mode, navigate to tournament lobby
    if (mode.toLowerCase() === 'tournament') {
      navigate(`/games/${gameId}/tournaments`);
    } else {
      // For other modes, proceed directly to game with mode
      onSelectMode(mode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{game?.name || 'Game Lobby'}</h1>
          <p className="text-gray-600 mb-8">Select a game mode to continue</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modes.map((mode) => (
              <div 
                key={mode}
                onClick={() => handleModeSelect(mode)}
                className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedMode === mode ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    {mode === 'Tournament' ? (
                      <FaTrophy className="text-yellow-500 text-xl" />
                    ) : mode === 'Private' ? (
                      <FaUsers className="text-green-500 text-xl" />
                    ) : (
                      <FaGamepad className="text-purple-500 text-xl" />
                    )}
                  </div>
                  <FaArrowRight className="text-gray-400 group-hover:text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {mode} Mode
                </h3>
                <p className="text-gray-600 text-sm">
                  {mode === 'Tournament' 
                    ? 'Compete in tournaments and win prizes!'
                    : mode === 'Private' 
                      ? 'Play with friends in a private room'
                      : 'Play the classic version of the game'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
