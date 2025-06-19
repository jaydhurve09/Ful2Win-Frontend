import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaHome, FaGamepad, FaTrophy, FaUsers, FaWallet, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-[#022870] h-16 md:h-24">
      </div>
      <nav className="fixed bottom-0 left-0 right-0 lg:m-2 md:my-0 md:mx-16 lg:mx-64 rounded-t-lg md:rounded-lg bg-blueHorizontalGradient text-dullBlue py-2.5 md:py-3 z-50 h-16">
        <div className="max-w-3xl mx-auto px-3">
          {/* Desktop/Tablet View with Logo and Navigation */}
          <div className="hidden md:flex items-center justify-between relative">
            {/* Left Navigation Links */}
            <div className="flex-1 flex justify-between max-w-[280px]">
              {[
                { path: '/', icon: <FaHome className="text-xl mb-0.5" />, label: 'Home' },
                { path: '/games', icon: <FaGamepad className="text-xl mb-0.5" />, label: 'Games' },
                { path: '/tournaments', icon: <FaTrophy className="text-xl mb-0.5" />, label: 'Tournaments' }
              ].map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`flex flex-col items-center text-xs px-2 ${location.pathname === item.path ? 'text-active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Centered Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-7">
              <div className="w-16 h-16 rounded-xl border-2 border-dullBlue flex items-center justify-center bg-blueGradient">
                <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />
              </div>
            </div>

            {/* Right Navigation Links */}
            <div className="flex-1 flex justify-between max-w-[280px]">
              {[
                { path: '/community', icon: <FaUsers className="text-xl mb-0.5" />, label: 'Community' },
                { path: '/wallet', icon: <FaWallet className="text-xl mb-0.5" />, label: 'Wallet' },
                { path: '/profile', icon: <FaUser className="text-xl mb-0.5" />, label: 'Profile' }
              ].map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`flex flex-col items-center text-xs px-2 ${location.pathname === item.path ? 'text-active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Navigation Links - Mobile View */}
          <div className="md:hidden grid grid-cols-6 gap-0.5 px-1 h-full items-center">
            {[
              { path: '/', icon: <FaHome className="text-base mb-0.5" />, label: 'Home' },
              { path: '/games', icon: <FaGamepad className="text-base mb-0.5" />, label: 'Games' },
              { path: '/tournaments', icon: <FaTrophy className="text-base mb-0.5" />, label: 'Tournaments' },
              { path: '/community', icon: <FaUsers className="text-base mb-0.5" />, label: 'Community' },
              { path: '/wallet', icon: <FaWallet className="text-base mb-0.5" />, label: 'Wallet' },
              { path: '/profile', icon: <FaUser className="text-base mb-0.5" />, label: 'Profile' }
            ].map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex flex-col items-center text-[9px] px-0.5 text-center leading-none ${location.pathname === item.path ? 'text-active' : ''}`}
              >
                {item.icon}
                <span className="whitespace-nowrap overflow-hidden text-ellipsis w-full">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Links - Hidden on Desktop */}
        </div>
      </nav>
    </>
  );
}

export default Navbar
