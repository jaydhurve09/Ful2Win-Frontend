import React, { useEffect, useRef } from "react";
import axios from "axios";
import ScoreCard from "./ScoreCard.jsx";
const scoreData = {
  userId: "12345", // Replace with actual user ID
  score: 0, // This will be updated dynamically
  roomId: "67890", // Replace with actual room ID
  gameName: "Color Smash", // Replace with actual game name
};

const ColorSmash = () => {
  const [gameOn, setGameOn] = React.useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      // ✅ Check origin to prevent security issues
     // if (event.origin !== "http://localhost:4000") return;

      const { type, score } = event.data;

      if (type === "GAME_OVER") {
        console.log("🎯 Final Score from Game:", score);
        // Send the score to the backend
       // axios
       //   .post("http://localhost:5000/score/submit-score", {
        //    userId: "12345", // Replace with actual user ID
        //    score: score,
         //   roomId: "67890", // Replace with actual room ID
          //  gameName: "Flappy Bird",
         // });
          
        setGameOn(true);
        scoreData.score = score; // Update the score data
        
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
          src="https://colorsmash.vercel.app/"
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

export default  ColorSmash;