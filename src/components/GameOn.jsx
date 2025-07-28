import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ScoreCard from "./ScoreCard";
import api from "../services/api";

const GameOn = () => {
  const { gameId, tournamentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // ✅ Check if user came from authorized route (tournament lobby)
  useEffect(() => {
    const checkAuthorization = () => {
      // Check if user came from tournament lobby with proper state
      const fromTournamentLobby = location.state?.fromTournamentLobby;
      const sessionKey = `tournament_${tournamentId}_authorized`;
      const isSessionValid = sessionStorage.getItem(sessionKey);
      
      // Allow access if:
      // 1. Coming from tournament lobby with state
      // 2. Has valid session storage (for page refresh)
      if (fromTournamentLobby || isSessionValid) {
        setIsAuthorized(true);
        // Set session storage for page refresh scenarios
        sessionStorage.setItem(sessionKey, 'true');
      } else {
        // Redirect back to tournament lobby if unauthorized
        console.log('Unauthorized access to game. Redirecting to tournament lobby.');
        navigate(`/tournament/${tournamentId}`, { replace: true });
      }
    };

    checkAuthorization();
  }, [tournamentId, location.state, navigate]);

  // ✅ Clear session on component unmount (when leaving game)
  useEffect(() => {
    return () => {
      const sessionKey = `tournament_${tournamentId}_authorized`;
      sessionStorage.removeItem(sessionKey);
    };
  }, [tournamentId]);

  // ✅ Prevent browser back button from staying on game page
  useEffect(() => {
    const handlePopState = (event) => {
      // Clear authorization and redirect to tournament lobby
      const sessionKey = `tournament_${tournamentId}_authorized`;
      sessionStorage.removeItem(sessionKey);
      navigate(`/tournament/${tournamentId}`, { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [tournamentId, navigate]);

  // ✅ Fetch Game Details by ID (only if authorized)
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchGameById = async () => {
      try {
        const response = await api.get('/games');
        const allGames = response.data?.data || [];
        const foundGame = allGames.find((g) => g._id === gameId);

        if (foundGame) {
          setGame(foundGame);
        } else {
          setError("Game not found");
        }
      } catch (err) {
        setError("Failed to load game data");
        console.error(err);
      }
    };

    if (gameId) {
      fetchGameById();
    } else {
      setError("Invalid game ID");
    }
  }, [gameId, isAuthorized]);

  const getUserInfo = async() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return {
        userId: user?._id,
        userName: user?.username,
      };
    } catch (e) {
      return { userId: null, userName: null };
    }
  };

  // ✅ Handle GAME_OVER event from the iframe (only if authorized)
  useEffect(() => {
    if (!isAuthorized) return;

    const handleMessage = async (event) => {
      const { type, score } = event.data;
      if (type === "GAME_OVER") {
        const { userId, userName } = await getUserInfo();
        try {
          const scorePayload = {
            userId,
            userName,
            score,
            roomId: tournamentId,
            gameName: game?.name || "Game",
            gameId: game?._id || gameId
          };
          
          console.log('Submitting score with payload:', scorePayload);
          
          try {
            const requestData = {
              userId,
              userName,
              score,
              roomId: tournamentId,
              gameName: game?.name || "Game",
              gameId: game?._id || gameId
            };
            
            console.log('Sending request with data:', JSON.stringify(requestData, null, 2));
            
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/score/submit-score`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
              },
              body: JSON.stringify(requestData)
            });

            const responseData = await response.json();
            
            if (!response.ok) {
              throw new Error(responseData.message || 'Failed to submit score');
            }
            setScoreData({
              userId,
              userName,
              score,
              game: game?._id || gameId,
              roomId: tournamentId,
              gameName: game?.displayName || game?.name || 'Game',
              gameImg: game.assets?.thumbnail || ''
            });
  
            setGameOver(true);
            console.log('Score submitted successfully:', responseData);
            return responseData;
            
          } catch (error) {
            console.error('Error in score submission:', {
              message: error.message,
              stack: error.stack,
              response: error.response?.data || 'No response data'
            });
            throw error;
          }
        } catch (err) {
          console.error("Score submit failed", err);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [game, tournamentId, isAuthorized]);

  // Show loading while checking authorization
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Checking access...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading game...
      </div>
    );
  }

  const iframeSrc = game.assets?.gameUrl?.baseUrl;

  return gameOver && scoreData ? (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
      <ScoreCard {...scoreData} />
    </div>
  ) : (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <h1 className="text-xl font-bold mb-4">
        {game.displayName || game.name}
      </h1>

      <div className="w-full h-full">
        <iframe
          src={iframeSrc}
          title={game?.displayName || 'Game'}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock allow-orientation-lock"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad; fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => console.log('Iframe loaded successfully')}
          onError={(e) => {
            console.error('Iframe error:', e);
            setError(`Failed to load game. Please check if the game URL is correct.`);
          }}
          loading="eager"
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default GameOn;
