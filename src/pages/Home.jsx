import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Banner from '../components/Banner';
import TrendingGames from '../components/TrendingGames';
import MultiplayerGames from '../components/MultiplayerGames';
import PopularGames from '../components/PopularGames';
import FreeGames from '../components/freegames';
import Navbar from '../components/Navbar';
import SpinWheelScreen from '../components/SpinWheelScreen';
import BackgroundBubbles from '../components/BackgroundBubbles';
import BackgroundCircles from '../components/BackgroundCircles';
import SpinIcon from '../assets/SpinIcon.png';
import controllerIcon from '../assets/controller.png';
import multiplayerIcon from '../assets/Multiplayer.png';
import gameIcon from '../assets/game.png';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [showSpinWheel, setShowSpinWheel] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('spinShownAfterLogin');
    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setShowSpinWheel(true);
        sessionStorage.setItem('spinShownAfterLogin', 'true');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleCloseSpin = () => setShowSpinWheel(false);

  const SectionTitle = ({ icon, title, gradient }) => (
    <div
      className="inline-flex items-center gap-2 py-1 pl-2 pr-3 -mb-1 ml-0"
      style={{
        background: gradient,
        borderTopRightRadius: '32px',
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
      }}
    >
      <img src={icon} alt="icon" className="w-4 h-4" />
      <h2 className="font-bold text-white font-orbitron italic text-sm sm:text-base md:text-lg lg:text-xl">
        {title}
      </h2>
    </div>
  );

  return (
    <div className="relative min-h-screen pb-16 overflow-hidden text-white">
      {/* Shine animation */}
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          12.3% { left: 100%; }
          100% { left: 100%; }
        }

        .shine-overlay {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shine 5.7s ease-in-out infinite;
          pointer-events: none;
        }

        .shine-container {
          position: relative;
        }
      `}</style>

      <BackgroundBubbles />
      <BackgroundCircles />
      <div className="absolute inset-0 bg-gradient-to-b from-[#00bfff] to-[#000080] opacity-40 z-0" />

      <div className="relative z-10 pt-8">
        <Header />

        {/* Banner with margin below */}
        <div className="px-3 mb-6">
          <Banner />
        </div>

        {/* Spin Button */}
        <div className="fixed bottom-16 right-0 z-20">
          <button onClick={() => setShowSpinWheel(true)} className="p-2">
            <img
              src={SpinIcon}
              alt="Spin Wheel"
              className="w-14 h-14 hover:scale-110 transition-transform duration-200"
            />
          </button>
        </div>

        {/* Content */}
        <div className="w-full px-3">
          <div className="max-w-screen-lg mx-auto">

            {/* Trending */}
            <div className="mb-1">
              <SectionTitle
                icon={gameIcon}
                title="Trending Games"
                gradient="linear-gradient(to bottom, #E0CA00, #D98D00)"
              />
              <TrendingGames className="mt-3" />
            </div>

            {/* Free games */}
            <div className="mb-1">
              <SectionTitle
                icon={controllerIcon}
                title="Free Games"
                gradient="linear-gradient(to bottom, #96D9C0, #013220 )"
              />
              <FreeGames className="mt-4" />
            </div>

            {/* Multiplayer */}
            <div className="mb-2">
              <SectionTitle
                icon={multiplayerIcon}
                title="Multiplayer Games"
                gradient="linear-gradient(to bottom, #00C9FF, #005BBA)"
              />
              <MultiplayerGames className="mt-3" />
            </div>

            {/* Popular */}
            <div className="mb-1">
              <SectionTitle
                icon={controllerIcon}
                title="Popular Games"
                gradient="linear-gradient(to bottom, #B721FF, #700A72)"
              />
              <PopularGames className="mt-3" />
            </div>

            
          </div>
        </div>
      </div>

      <Navbar />

      {showSpinWheel && (
        <SpinWheelScreen onClose={handleCloseSpin} isVisible={showSpinWheel} />
      )}
    </div>
  );
};

export default Home;
