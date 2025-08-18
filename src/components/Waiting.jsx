import React ,{ useEffect, useContext }from 'react'
import { useNavigate } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";
import { FaTrophy } from "react-icons/fa";
import confetti from 'canvas-confetti';
import { MdOutlineReplay } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import logo from '../assets/logo.jpg' 
import { Ful2WinContext } from '../context/ful2winContext';

const Waiting = (gameId) => {
  const navigate = useNavigate();
  
  const {games, allUsers } = useContext(Ful2WinContext);
 const game = games.find(g => g._id === gameId) || {};
 const user = JSON.parse(localStorage.getItem("user"))._id || {};
console.log("Game data:", games);


  return (
    <div>
    <div    className="w-screen h-screen blur-none text-yellow-400 bg-blueGradient flex items-center justify-center">
  <motion.div initial={{ scale: 0 }} delay={1.6} animate={{ scale: 1 }} className="w-full max-w-sm bg-gray-900 rounded-2xl shadow-md p-6 relative border-2 shadow-gray-400 border-yellow-500 m-3">
        
        {/* Cancel Button */}
        <button
         // onClick={() => navigate( `/classic-lobby/${scoreData.result.gameId}`)}
          className="absolute top-4 right-4  text-white hover:text-yellow-300 text-xl transition-all"
          title="Back to Lobby"
        >
          <ImCancelCircle />
        </button>

        {/* Header */}
        <div className="text-center flex flex-row items-center mb-6">
          <img className="w-16 h-16 rounded-full m-4" src={game?.assets?.thumbnail} alt={game?.name} /> <h2 className="text-2xl font-extrabold capitalize">{game?.name || 'unknown game'}</h2>
        </div>
      


      <div>

     <p className='text-yellow-400 text-3xl'>Waiting For Opponent...</p>
      </div>
        
      
        {/* Score Display */}
        {/* <div className=" text-yellow-800 rounded-xl py-2 flex  justify-center items-center mb-6 text-center shadow-inner">
          <div className="flex justify-center gap-3 items-center mb-2 text-3xl pl-1 font-bold">
           <h2 className="text-yellow-400">Winner Is:</h2> <p className="capitalize text-2xl font-bold text-white">{winner}</p>
          </div>
          
         
          
        </div>
       <div className='flex flex-row gap-4'> <p className=" text-2xl text-yellow-400">Your Score:</p>
        <p className="text-2xl font-bold text-white">{MyScore}</p></div>
        <hr className='border-yellow-500' />
       <div className='flex flex-row gap-4'> <p className="text-2xl text-yellow-400">Opponent's Score:</p>
        <p className="text-2xl font-bold text-white">{opponentScore}</p></div> */}
        {/* Details Section */}
      
        {/* Actions */}
        {/* <div className="mt-6 flex flex-row items-center justify-evenly gap-4">
          <button
            onClick={() => navigate( `/classic-lobby/${scoreData.result.gameId}`)}
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
        </div> */}
      </motion.div>
    </div>

    </div>
  )
}

export default Waiting;
