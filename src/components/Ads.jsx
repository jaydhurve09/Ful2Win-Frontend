import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';

const Ads = () => {
  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff]">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />
        <div className="flex items-center justify-center min-h-[70vh] pt-10 px-4">
          <div className="text-center px-6 py-10 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-md max-w-md">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Ads Coming Soon!</h2>
            <p className="text-white/80 text-base">Stay tuned for exciting offers and rewards.</p>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Ads;
