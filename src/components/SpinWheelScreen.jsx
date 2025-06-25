import React, { useState } from 'react';
import RewardPopup from './RewardPopup'; // adjust path as needed

const COLORS = [
  '#800080', '#FF1493', '#FFB6C1', '#FF0000',
  '#FF7F00', '#FFD700', '#90EE90', '#008000',
  '#00FFFF', '#87CEFA', '#0000FF', '#4B0082',
];

const SEGMENT_COUNT = COLORS.length;
const SEGMENT_DEGREE = 360 / SEGMENT_COUNT;
const LABELS = Array.from({ length: SEGMENT_COUNT }, (_, i) => `${(i + 1) * 50}`);

function getConicGradient() {
  let currentDeg = 0;
  return `conic-gradient(${COLORS.map((clr) => {
    const segment = `${clr} ${currentDeg}deg ${currentDeg + SEGMENT_DEGREE}deg`;
    currentDeg += SEGMENT_DEGREE;
    return segment;
  }).join(', ')})`;
}

const SpinWheelScreen = ({ onClose, isVisible, initialSpins = 5 }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(initialSpins);
  const [rotation, setRotation] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState('');

  const spin = () => {
    if (isSpinning || spinsLeft === 0) return;

    const selectedIndex = Math.floor(Math.random() * SEGMENT_COUNT);
    const angleToSegment = selectedIndex * SEGMENT_DEGREE + SEGMENT_DEGREE / 2;
    const fullRotations = Math.floor(Math.random() * 3) + 3;
    const totalRotation = fullRotations * 360 + angleToSegment;

    const finalRotation = rotation + totalRotation;

    setIsSpinning(true);
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinsLeft((s) => s - 1);
      setCurrentReward(`${LABELS[selectedIndex]} Coins`);
      setShowReward(true);
      console.log("Reward sent to backend:", LABELS[selectedIndex]);
    }, 3500);
  };

  const handleCloseReward = () => {
    setShowReward(false);
    setCurrentReward('');
  };

  if (!isVisible) return null;

  const wheelSize = 'min(70vw, 320px)';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="relative w-full max-w-[400px] bg-white/10 backdrop-blur-lg rounded-2xl p-6 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-extrabold text-[#FFD700] text-center mb-6">Daily Spin Wheel</h2>

        {/* Wheel */}
        <div className="relative flex items-center justify-center mb-8" style={{ width: wheelSize, height: wheelSize }}>
          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-5 bg-red-600 z-10" />
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-10 border-r-10 border-b-10 border-l-transparent border-r-transparent border-b-white" />

          <div
            className="rounded-full transition-transform duration-[3500ms] ease-out relative"
            style={{
              width: '100%',
              height: '100%',
              background: getConicGradient(),
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {/* Labels */}
            {LABELS.map((label, index) => {
              const angle = index * SEGMENT_DEGREE + SEGMENT_DEGREE / 2;
              const radius = 44;
              const rad = (angle * Math.PI) / 180;
              const x = 50 + radius * Math.cos(rad);
              const y = 50 + radius * Math.sin(rad);
              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  }}
                >
                  <div
                    className="text-white text-[13px] font-bold"
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>

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

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-300 text-xl"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Reward Popup */}
      <RewardPopup reward={currentReward} onClose={handleCloseReward} />
    </div>
  );
};

export default SpinWheelScreen;
