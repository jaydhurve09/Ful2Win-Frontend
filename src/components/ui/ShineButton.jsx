import React from 'react';
import PropTypes from 'prop-types';

const ShineButton = ({
  children,
  onClick,
  variant = 'default',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'relative overflow-hidden rounded-md px-8 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant classes
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500',
    dark: 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500',
  };

  // Disabled state
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <>
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .shine-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: translateX(-100%);
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
      
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${disabled ? disabledClasses : ''} ${className}`}
        {...props}
      >
        <span className="shine-effect pointer-events-none" />
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    </>
  );
};

ShineButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'outline', 'ghost', 'dark']),
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
};

export default ShineButton;