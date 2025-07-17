import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaHome, FaGamepad, FaTrophy, FaUsers, FaUser, FaWallet } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  // Define all possible navigation items
  const allNavItems = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    { path: '/games', icon: <FaGamepad />, label: 'Games' },
    { path: '/tournaments', icon: <FaTrophy />, label: 'Tournaments' },
    { path: '/wallet', icon: <FaWallet />, label: 'Wallet' },
    { path: '/community', icon: <FaUsers />, label: 'Community' },
    { path: '/profile', icon: <FaUser />, label: 'Profile' },
  ];

  // Get current path and find active item
  const currentPath = location.pathname;
  const activeIndex = allNavItems.findIndex(item => currentPath.startsWith(item.path));
  const activeItem = allNavItems[activeIndex >= 0 ? activeIndex : 0];

  // Always show exactly 5 items: 2 before active, active, and 2 after
  const navItems = useMemo(() => {
    const result = [];
    const activePos = Math.min(Math.max(2, activeIndex), allNavItems.length - 3);
    
    // Add items before active
    for (let i = Math.max(0, activePos - 2); i < activePos; i++) {
      if (i >= 0 && i < allNavItems.length) {
        result.push(allNavItems[i]);
      }
    }
    
    // Add active item
    if (activeIndex >= 0) {
      result.push(allNavItems[activeIndex]);
    }
    
    // Add items after active
    const remaining = 5 - result.length;
    for (let i = 1; i <= remaining; i++) {
      const nextIndex = activeIndex + i;
      if (nextIndex < allNavItems.length) {
        result.push(allNavItems[nextIndex]);
      }
    }
    
    // If we still don't have 5 items, add more from the start
    if (result.length < 5) {
      for (let i = 0; i < 5 - result.length; i++) {
        if (i < allNavItems.length) {
          result.unshift(allNavItems[i]);
        }
      }
    }
    
    return result.slice(0, 5); // Ensure exactly 5 items
  }, [currentPath]);

  // Get visible items (all except active)
  const visibleItems = navItems.filter(item => item.path !== activeItem.path);
  const activeItemIndex = navItems.findIndex(item => item.path === activeItem.path);
  const leftItems = visibleItems.slice(0, activeItemIndex);
  const rightItems = visibleItems.slice(activeItemIndex);

  return (
    <>
      {/* Background Blur */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-[#022870] h-11 md:h-16 z-40" />

      {/* Main Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 lg:m-2 md:mx-16 lg:mx-64 rounded-t-lg md:rounded-lg bg-blueHorizontalGradient text-dullBlue z-50 h-11 md:h-14">
        <div className="max-w-3xl mx-auto px-4 relative h-full">

          {/* Grid */}
          <div className="grid grid-cols-5 text-center items-end h-full relative">
            {[...leftItems, null, ...rightItems].map((item, index) =>
              item ? (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-end pb-3 md:pb-4 ${
                    currentPath === item.path ? 'text-yellow-400' : ''
                  }`}
                >
                  {React.cloneElement(item.icon, {
                    className: `text-xl md:text-2xl ${
                      currentPath === item.path ? 'text-yellow-400' : ''
                    }`,
                  })}
                </Link>
              ) : (
                <div key={`center-empty`} className="w-full h-full" />
              )
            )}

            {/* Floating Active Icon */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 md:-top-7 z-10">
              <Link to={activeItem.path} className="flex flex-col items-center">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-blueGradient shadow-lg ring-2 ring-white">
                  {React.cloneElement(activeItem.icon, {
                    className: 'text-yellow-400 text-lg md:text-xl',
                  })}
                </div>
                <span className="text-[10px] md:text-xs mt-1 text-yellow-400 whitespace-nowrap">
                  {activeItem.label}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
