import React from 'react';
import BackgroundBubbles from '../components/BackgroundBubbles';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-blueGradient overflow-hidden">
      <BackgroundBubbles />
      <button
        className="absolute top-6 left-6 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full px-4 py-2 shadow-md backdrop-blur-md transition-colors flex items-center"
        onClick={() => navigate(-1)}
      >
        <span className="mr-2">&#8592;</span> Back
      </button>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-4 bg-neonBlueGradient bg-clip-text text-transparent">Coming Soon!</h1>
        <p className="text-lg mb-8 text-white">This feature is under development. Stay tuned!</p>
        <img src="/vite.svg" alt="Coming Soon" className="w-32 h-32 animate-bounce" />
      </div>
    </div>
  );
};

export default ComingSoon;
