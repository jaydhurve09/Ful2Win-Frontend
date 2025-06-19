import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import RewardPopup from './RewardPopup';

/**
 * SpinWheelScreen Component
 * -----------------------------------------------------------------------------
 * Full-screen modal that shows a 12-segment spin wheel.
 * - Responsive and mobile-first (TailwindCSS utility classes).
 * - Smooth spin animation (CSS transform + transition).
 * - Touch friendly and accessible (focus trap / ESC & overlay click to close).
 */
const COLORS = [
  '#FF1493', // Hot Pink
  '#FFB6C1', // Light Pink
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFD700', // Yellow
  '#90EE90', // Light Green
  '#008000', // Green
  '#00FFFF', // Cyan
  '#87CEFA', // Light Blue
  '#0000FF', // Blue
  '#800080', // Purple
  '#4B0082', // Dark Purple
];

const SEGMENT_DEGREE = 360 / COLORS.length; // 30

function getConicGradient() {
  let currentDeg = 0;
  const parts = COLORS.map((clr) => {
    const segment = `${clr} ${currentDeg}deg ${currentDeg + SEGMENT_DEGREE}deg`;
    currentDeg += SEGMENT_DEGREE;
    return segment;
  });
  return `conic-gradient(${parts.join(', ')})`;
}

const REWARDS = ["100 Coins", "200 Coins", "500 Coins"];

const SpinWheelScreen = ({ onClose, isVisible, initialSpins = 5 }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(initialSpins);
  const [rotation, setRotation] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState('');
  const wheelRef = useRef(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isVisible]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const spin = () => {
    if (isSpinning || spinsLeft === 0) return;
    
    const fullRotations = Math.floor(Math.random() * 3) + 3; // 3-5 full turns
    const randomSegment = Math.floor(Math.random() * COLORS.length);
    const finalDeg = fullRotations * 360 + randomSegment * SEGMENT_DEGREE + SEGMENT_DEGREE / 2;

    setIsSpinning(true);
    setRotation((prev) => prev + finalDeg);

    // Wait for transition (3.5s) then show reward
    setTimeout(() => {
      setIsSpinning(false);
      setSpinsLeft((s) => Math.max(s - 1, 0));
      // Select and show random reward after spin completes
      const randomReward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
      setCurrentReward(randomReward);
      setShowReward(true);
    }, 3500);
  };

  const handleCloseReward = () => {
    setShowReward(false);
    setCurrentReward('');
  };

  if (!isVisible) return null;

  /* Responsive wheel size – 70% on mobile, max 320px, min 280px */
  const wheelSize = 'min(70vw, 320px)';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Modal content */}
      <div
        className="relative w-full max-w-[400px] bg-white/10 backdrop-blur-lg rounded-2xl p-6 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} // stop overlay close
      >
        {/* Header */}
        <h2 className="text-2xl font-extrabold text-[#FFD700] text-center mb-6 md:mb-8 select-none">
          Daily Spin Wheel
        </h2>

        {/* Wheel wrapper */}
        <div className="relative flex items-center justify-center mb-8 md:mb-10" style={{ width: wheelSize, height: wheelSize }}>
          {/* Red pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-5 bg-red-600 z-10" />
          
          {/* Triangular pointer (keeping this for backward compatibility) */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-10 border-r-10 border-b-10 border-l-transparent border-r-transparent border-b-white" />

          {/* Wheel */}
          <div
            ref={wheelRef}
            className="rounded-full transition-transform duration-[3500ms] ease-out"
            style={{ width: '100%', height: '100%', background: getConicGradient(), transform: `rotate(${rotation}deg)` }}
          />

          {/* Center hub */}
          <div className="absolute w-12 h-12 bg-gray-800 rounded-full" />
        </div>

        {/* Spin button */}
        <button
          type="button"
          disabled={isSpinning || spinsLeft === 0}
          onClick={spin}
          className={`w-4/5 h-12 rounded-lg font-bold text-white text-lg transition-opacity ${
            isSpinning || spinsLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`} 
          style={{ backgroundColor: '#DC2626' }}
        >
          {spinsLeft > 0 ? `Spin (${spinsLeft} left)` : 'No Spins Left'}
        </button>

        {/* Close icon / text */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-300 text-xl leading-none focus:outline-none"
          aria-label="Close spin wheel"
        >
          ×
        </button>
      </div>
      
      {/* Reward Popup */}
      <RewardPopup 
        reward={currentReward}
        onClose={handleCloseReward}
      />
    </div>
  );
};

SpinWheelScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  initialSpins: PropTypes.number,
};

export default SpinWheelScreen;
