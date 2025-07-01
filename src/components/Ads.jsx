import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';

const Ads = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff]">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

        {/* Back Button Only (No Heading) */}
        <div className="flex items-center max-w-md mx-auto px-4 mt-20">
          <button
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate('/home'); // fallback
              }
            }}
            className="bg-white/10 p-2 rounded-full hover:bg-white/20"
          >
            <FiArrowLeft size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex items-center justify-center min-h-[60vh] pt-10 px-4">
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
