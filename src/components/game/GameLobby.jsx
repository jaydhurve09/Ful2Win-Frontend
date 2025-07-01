import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaGamepad, FaTrophy, FaUsers, FaArrowRight, FaChevronLeft } from 'react-icons/fa';

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
    // Call the parent's onSelectMode which will handle the game flow
    if (onSelectMode) {
      onSelectMode(mode);
    } else {
      // Default behavior if no handler is provided
      console.log(`Selected mode: ${mode}`);
      // You can add default navigation or state update here if needed
    }
  };
  
  const handleExit = () => {
    navigate('/games');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={handleExit}
            className="flex items-center text-white hover:text-blue-300 transition-colors mr-4"
          >
            <FaChevronLeft className="mr-1" />
            <span>Back to Games</span>
          </button>
        </div>
        
        {/* Game info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl mb-8">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-white mb-2">{game?.name || 'Game Lobby'}</h1>
            <p className="text-gray-300 mb-2">{game?.description || 'Select a game mode to continue'}</p>
            <div className="flex items-center text-sm text-gray-400">
              <span className="mr-4">Players: {game?.minPlayers || 1}-{game?.maxPlayers || 4}</span>
              <span>Type: {game?.type || 'Multiplayer'}</span>
            </div>
          </div>
        </div>
        
        {/* Game modes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <div 
              key={mode}
              onClick={() => handleModeSelect(mode)}
              className={`relative group p-6 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden
                ${
                  selectedMode === mode 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 scale-[1.02] shadow-lg' 
                    : 'bg-white/5 hover:bg-white/10 hover:scale-[1.02] backdrop-blur-sm'
                }`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${
                    mode === 'Tournament' 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : mode === 'Private' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {mode === 'Tournament' ? (
                      <FaTrophy className="text-xl" />
                    ) : mode === 'Private' ? (
                      <FaUsers className="text-xl" />
                    ) : (
                      <FaGamepad className="text-xl" />
                    )}
                  </div>
                  <FaArrowRight className={`text-gray-400 group-hover:text-white transition-colors ${
                    selectedMode === mode ? 'text-white' : ''
                  }`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  selectedMode === mode ? 'text-white' : 'text-white'
                }`}>
                  {mode} Mode
                </h3>
                <p className={`text-sm ${
                  selectedMode === mode ? 'text-white/90' : 'text-gray-300'
                }`}>
                  {mode === 'Tournament' 
                    ? 'Compete in tournaments and win prizes!'
                    : mode === 'Private' 
                      ? 'Play with friends in a private room'
                      : 'Play the classic version of the game'}
                </p>
              </div>
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
        
        {/* Game rules */}
        {game?.rules && (
          <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">How to Play</h3>
            <p className="text-gray-300 text-sm">{game.rules}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameLobby;
