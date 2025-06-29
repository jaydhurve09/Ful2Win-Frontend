import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const GamePlayer = ({
  gameId,
  tournamentId = null,
  mode = 'practice', // 'practice' or 'tournament'
  onComplete = () => {},
}) => {
  const [game, setGame] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch game data
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/games/${gameId}`);
        if (response.data.success) {
          setGame(response.data.game);
        } else {
          throw new Error(response.data.message || 'Failed to load game');
        }
      } catch (err) {
        console.error('Error loading game:', err);
        setError(err.response?.data?.message || 'Failed to load game');
        toast.error('Failed to load game. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  // Handle game completion and score submission
  useEffect(() => {
    const handleMessage = async (event) => {
      // Validate the message is from our game and contains score
      if (event.data?.type === 'GAME_COMPLETE' && event.data.score !== undefined) {
        const finalScore = Number(event.data.score) || 0;
        setScore(finalScore);

        try {
          // Prepare score payload
          const payload = {
            userId: user._id,
            username: user.username,
            gameId,
            gameName: game?.name || '',
            score: finalScore,
            mode,
            tournamentId: mode === 'tournament' ? tournamentId : null,
          };

          // Submit score to backend
          const response = await api.post('/scores', payload);
          
          if (response.data.success) {
            toast.success('Score submitted successfully!');
            onComplete(response.data);
          } else {
            throw new Error(response.data.message || 'Failed to submit score');
          }
        } catch (err) {
          console.error('Error submitting score:', err);
          toast.error(err.response?.data?.message || 'Failed to submit score');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [game, gameId, mode, tournamentId, user, onComplete]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle error state
  if (error || !game) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-lg font-medium mb-4">
          {error || 'Game not found'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Construct the game URL with query parameters
  const gameParams = new URLSearchParams({
    playerId: user._id,
    username: user.username,
    mode,
    ...(tournamentId && { tournamentId }),
  });

  const gameUrl = `${game.baseUrl}${game.iframePath}?${gameParams.toString()}`;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Game Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
          <h1 className="text-2xl font-bold">{game.name}</h1>
          <p className="text-blue-100">
            {mode === 'tournament' ? 'Tournament Mode' : 'Practice Mode'}
            {tournamentId && ` • Tournament #${tournamentId}`}
          </p>
        </div>

        {/* Game Container */}
        <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 aspect ratio */}
          <iframe
            title={game.name}
            src={gameUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Score Display */}
        {score !== null && (
          <div className="bg-gray-50 p-4 border-t">
            <div className="text-center">
              <p className="text-gray-600">Your Score:</p>
              <p className="text-3xl font-bold text-blue-600">{score}</p>
              <p className="text-sm text-gray-500 mt-2">
                {mode === 'tournament' 
                  ? 'Your score has been recorded for this tournament!'
                  : 'Practice score saved to your profile.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Game Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Back to {mode === 'tournament' ? 'Tournament' : 'Games'}
        </button>
        
        {score !== null && (
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

export default GamePlayer;
