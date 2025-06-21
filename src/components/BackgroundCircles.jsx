import React from 'react';

const BackgroundCircles = () => {
  const circles = Array.from({ length: 25 }).map((_, index) => {
    const size = Math.floor(Math.random() * 10) + 10; 
    const left = Math.floor(Math.random() * 100);
    const top = Math.floor(Math.random() * 100);
    const opacity = Math.random() * 0.15 + 0.1; 

    return (
      <div
        key={index}
        className="absolute rounded-full bg-blue-300"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          transform: 'translate(-50%, -50%)',
          opacity: opacity,
          filter: 'blur(1px)', // very soft
          pointerEvents: 'none',
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-700 to-blue-900 overflow-hidden">
      {circles}
    </div>
  );
};

export default BackgroundCircles;
