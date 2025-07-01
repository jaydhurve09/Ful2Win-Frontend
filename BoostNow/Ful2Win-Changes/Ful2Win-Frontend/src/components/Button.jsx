import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 ease-in-out';
  
  const variants = {
    primary: 'bg-active hover:bg-white text-black',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white',
    gradient: 'bg-neonBlueGradient text-white hover:bg-whiteGradient hover:text-black',
    outline: 'border-2 border-active hover:bg-active hover:text-black text-active',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;