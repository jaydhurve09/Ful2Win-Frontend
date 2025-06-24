
import React from 'react';

const BackgroundBubbles = ({ blur = false }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden z-0 pointer-events-none ${blur ? 'blur-sm' : ''}`}>
      {/* Large bubbles - reduced size and responsive */}
      <div className="absolute -top-24 -left-24 w-48 h-48 md:w-64 md:h-64 bg-blue-400 rounded-full opacity-5 animate-float"></div>
      <div className="absolute bottom-1/4 -right-12 w-40 h-40 md:w-56 md:h-56 bg-blue-300 rounded-full opacity-5 animate-float animation-delay-2000"></div>
      
      {/* Medium bubbles - reduced size and responsive */}
      <div className="absolute top-1/3 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-blue-300 rounded-full opacity-5 animate-float animation-delay-1000"></div>
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 md:w-40 md:h-40 bg-blue-200 rounded-full opacity-5 animate-float animation-delay-3000"></div>
      
      {/* Small bubbles - reduced size and responsive */}
      <div className="absolute top-1/5 right-1/4 w-16 h-16 md:w-20 md:h-20 bg-blue-400 rounded-full opacity-5 animate-float animation-delay-1500"></div>
      <div className="absolute top-3/4 left-1/5 w-20 h-20 md:w-24 md:h-24 bg-blue-300 rounded-full opacity-5 animate-float animation-delay-2500"></div>
    </div>
  );
};

export default BackgroundBubbles;
