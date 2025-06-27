import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import GameLobby from './game/GameLobby';
import TournamentLobby from './game/TournamentLobby';
import GamePlay from './game/GamePlay';

// Game flow states
const GAME_FLOW = {
  LOADING: 'LOADING',
  GAME_LOBBY: 'GAME_LOBBY',
  TOURNAMENT_LOBBY: 'TOURNAMENT_LOBBY',
  PLAYING: 'PLAYING'
};

const GameWrapper = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  // Game state
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameFlow, setGameFlow] = useState(GAME_FLOW.LOADING);
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Fetch game data
  const fetchGame = async () => {
    try {
      setLoading(true);
      
      // Mock game data - replace with actual API call
      const mockGame = {
        _id: gameId,
        name: 'Sample Game',
        description: 'This is a sample game',
        modesAvailable: ['Classic', 'Tournament', 'Private'],
        thumbnail: 'https://via.placeholder.com/150',
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGame(mockGame);
      setError(null);
      setGameFlow(GAME_FLOW.GAME_LOBBY);
    } catch (err) {
      console.error('Error fetching game:', err);
      setError('Failed to load game. Please try again.');
      setGameFlow(GAME_FLOW.GAME_LOBBY);
    } finally {
      setLoading(false);
    }
  };

  // Fetch game on component mount
  useEffect(() => {
    fetchGame();
  }, [gameId]);

  // Handle mode selection from GameLobby
  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    if (mode === 'Tournament') {
      setGameFlow(GAME_FLOW.TOURNAMENT_LOBBY);
    } else {
      setGameFlow(GAME_FLOW.PLAYING);
    }
  };

  // Handle tournament selection from TournamentLobby
  const handleTournamentSelect = (tournament) => {
    setSelectedTournament(tournament);
    setGameFlow(GAME_FLOW.PLAYING);
  };

  // Handle exit from game
  const handleExitGame = () => {
    setSelectedMode('');
    setSelectedTournament(null);
    setGameFlow(GAME_FLOW.GAME_LOBBY);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Game</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render the appropriate screen based on game flow
  return (
    <div className="min-h-screen bg-gray-50">
      {gameFlow === GAME_FLOW.GAME_LOBBY && (
        <GameLobby 
          game={game} 
          onSelectMode={handleModeSelect} 
        />
      )}
      
      {gameFlow === GAME_FLOW.TOURNAMENT_LOBBY && (
        <TournamentLobby 
          game={game} 
          onSelectTournament={handleTournamentSelect} 
        />
      )}
      
      {gameFlow === GAME_FLOW.PLAYING && (
        <GamePlay 
          game={game} 
          mode={selectedMode} 
          tournament={selectedTournament}
          onExit={handleExitGame}
        />
      )}
    </div>
  );
};

export default GameWrapper;
