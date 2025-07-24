//import React from "react";
import { useNavigate } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";
import { FaTrophy } from "react-icons/fa";
import React, { useEffect } from "react";
import confetti from 'canvas-confetti';
import { MdOutlineReplay } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import logo from '../assets/logo.jpg' // Default image if gameImg is not provided
const ScoreCard = ({ game, userId, score, roomId, gameName, gameImg }) => {
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
   <div    className="w-screen h-screen blur-none text-yellow-400 bg-black flex items-center justify-center">
  <motion.div initial={{ scale: 0 }} delay={1.6} animate={{ scale: 1 }} className="w-full max-w-sm bg-gray-900 rounded-2xl shadow-md p-6 relative border-2 shadow-gray-400 border-yellow-500 m-3">
        
        {/* Cancel Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4  text-white hover:text-yellow-300 text-xl transition-all"
          title="Back to Lobby"
        >
          <ImCancelCircle />
        </button>

        {/* Header */}
        <div className="text-center flex flex-row items-center mb-6">
          <img className="w-16 h-16 rounded-full m-4" src={gameImg||logo} alt={gameName} /> <h2 className="text-2xl font-extrabold">{gameName || 'Unknown Game'}</h2>
        </div>
      
        
      
        {/* Score Display */}
        <div className=" text-yellow-800 rounded-xl py-2 flex  justify-center items-center mb-6 text-center shadow-inner">
          <div className="flex justify-center gap-3 items-center mb-2 text-4xl pl-1 font-bold">
           <h2 className="text-yellow-400">My Score:</h2> <p className="text-4xl font-bold text-white"> 50{score}</p>
          </div>
          
         
          
        </div>

        {/* Details Section */}
      
        {/* Actions */}
        <div className="mt-6 flex flex-row items-center justify-evenly gap-4">
          <button
            onClick={() => navigate( `/tournament-lobby/${game}`)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-yellow-500 text-white text-bold font-bold py-2 px-6 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate("/tournaments")}
            className="w-full bg-gray-500 text-white hover:bg-gray-100  font-semibold p-2 py-2 px-6 rounded-xl transition-all duration-200 border border-blue-300 flex items-center justify-center gap-2"
          >
            Tournaments
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScoreCard;
