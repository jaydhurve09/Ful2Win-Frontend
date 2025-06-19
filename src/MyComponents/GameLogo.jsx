import React from 'react';
import logo from '../assets/logo.png';

const GameLogo = () => {
  return (
    <div className="flex justify-center py-4">
      <img src={logo} alt="Game Logo" className="h-16" />
    </div>
  );
};

export default GameLogo;
