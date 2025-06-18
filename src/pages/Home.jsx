import React from 'react';
import Header from '../components/Header';
import TrendingGames from '../components/TrendingGames';
import MultiplayerGames from '../components/MultiplayerGames';
import PopularGames from '../components/PopularGames';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import SpinWheelScreen from '../components/SpinWheelScreen';
import { useState, useEffect } from 'react';

const Home = () => {
  const [showSpinWheel, setShowSpinWheel] = useState(false);

  // Example: auto show on first load after 1s (can be replaced by button)
  useEffect(() => {
    const timer = setTimeout(() => setShowSpinWheel(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-bgColor text-white min-h-screen pb-24">
      <div className="bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent">
        <Header />
          {/* Trigger button (desktop view only) */}
          <div className="hidden md:block absolute top-20 right-4 z-10">
            <button
              onClick={() => setShowSpinWheel(true)}
              className="bg-yellow-400 text-black font-bold px-4 py-2 rounded"
            >
              Daily Spin
            </button>
          </div>
        <div className="pt-16 md:pt-0">
          <Banner />
          <div className="container mx-auto px-4 py-2">
            <TrendingGames />
            <MultiplayerGames />
            <PopularGames />
          </div>
        </div>
      </div>
      <Navbar />
      {/* Spin Wheel Modal */}
      {showSpinWheel && (
        <SpinWheelScreen onClose={() => setShowSpinWheel(false)} isVisible={showSpinWheel} />
      )}
    </div>
  );
};

export default Home;
