import React from 'react';
import BackgroundBubbles from './BackgroundBubbles';
import logo from '../assets/logo.png'; // adjust path if needed

const StartScreen = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(to bottom, #0A2472 0%, #0D47A1 45%, #1565C0 100%)",
      }}
    >
      <BackgroundBubbles />

      {/* Logo and tagline container */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated Logo */}
        <img
          src={logo}
          alt="Ful2Win Logo"
          className="w-48 h-auto animate-bounce-slow"
        />

        {/* Animated Tagline */}
        <p className="mt-6 text-sm sm:text-lg font-semibold animate-bounce-slow">
          <span className="text-yellow-400">Entertainment.</span>{' '}
          <span className="text-cyan-300">Earning.</span>{' '}
          <span className="text-red-400">Fame</span>
        </p>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StartScreen;
