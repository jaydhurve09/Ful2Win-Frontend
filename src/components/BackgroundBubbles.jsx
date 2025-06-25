

import React from 'react';

const BackgroundBubbles = ({ blur = false }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden z-0 pointer-events-none ${blur ? 'blur-sm' : ''}`}>
      {/* Large bubbles - now smaller */}
      <div className="absolute -top-16 -left-16 w-24 h-24 md:w-32 md:h-32 bg-blue-400 rounded-full opacity-5 animate-float delay-[0ms]"></div>
      <div className="absolute bottom-1/4 -right-8 w-20 h-20 md:w-28 md:h-28 bg-blue-300 rounded-full opacity-5 animate-float delay-[2000ms]"></div>

      {/* Medium bubbles - now smaller */}
      <div className="absolute top-1/3 left-1/4 w-16 h-16 md:w-24 md:h-24 bg-blue-300 rounded-full opacity-5 animate-float delay-[1000ms]"></div>
      <div className="absolute bottom-1/3 right-1/4 w-20 h-20 md:w-28 md:h-28 bg-blue-200 rounded-full opacity-5 animate-float delay-[3000ms]"></div>

      {/* Small bubbles - now smaller */}
      <div className="absolute top-[20%] right-1/4 w-10 h-10 md:w-16 md:h-16 bg-blue-400 rounded-full opacity-5 animate-float delay-[1500ms]"></div>
      <div className="absolute top-3/4 left-1/5 w-12 h-12 md:w-16 md:h-16 bg-blue-300 rounded-full opacity-5 animate-float delay-[2500ms]"></div>
    </div>
  );
};

export default BackgroundBubbles;
