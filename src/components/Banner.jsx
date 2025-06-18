import React from 'react';

const Banner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 mx-4 md:mx-8 lg:mx-16 xl:mx-48 my-4 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0 md:mr-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">FULL2WIN</h2>
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span className="text-yellow-300">🏆</span>
            <p className="text-yellow-200 text-sm md:text-base">Win Big, Play More!</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <span className="text-2xl">🎯</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <span className="text-2xl">🎲</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <span className="text-2xl">🎮</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
