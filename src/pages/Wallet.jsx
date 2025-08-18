import React, { useEffect, useState, useCallback } from 'react';
import { GiTwoCoins } from 'react-icons/gi';
import { FaRedoAlt, FaPlay, FaBolt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

import BackgroundCircles from '../components/BackgroundCircles';

import SpinWheelScreen from '../components/SpinWheelScreen';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';
import BackgroundCircles from '../components/BackgroundCircles';

// ONLY ADDITION: Coin Sprinkler Animation Component
const CoinSprinkler = ({ isActive, onComplete }) => {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  // Generate random coins
  const coins = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 0.5,
    startX: Math.random() * 100,
    endX: Math.random() * 100,
    rotation: Math.random() * 360,
    size: 20 + Math.random() * 10,
  }));

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="absolute"
            style={{
              left: `${coin.startX}%`,
              top: '-30px',
              animationDelay: `${coin.delay}s`,
              animationDuration: `${coin.duration}s`,
              animationFillMode: 'forwards',
              animationName: `coinFall-${coin.id}`,
              animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <GiTwoCoins
              className="text-yellow-400"
              size={coin.size}
              style={{
                textShadow: '0 0 15px rgba(255, 215, 0, 0.9), 0 0 25px rgba(255, 215, 0, 0.6)',
                filter: 'brightness(1.3)',
                animation: `coinRotate 0.6s linear infinite, coinGlow 1s ease-in-out infinite alternate`,
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Dynamic CSS animations for each coin */}
      <style dangerouslySetInnerHTML={{
        __html: `
          ${coins.map((coin) => `
            @keyframes coinFall-${coin.id} {
              0% {
                transform: translateY(-30px) translateX(0px) rotate(0deg) scale(0.8);
                opacity: 0;
              }
              10% {
                opacity: 1;
                transform: translateY(20px) translateX(0px) rotate(36deg) scale(1);
              }
              50% {
                opacity: 1;
                transform: translateY(50vh) translateX(${(Math.random() - 0.5) * 100}px) rotate(180deg) scale(1.1);
              }
              100% {
                transform: translateY(100vh) translateX(${(Math.random() - 0.5) * 150}px) rotate(720deg) scale(0.6);
                opacity: 0;
              }
            }
          `).join('')}
          
          @keyframes coinRotate {
            0% { transform: rotateY(0deg) rotateX(0deg); }
            25% { transform: rotateY(90deg) rotateX(90deg); }
            50% { transform: rotateY(180deg) rotateX(180deg); }
            75% { transform: rotateY(270deg) rotateX(270deg); }
            100% { transform: rotateY(360deg) rotateX(360deg); }
          }
          
          @keyframes coinGlow {
            0% { 
              text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.4);
              filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
            }
            100% { 
              text-shadow: 0 0 20px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4);
              filter: brightness(1.6) drop-shadow(0 0 15px rgba(255, 215, 0, 0.9));
            }
          }
          
          @keyframes iconPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `
      }} />
    </>
  );
};

const Wallet = () => {
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState({
    deposit: 0,
    winning: 0,
    bonus: 0,
    coins: 0,
    balance: 0,
    profilePicture: '',
    transactions: [],
  });
  const [displayCoins, setDisplayCoins] = useState(0); // Animated display
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);

  const [showCoinSprinkle, setShowCoinSprinkle] = useState(false);

  const { currentUser } = useAuth();
  const [randomAvatar, setRandomAvatar] = useState('');

  const avatarUrls = [
    'https://static.vecteezy.com/system/resources/thumbnails/054/555/561/small/a-man-wearing-headphones-and-sunglasses-is-wearing-a-hoodie-free-vector.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTkGqGhRMsxpIB4MJdd0PyWTnEmMouDPZF2tikUPWBlqag3n1hwaEm5dWZPhFsFpWoOAY&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8S4iUctVEKnT2XADlOKU2BXtB4hnPCcWT5wOZLecqj_jlqm1srgGHB35KEmRr2DVYZ_k&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTusljDoqM83wPeOFOI0aLE8cTo9i1Od-D9-lwlY7J7cRHK2Foo2xO9doYTZup5HqLVJNI&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtivNT4hLBnG6ONjJF3-g1-xcjm8l9IXSIvra4O0kOrdW52Bq4nrB1YEahHA2afCC7f10&usqp=CAU',
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * avatarUrls.length);
    setRandomAvatar(avatarUrls[randomIndex]);
  }, []);

  const coinSound = new Audio('/sounds/coin.mp3'); // make sure you have this file in public/sounds

  const fetchUserData = useCallback(async () => {
    try {
      setRefreshing(true);
      const userData = await authService.getCurrentUserProfile();

      if (userData) {
        setWalletData(prev => ({
          ...prev,
          coins: userData.coins || 0,
          balance: userData.balance || userData.Balance || 0,
          deposit: userData.deposit || 0,
          winning: userData.winning || 0,
          bonus: userData.bonus || 0,
          profilePicture: userData.profilePicture || userData.avatar || '',
        }));
        setDisplayCoins(userData.coins || 0); // sync display count
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load wallet data');

      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (localUser) {
        setWalletData(prev => ({
          ...prev,
          coins: localUser.coins || 0,
          balance: localUser.balance || localUser.Balance || 0,
          deposit: localUser.deposit || 0,
          winning: localUser.winning || 0,
          bonus: localUser.bonus || 0,
          profilePicture: localUser.profilePicture || localUser.avatar || '',
        }));
        setDisplayCoins(localUser.coins || 0);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleRefresh = () => {
    setShowCoinAnimation(true);
    fetchUserData();
    triggerCoinSprinkle();
  };

  const triggerCoinSprinkle = () => {
    setShowCoinSprinkle(true);
    setTimeout(() => setShowCoinSprinkle(false), 3000);
  };

  const animateCoinIncrease = (coinsToAdd) => {
    let start = displayCoins;
    let end = start + coinsToAdd;
    let step = Math.max(1, Math.floor(coinsToAdd / 40)); // smooth speed
    let current = start;

    triggerCoinSprinkle();
    coinSound.play();

    const interval = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        clearInterval(interval);
      }
      setDisplayCoins(current);
    }, 50);

    // Update actual wallet data
    setWalletData(prev => ({
      ...prev,
      coins: end,
    }));
  };

  const handleCoinAnimationComplete = () => {
    setShowCoinAnimation(false);
  };

  const handleSpinClick = () => setShowSpinWheel(true);
  const handleCloseSpin = () => setShowSpinWheel(false);

  const handleReward = (reward) => {
    if (reward.includes('Coins')) {
      const coinsWon = parseInt(reward);
      animateCoinIncrease(coinsWon);
    }
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-royalBlueGradient">

      <BackgroundCircles />
      
      <CoinSprinkler 
        isActive={showCoinAnimation} 
        onComplete={handleCoinAnimationComplete} 
      />
      

      <div className="relative z-10">
        <Header />

        <div className="pt-20 mt-7 px-4 max-w-4xl mx-auto space-y-6">
          {/* Wallet Card */}
          <div className="w-full border border-white/30 rounded-xl text-white text-center p-4 relative overflow-hidden">
            {/* Profile Picture */}
            <div className="w-20 h-20 rounded-full bg-yellow-400 mx-auto flex items-center justify-center overflow-hidden mb-4 border-[3px] border-dullBlue">
              {randomAvatar ? (
                <img
                  src={randomAvatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-2xl font-bold">
                  {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {/* Coins Section */}
            <div className="flex flex-col items-center gap-1 relative">
              {showCoinSprinkle && (
                <div className="absolute -top-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <GiTwoCoins
                      key={i}
                      className="text-yellow-300 absolute animate-coin-fall"
                      style={{
                        left: `${Math.random() * 60 - 30}px`,
                        animationDelay: `${i * 0.2}s`,
                        fontSize: '18px',
                      }}
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <p className="text-white/80 text-sm">Coins</p>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={`text-white/60 hover:text-white transition-all duration-300 transform hover:scale-110 ${
                    showCoinAnimation ? 'text-yellow-400 scale-125' : ''
                  }`}
                >
                  <FaRedoAlt 
                    size={14} 
                    className={`${refreshing ? 'animate-spin' : ''} ${
                      showCoinAnimation ? 'animate-pulse' : ''
                    }`}
                    style={{
                      animation: showCoinAnimation ? 'iconPulse 0.5s ease-in-out infinite' : undefined
                    }}
                  />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-yellow-300 flex items-center gap-1">
                {displayCoins.toLocaleString()} <GiTwoCoins size={18} />
              </h3>
            </div>

            <div className="my-3 h-[1px] w-full bg-white/30" />

            {/* Row: Balance | Winning | Bonus */}
            <div className="flex flex-wrap justify-between text-sm sm:text-base font-medium text-center gap-4">
              <div className="flex-1 min-w-[100px]">
                <p className="text-white/80">Balance</p>
                <p className="text-yellow-300">₹{walletData.balance.toLocaleString()}</p>
              </div>
              <div className="flex-1 min-w-[100px]">
                <p className="text-white/80">Winning</p>
                <h2 className="text-lg font-bold text-green-400">₹ {walletData.winning}</h2>
              </div>
              <div className="flex-1 min-w-[100px]">
                <p className="text-white/80">Bonus</p>
                <h2 className="text-lg font-bold text-yellow-300">₹ {walletData.bonus}</h2>
              </div>
            </div>

            <div className="my-3 h-[1px] w-full bg-white/30" />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                className="w-full py-3 rounded-xl bg-yellow-400 text-blue-900 font-bold text-lg shadow-md hover:bg-yellow-300 transition"
                onClick={() => navigate('/add')}
              >
                ADD ₹
              </button>
              <button
                className="w-full py-3 rounded-xl border border-blue-300 bg-blue-900/60 text-white hover:bg-white/10 transition"
                onClick={() => navigate('/withdraw')}
              >
                WITHDRAW ₹ (Winning Only)
              </button>
              <p className="text-xs text-yellow-100 text-center">
                After KYC<br />
                Only Winning Amount is Withdrawable
              </p>
            </div>
          </div>

          {/* Earn Bonus Heading */}
          <h2 className="text-center text-lg font-bold text-yellow-300 mt-6">Earn Bonus</h2>

          {/* Quick Access Buttons */}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {[
              { icon: <FaRedoAlt size={18} className="text-blue-900" />, label: 'Spin', onClick: handleSpinClick },
              { icon: <FaPlay size={18} className="text-blue-900" />, label: 'Ads', onClick: () => navigate('/ads') },
              { icon: <FaBolt size={18} className="text-blue-900" />, label: 'Challenges', onClick: () => navigate('/challenges') },
            ].map((action, idx) => (
              <div
                key={idx}
                onClick={action.onClick}
                className="w-24 h-24 rounded-xl border border-blue-300 bg-blue-900/60 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-blue-800 transition"
              >
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center mb-2">
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-white">{action.label}</span>
              </div>
            ))}
          </div>

          {/* History Button */}
          <div className="w-full px-4 mt-4">
            <button
              onClick={() => navigate('/history')}
              className="w-full py-3 border border-blue-300 bg-blue-900/60 text-white text-center rounded-xl text-base font-semibold hover:bg-white/10 transition"
            >
              History
            </button>
          </div>
        </div>
      </div>

      <Navbar />

      {showSpinWheel && (
        <SpinWheelScreen
          isVisible={showSpinWheel}
          onClose={handleCloseSpin}
          onReward={handleReward}
        />
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes coinFall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(60px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-coin-fall {
          animation: coinFall 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Wallet;
