import React, { useEffect, useRef } from "react";
import { useState } from "react";
import api from "../services/api";
import ScoreCard from "../components/ScoreCard";
const scoreData = {
  userId: "12345", // Replace with actual user ID
  score: 0, // This will be updated dynamically
  roomId: "67890", // Replace with actual room ID
  gameName: "color smash", // Replace with actual game name
};

const EggCatcher = () => {
  const [gameOn, setGameOn] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      console.log("hii");
      // ✅ Check origin to prevent security issues
    //  if (event.origin !== "https://colorsmash.vercel.app/") return;

      const { type, score } = event.data;

      if (type === "GAME_OVER") {
        
        // Send the score to the backend using the centralized api instance
        api.post('/score/submit-score', {
          userId: "12345", // Replace with actual user ID
          score: score,
          roomId: "67890", // Replace with actual room ID
          gameName: "egg cacher",
        });
          
        setGameOn(true);
        console.log(gameOn)
        scoreData.score = score; // Update the score data
         console.log("🎯 Final Score from Game:", score);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    gameOn ? (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ScoreCard
          userId={scoreData.userId}
          score={scoreData.score}
          roomId={scoreData.roomId}
          gameName={scoreData.gameName}
        />
      </div>
    ) : (
      <div>
        <h2>Play Game</h2>
        <iframe
          src="https://egg-cacher.vercel.app/"
          title="Game"
          width="100%"
          height="100%"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            border: "none",
            margin: 0,
            padding: 0,
            zIndex: 9999,
          }}
        />
      </div>
    )
  );
};

export default EggCatcher;