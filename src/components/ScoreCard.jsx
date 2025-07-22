//import React from "react";
import { useNavigate } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";
import { FaTrophy } from "react-icons/fa";
import React, { useEffect } from "react";
import confetti from 'canvas-confetti';
import { MdOutlineReplay } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";

const ScoreCard = ({ game, userId, score, roomId, gameName }) => {
  const navigate = useNavigate();

   
  useEffect(() => {
     const celibrate = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0', '#f00', '#0f0', '#00f', '#ff00', '#f0f']
      });
    }
    celibrate(); // Call the confetti function
    window.dispatchEvent(new CustomEvent("play-sound", { detail: "win" })); // ✅ Play win sound on mount
   
  }, []);
//sound effect added for win..

  return (
   <div className="w-screen h-screen blur-0 text-yellow-400 bg-blueGradient flex items-center justify-center">
  <div className="w-full max-w-sm bg-transparent backdrop-blur-md rounded-2xl shadow-xl p-6 relative border-2 shadow-gray-400 border-yellow-500">
        
        {/* Cancel Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 text-xl transition-all"
          title="Back to Lobby"
        >
          <ImCancelCircle />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold">Your Score</h2>
        </div>

        {/* Score Display */}
        <div className="bg-yellow-100 text-yellow-800 rounded-xl py-2 flex  justify-between items-center mb-6 text-center shadow-inner">
          <div className="flex justify-center items-center mb-2 text-4xl pl-1 font-bold">
            <FaTrophy className="mr-4 " /> {score}
          </div>
          
          <p className="text-sm flex items-bottom text-gray-800 mt-4 p-1">Your Score in{gameName}</p>
          
        </div>

        {/* Details Section */}
      
        {/* Actions */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <button
            onClick={() => navigate( `/tournament-lobby/${game}`)}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2"
          >
            <MdOutlineReplay  className="text-xl font-semibold" /> Play Again
          </button>
          <button
            onClick={() => navigate("/tournaments")}
            className="w-full bg-white text-yellow-500 hover:bg-gray-100 font-semibold py-2 px-6 rounded-xl transition-all duration-200 border border-blue-300 flex items-center justify-center gap-2"
          >
            <IoHomeOutline className="text-xl font-semibold" /> Back to Tournament
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
