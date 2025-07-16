import React from 'react';

const NeonGradientCard = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff00ff] to-[#00FFF1] opacity-100 rounded-xl" />
      <div className="relative bg-gradient-to-br from-[#ff00ff]/5 to-[#00FFF1]/5 rounded-xl shadow-md p-4">
        {children}
      </div>
    </div>
  );
};

export { NeonGradientCard };
