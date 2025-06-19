import React from 'react';

const Banner = () => {
  return (
    <div className="relative mx-4 md:mx-12 lg:mx-24 xl:mx-44 my-6 p-5 rounded-xl overflow-hidden group">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl opacity-75 group-hover:opacity-100 blur-md transition duration-1000 group-hover:duration-200"></div>
      
      {/* Background with subtle gradient */}
      <div className="relative rounded-xl">
        <div className="relative p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between min-h-[120px] md:h-48">
          {/* Content */}
          <div className="text-center md:text-left mb-4 md:mb-0 md:mr-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">FULL2WIN</h2>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-yellow-300 text-xl">🏆</span>
              <p className="text-yellow-100 text-base font-medium">Win Big, Play More!</p>
            </div>
          </div>
          
          {/* Icons - hide on small screens */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <span className="text-2xl">🎲</span>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <span className="text-2xl">🎮</span>
            </div>
          </div>
        </div>
        
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_20px_rgba(147,197,253,0.3)] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Banner;
