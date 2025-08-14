import React, { useState, useEffect, useRef } from 'react';

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

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const SPINS_KEY = 'spinWheel_spinsLeft';
const TIMER_KEY = 'spinWheel_timer';
const LAST_TIMESTAMP_KEY = 'spinWheel_lastTimestamp';

const SpinWheelScreen = ({ onClose, isVisible, initialSpins = 5 }) => {
  const REFILL_TIME = 120;
  const [isSpinning, setIsSpinning] = useState(false);

  const [spinsLeft, setSpinsLeft] = useState(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(SPINS_KEY) : null;
    return saved !== null ? Number(saved) : initialSpins;
  });

  const [timer, setTimer] = useState(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(TIMER_KEY) : null;
    return saved !== null ? Number(saved) : REFILL_TIME;
  });

  const [lastTimestamp, setLastTimestamp] = useState(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(LAST_TIMESTAMP_KEY) : null;
    return saved !== null ? Number(saved) : Date.now();
  });

  const [rotation, setRotation] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState('');
  const timerId = useRef(null);
  const refilled = useRef(false);

  useEffect(() => {
    setLastTimestamp(Date.now());
  }, []);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SPINS_KEY, spinsLeft.toString());
    }
  }, [spinsLeft]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TIMER_KEY, timer.toString());
    }
  }, [timer]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LAST_TIMESTAMP_KEY, lastTimestamp.toString());
    }
  }, [lastTimestamp]);

  const spin = async () => {
    if (isSpinning || spinsLeft === 0) return;

    const randomOffset = Math.random() * 360;
    const fullSpins = 5;
    const totalRotation = fullSpins * 360 + randomOffset;
    const finalRotation = rotation + totalRotation;

    setRotation(finalRotation);
    setIsSpinning(true);

    setTimeout(async () => {
      const finalAngle = finalRotation % 360;
      const pointerAngle = (360 - finalAngle + SEGMENT_DEGREE / 2) % 360;
      const index = Math.floor(pointerAngle / SEGMENT_DEGREE) % SEGMENT_COUNT;
      const correctedIndex = (index - 4 + SEGMENT_COUNT) % SEGMENT_COUNT;
      const coinsWon = parseInt(LABELS[correctedIndex], 10);

      try {
        // Simulated API call - replace with actual authService calls
        // await authService.spinWheelWin(coinsWon);
        // await authService.getCurrentUserProfile();
        console.log(`Won ${coinsWon} coins!`);
        
        setIsSpinning(false);
        setSpinsLeft((s) => Math.max(0, s - 1));
        setCurrentReward(`${LABELS[correctedIndex]} Coins`);

        // Play win sound
        window.dispatchEvent(new CustomEvent("play-sound", { detail: "win" }));

        setShowReward(true);
        setLastTimestamp(Date.now());
      } catch (error) {
        setIsSpinning(false);
        console.error('Failed to register coin win. Please try again.');
      }
    }, 3500);
  };

  useEffect(() => {
    if (timerId.current) clearInterval(timerId.current);

    timerId.current = setInterval(() => {
      setTimer((prev) => {
        if (spinsLeft >= initialSpins) {
          refilled.current = false;
          return REFILL_TIME;
        }

        if (prev <= 1) {
          if (!refilled.current) {
            setSpinsLeft((s) => Math.min(initialSpins, s + 1));
            refilled.current = true;
          }
          return REFILL_TIME;
        }

        refilled.current = false;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId.current);
  }, [spinsLeft, initialSpins]);

  const handleCloseReward = () => {
    setShowReward(false);
    setCurrentReward('');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main Container */}
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-md mx-auto flex flex-col items-center rounded-3xl p-8"
          style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.2)
            `,
            border: '2px solid rgba(255, 255, 255, 0.1)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 3D Corner Effects */}
          <div
            className="absolute top-0 left-0 rounded-tl-3xl"
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
              clipPath: 'polygon(0 0, 100% 0, 0 100%)'
            }}
          />
          <div
            className="absolute top-0 right-0 rounded-tr-3xl"
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(225deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
              clipPath: 'polygon(100% 0, 100% 100%, 0 0)'
            }}
          />
          <div
            className="absolute bottom-0 left-0 rounded-bl-3xl"
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.05))',
              clipPath: 'polygon(0 0, 100% 100%, 0 100%)'
            }}
          />
          <div
            className="absolute bottom-0 right-0 rounded-br-3xl"
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(315deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.05))',
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
            }}
          />
        
          {/* Title */}
          <h1 
            className="text-3xl font-black text-center mb-6 tracking-wider relative z-10"
            style={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))'
            }}
          >
            DAILY SPIN WHEEL
          </h1>

          {/* Wheel Container */}
          <div className="relative mb-6 z-10" style={{ width: '280px', height: '280px' }}>
            {/* Pointer */}
            <div 
              className="absolute z-30"
              style={{
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '24px solid #FFD700',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}
            />

            {/* Outer Golden Ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(45deg, #B8860B, #DAA520, #FFD700, #DAA520, #B8860B)',
                padding: '12px',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(255, 215, 0, 0.3)'
              }}
            >
              {/* Inner Wheel */}
              <div
                className="w-full h-full rounded-full relative transition-transform duration-[3500ms] ease-out"
                style={{
                  background: getConicGradient(),
                  transform: `rotate(${rotation + SEGMENT_DEGREE / 2}deg)`,
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
                }}
              >
                {/* Segment Labels */}
                {LABELS.map((label, index) => {
                  const angle = index * SEGMENT_DEGREE + SEGMENT_DEGREE / 2;
                  const radius = 42;
                  const rad = (angle * Math.PI) / 180;
                  const x = 50 + radius * Math.cos(rad);
                  const y = 50 + radius * Math.sin(rad);
                  
                  return (
                    <div
                      key={index}
                      className="absolute text-white font-bold"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        fontSize: '18px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                      }}
                    >
                      <div style={{ transform: `rotate(${-angle}deg)` }}>
                        {label}
                      </div>
                    </div>
                  );
                })}

                {/* Center Hub */}
                <div
                  className="absolute left-1/2 top-1/2 rounded-full flex items-center justify-center z-20"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.3)',
                    border: '3px solid #B8860B'
                  }}
                >
                  <div 
                    className="text-2xl font-bold"
                    style={{
                      color: '#8B4513',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    ₹
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <button
            onClick={spin}
            disabled={isSpinning || spinsLeft === 0}
            className={`w-64 h-14 rounded-xl font-bold text-white text-lg transition-all duration-200 relative z-10 ${
              isSpinning || spinsLeft === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 active:scale-95'
            }`}
            style={{
              background: spinsLeft > 0 
                ? 'linear-gradient(135deg, #DC2626, #B91C1C)' 
                : 'linear-gradient(135deg, #6B7280, #4B5563)',
              boxShadow: spinsLeft > 0 
                ? '0 8px 20px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : '0 8px 20px rgba(107, 114, 128, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {spinsLeft > 0 ? `Spin (${spinsLeft} left)` : 'No Spins Left'}
          </button>

          {/* Timer */}
          {spinsLeft < initialSpins && (
            <p 
              className="mt-3 font-semibold text-base relative z-10"
              style={{
                color: '#FFD700',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              Next spin in: {formatTime(timer)}
            </p>
          )}

          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black bg-opacity-30 text-white text-xl font-bold hover:bg-opacity-50 transition-all duration-200 z-20"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Reward Popup */}
      {showReward && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50 p-4" 
          onClick={handleCloseReward}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-8 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
              border: '3px solid #FFD700',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.8)'
            }}
          >
            <h3 
              className="text-3xl font-black mb-4"
              style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Reward Unlocked!
            </h3>
            
            <p className="text-white text-lg mb-6 text-center font-semibold">
              Congratulations! You have won:
            </p>
            
            <p 
              className="text-4xl font-black mb-8 animate-pulse"
              style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))'
              }}
            >
              {currentReward}
            </p>
            
            <button 
              onClick={handleCloseReward} 
              className="px-12 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#1e3c72',
                boxShadow: '0 8px 20px rgba(255, 215, 0, 0.4)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SpinWheelScreen;