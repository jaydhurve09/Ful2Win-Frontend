import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ScoreCard from "./ScoreCard"; // Make sure this component exists
import api from "../services/api";

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
        const response = await api.get('/api/games');
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
       

          const scorePayload = {
            userId,
            userName,
            score,
            roomId: tournamentId,
            gameName: game?.name || "Game",
            gameId: game?._id || gameId
          };
          
          console.log('Submitting score with payload:', scorePayload);
          
          await fetch('/api/score/submit-score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              userName,
              score,
              roomId: tournamentId,
              gameName: game?.name || "Game",
            }),
          });
         
        
          
          console.log('Score submission response:', response.data);

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
