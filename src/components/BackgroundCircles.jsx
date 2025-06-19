import React from 'react';

const BackgroundCircles = () => {
  // Generate an array of circle elements with random sizes and positions
  const circles = Array.from({ length: 15 }).map((_, index) => {
    // Random size between 200px and 800px
    const size = Math.floor(Math.random() * 600) + 200;
    // Random position between 0% and 100%
    const left = Math.floor(Math.random() * 100);
    const top = Math.floor(Math.random() * 100);
    // Random opacity between 0.05 and 0.2
    const opacity = Math.random() * 0.15 + 0.05;
    
    return (
      <div
        key={index}
        className="absolute rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          transform: 'translate(-50%, -50%)',
          opacity: opacity,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {circles}
    </div>
  );
};

export default BackgroundCircles;
