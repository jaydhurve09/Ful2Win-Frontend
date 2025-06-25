import React from 'react';
import PropTypes from 'prop-types';

/**
 * RewardPopup Component (Enhanced)
 * -------------------------------------------------------------------
 * A modal-style reward popup with glow, animated starburst,
 * and celebratory visuals. Matches SpinWheelScreen vibrant style.
 */
const RewardPopup = ({ reward, onClose }) => {
  if (!reward) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-blue/70 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative animate-reward-popup bg-gradient-to-br from-purple-800/80 to-blue-900/80 p-1 rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Star Burst Glow Animation */}
        <div className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none">
          <div className="absolute w-48 h-48 bg-yellow-400/30 rounded-full blur-2xl animate-ping" />
          <div className="absolute w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-ping delay-200" />
          <div className="absolute w-20 h-20 bg-green-400/30 rounded-full blur-md animate-ping delay-300" />
        </div>

        {/* Reward Content */}
        <div className="relative z-10 bg-black/70 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center text-white shadow-inner">
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-300 to-pink-400 text-transparent bg-clip-text animate-pulse">
            ✨ Reward Unlocked! ✨
          </h3>
          <p className="text-base">Congratulations! You have won:</p>
          <p className="text-3xl font-bold text-green-400 tracking-wide">{reward}</p>

          <button
            onClick={onClose}
            className="bg-gradient-to-br from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
            autoFocus
          >
            🎁 Claim Reward
          </button>
        </div>
      </div>
    </div>
  );
};

RewardPopup.propTypes = {
  reward: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default RewardPopup;
