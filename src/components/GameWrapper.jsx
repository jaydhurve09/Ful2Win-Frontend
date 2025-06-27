import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaSpinner, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import GameLobby from './GameLobby';
import TournamentLobby from './TournamentLobby';
import gameService from '../services/gameService';
import tournamentService from '../services/tournamentService';
import authService from '../services/authService';

const GameWrapper = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Game state
  const [game, setGame] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showTournamentLobby, setShowTournamentLobby] = useState(false);

  // Fetch game data from the database
  const fetchGame = async () => {
    try {
      console.log('Fetching game with ID:', gameId);
      setLoading(true);
      setError(null);
      
      if (!gameId) {
        throw new Error('No game ID provided');
      }

      // Check if we're showing tournament lobby from URL
      const isTournamentLobby = location.pathname.includes('/tournaments');
      setShowTournamentLobby(isTournamentLobby);

      // Fetch game data and tournaments in parallel
      const [gameData, tournamentsData] = await Promise.all([
        gameService.getGameById(gameId),
        tournamentService.getTournamentsByGame(gameId)
      ]);
      
      if (!gameData) {
        throw new Error('Game not found');
      }
      
      // Format game data for the GameLobby component
      const formattedGame = {
        ...gameData,
        gameImage: gameData.thumbnail || 'https://via.placeholder.com/400',
        gameCategory: gameData.category || 'Game',
        playersCount: gameData.playersCount || '0 playing',
        entryFees: {
          classic: gameData.entryFee ? `₹${gameData.entryFee}` : 'Free',
          tournament: gameData.tournamentFee ? `₹${gameData.tournamentFee}` : 'Free',
          private: 'Custom'
        },
        rules: gameData.rules || 'Enjoy the game!',
        minPlayers: gameData.minPlayers || 1,
        maxPlayers: gameData.maxPlayers || 4,
        hasTournaments: tournamentsData.length > 0
      };

      // Categorize tournaments
      const cashTournaments = [];
      const coinTournaments = [];
      
      tournamentsData.forEach(tournament => {
        if (tournament.entryFee.currency === 'INR') {
          cashTournaments.push(tournament);
        } else if (tournament.entryFee.currency === 'COINS') {
          coinTournaments.push(tournament);
        }
      });

      // Fetch wallet balance
      try {
        const balance = await authService.getWalletBalance();
        setWalletBalance(balance.balance || 0);
      } catch (walletError) {
        console.error('Error fetching wallet balance:', walletError);
        setWalletBalance(0);
      }
      
      setGame(formattedGame);
      setTournaments({
        cash: cashTournaments,
        coins: coinTournaments
      });
    } catch (err) {
      console.error('Error fetching game data:', err);
      setError(err.message || 'Failed to load game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch game on component mount
  useEffect(() => {
    fetchGame();
  }, [gameId]);

  // Handle game start from GameLobby
  const handleGameStart = async (mode, entryFee) => {
    try {
      setLoading(true);
      console.log(`Starting ${mode} game with entry fee:`, entryFee);
      
      // Start game session
      const gameSession = await gameService.startGame(gameId, { mode, entryFee });
      
      // Navigate to game play screen
      navigate(`/games/${gameId}/play`, { 
        state: { 
          gameSession,
          mode,
          entryFee
        }
      });
    } catch (error) {
      console.error('Error starting game:', error);
      setError(error.message || 'Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle tournament join
  const handleJoinTournament = async (tournamentId) => {
    try {
      setLoading(true);
      console.log('Joining tournament:', tournamentId);
      
      // Join tournament logic would go here
      // For now, just show tournament lobby
      navigate(`/games/${gameId}/tournaments`);
    } catch (error) {
      console.error('Error joining tournament:', error);
      setError(error.message || 'Failed to join tournament. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle exit game
  const handleExitGame = () => {
    navigate('/games');
  };
  
  // Handle back to lobby from tournament view
  const handleBackToLobby = () => {
    setShowTournamentLobby(false);
    navigate(`/games/${gameId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">
            <FaExclamationTriangle className="inline-block" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Game</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/games')}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main content - Show GameLobby or TournamentLobby
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {game && (
        <>
          {showTournamentLobby ? (
            <TournamentLobby 
              gameId={gameId}
              gameName={game.name}
              onBack={handleBackToLobby}
              onJoinTournament={handleJoinTournament}
            />
          ) : (
            <GameLobby 
              gameTitle={game.name}
              gameImage={game.gameImage}
              gameCategory={game.gameCategory}
              rating={game.rating}
              playersCount={game.playersCount}
              entryFees={game.entryFees}
              walletBalance={walletBalance}
              onClose={handleExitGame}
              onJoinGame={handleGameStart}
              onJoinTournament={() => navigate(`/games/${gameId}/tournaments`)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GameWrapper;
