import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ScoreCard from "./ScoreCard"; // Make sure this component exists

const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : (typeof window !== 'undefined' && window._env_ && window._env_.REACT_APP_API_URL)
      ? window._env_.REACT_APP_API_URL
      : "http://localhost:5000";
  
const GameOn = () => {
  const { gameId, tournamentId } = useParams(); // ✅ fetch route params

  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  
  // ✅ Fetch Game Details by ID
  useEffect(() => {
    const fetchGameById = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/games`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
     
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
  }, [gameId]);
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

  // ✅ Handle GAME_OVER event from the iframe
  useEffect(() => {
    const handleMessage = async (event) => {
    
      const { type, score } = event.data;
      if (type === "GAME_OVER") {
        const { userId, userName } = await getUserInfo();
        try {
       

          await axios.post(`${API_URL}/api/score/submit-score`, {
            userId,        
             userName,
            score,
            roomId: tournamentId,
            gameName: game?.name || "Game",
          });

          setScoreData({
            userId,
            userName,
            score,
            game: game?._id || gameId,
            roomId: tournamentId,
            gameName: game?.name,
          });

          setGameOver(true);
        } catch (err) {
          console.error("Score submit failed", err);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [game, tournamentId]);

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
              console.error('Failed to load game from URL:', safeGameUrl);
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
