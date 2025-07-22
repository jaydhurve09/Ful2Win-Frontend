import React, { useState } from 'react';
import { X, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundBubbles from './BackgroundBubbles';
import { useNavigate } from 'react-router-dom';

const GameLobby = ({
  gameTitle = "Game Title",
  gameImage = "https://via.placeholder.com/400",
  gameCategory = "Game",
  rating = 0,
  playersCount = "0 playing",
  entryFees = {
    classic: "Free",
    quick: "Free",
    tournament: "Free",
    private: "Custom",
  },
  walletBalance = 0,
  onClose,
  onJoinGame,
  onJoinTournament,
  gameId
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isActionGame = gameCategory === "Action";

  const safeEntryFees = {
    classic: entryFees.classic || "₹10 - ₹50",
    tournament: entryFees.tournament || "₹20 - ₹100",
  };
const navigate = useNavigate();
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleGameModeSelect = (mode) => {
    console.log(`Selected game mode: ${mode}`);
    if (mode === 'tournament') {
      navigate(`/tournament-lobby/${gameId}`);
      }
    };
  
  const getEntryFee = (mode) => {
    return entryFees[mode.toLowerCase()] || 'Free';
  };

  const GameModeCard = ({ title, description, entryFee, onClick, comingSoon = false }) => (
    <motion.div
      whileHover={!comingSoon ? { scale: 1.02 } : {}}
      whileTap={!comingSoon ? { scale: 0.98 } : {}}
      className={`relative rounded-xl p-4 border ${
        comingSoon 
          ? 'border-gray-700/50 opacity-60' 
          : 'border-gray-400 hover:border-dullBlue cursor-pointer hover:shadow-lg'
      } bg-b backdrop-blur-sm transition-all`}
      onClick={!comingSoon ? onClick : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-active">{title}</h3>
          <p className="text-sm text-gray-300 mt-1">{description}</p>
        </div>
        {comingSoon ? (
          <div className="w-24 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
            <Clock size={20} className="text-yellow-300 mr-1" />
          </div>
        ) : (
          <button 
            className="w-24 h-12 bg-green-600 hover:bg-green-500 rounded-lg font-medium text-white transition-colors flex flex-col items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <span className="text-xs">Entry</span>
            <span className="text-sm font-semibold">{entryFee}</span>
          </button>
        )}
      </div>
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-yellow-500/80 text-black font-bold py-1 px-3 rounded-full transform rotate-12 text-xs">
            Coming Soon
          </div>
        </div>
      )}
    </motion.div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <style>{`
          @keyframes shine {
            0% { background-position: -100% 0; }
            50% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }

          .flashy-button {
            background: linear-gradient(45deg, #ff00cc, #4158d0);
            background-size: 400% 400%;
            animation: gradient 10s ease infinite;
            position: relative;
            overflow: hidden;
          }

          .flashy-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.2),
              transparent
            );
            animation: shine 2s infinite;
          }

          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
        {/* Background with blur */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
        
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative w-full max-w-2xl bg-darkBlueGradient rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Game Header */}
            <div className="relative h-64 bg-gray-900 sm:h-48">
              <img
                src={gameImage}
                alt={gameTitle}
                className="w-full h-[92%] opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent h-1/2 animate-pulse" />
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
              
              {/* Wallet Balance */}
              {/* <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-white">
                Balance: ₹{walletBalance.toLocaleString()}
              </div> */}
              
              {/* Game Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-end gap-3">
                  <div className="w-16 h-16 rounded-xl bg-white/10 border-2 border-white/20 overflow-hidden">
                    <img
                      src={gameImage}
                      alt={gameTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white shadow-black shadow-2xl capitalize">{gameTitle}</h1>
                    <div className="flex items-center gap-2 text-sm text-white mt-1 shadow-black shadow-2xl">
                      <span>{gameCategory}</span>
                      <span>•</span>
                      <span className="flex items-center shadow-black shadow-2xl">
                        {rating.toFixed(1)} <Star size={14} fill="currentColor" className="ml-0.5 " />
                      </span>
                      <span>•</span>
                      <span>{playersCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="p-4 sm:p-5">
              {/* Game Modes */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-lg font-semibold text-white mb-2 sm:text-xl">Game Modes</h2>
                
                {/* Tournament Card with Glass-Shiny Effect */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative rounded-xl p-4 border border-gray-400/50 hover:border-dullBlue cursor-pointer hover:shadow-lg glass-effect transition-all sm:w-full"
                  style={{
                    '--shine-color': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    '--shine-animation': 'shine 2s infinite'
                  }}
                  onClick={() => handleGameModeSelect('tournament')}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-active">Tournament</h3>
                      <p className="text-sm text-gray-300 mt-1">Compete for big prizes</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-shine" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
                    <button 
                      className="w-24 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg font-medium text-white transition-colors flex flex-col items-center justify-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
                      <span className="text-xs">Entry</span>
                      <span className="text-xs font-semibold">{getEntryFee('tournament')}</span>
                    </button>
                  </div>
                </motion.div>
                <style>{`
                  .glass-effect {
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                  }

                  @keyframes shine {
                    0% { background-position: -100% 0; }
                    50% { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                  }

                  .glass-effect::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
                    animation: shine 2s infinite;
                  }
                `}</style>
                
                <GameModeCard
                  title="Classic"
                  description="Play with 2-4 players"
                  entryFee={getEntryFee('classic')}
                  comingSoon={!isActionGame}
                  onClick={() => navigate(`/comingsoon`)}
                />
                
                <GameModeCard
                  title="Quick Play"
                  description="Fast-paced matches"
                  entryFee={getEntryFee('quick')}
                  comingSoon={!isActionGame}
                  onClick={() => navigate(`/comingsoon`)}
                />
                
                <GameModeCard
                  title="Private Match"
                  description="Play with friends"
                  entryFee={getEntryFee('private')}
                  comingSoon={!isActionGame}
                  onClick={isActionGame ? () => handleGameModeSelect('private') : undefined}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameLobby;
