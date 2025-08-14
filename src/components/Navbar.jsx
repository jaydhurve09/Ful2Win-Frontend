import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaHome, FaGamepad, FaTrophy, FaUsers, FaUser, FaWallet } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  // Define base navigation items (without wallet)
  const baseNavItems = [
    { path: '/', icon: <FaHome />, label: 'Home', priority: 1 },
    { path: '/games', icon: <FaGamepad />, label: 'Games', priority: 2 },
    { path: '/tournaments', icon: <FaTrophy />, label: 'Tournaments', priority: 3 },
    { path: '/community' , icon: <FaUsers />, label: 'Community', priority: 4 },
    { path: '/profile', icon: <FaUser />, label: 'Profile', priority: 5 },
  ];
  
  // Add wallet to nav items only when on wallet page, replacing the lowest priority item
  const allNavItems = location.pathname.startsWith('/wallet')
    ? [
        ...baseNavItems.slice(0, -1), // All items except the last one
        { path: '/wallet', icon: <FaWallet />, label: 'Wallet', priority: 4.5 } // Insert with priority between 4 and 5
      ].sort((a, b) => a.priority - b.priority) // Re-sort to maintain order
    : baseNavItems;

  // Always show exactly 5 icons:
  // - Current active route (if in navbar)
  // - First 4 highest priority items (excluding current route)
  const currentPath = location.pathname;
  const currentItem = allNavItems.find(item => item.path === currentPath);
  
  // Get items excluding current one, sorted by priority
  const otherItems = allNavItems
    .filter(item => item.path !== currentPath)
    .sort((a, b) => a.priority - b.priority);
  
  // Take first 4 highest priority items
  const topItems = otherItems.slice(0, 4);
  
  // Combine current item (if in navbar) with top items, then sort by original order
  let navItems = currentItem 
    ? [currentItem, ...topItems]
    : [...topItems, allNavItems[allNavItems.length - 1]]; // If current route not in navbar, ensure we have 5 items
    
  // Ensure we have exactly 5 items
  navItems = navItems.slice(0, 5);
  
  // Sort items to maintain consistent order based on priority
  navItems.sort((a, b) => a.priority - b.priority);

  const activeIndex = navItems.findIndex(item => item.path === currentPath);
  // If no active route or route not in navbar, make community active by default
  const activeItem = activeIndex !== -1 
    ? navItems[activeIndex]
    : navItems.find(item => item.path === '/community') || navItems[2];

  const visibleItems = navItems.filter((_, index) => index !== activeIndex);
  const leftItems = visibleItems.slice(0, 2);
  const rightItems = visibleItems.slice(2, 4); // Ensure we only take 4 items total for 5 with active

  return (
    <>
      {/* Background Blur */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-[#000B33] h-11 md:h-16 z-40" />

      {/* Main Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 lg:m-2 md:mx-16 lg:mx-64 rounded-t-lg md:rounded-lg bg-gradient-to-b from-[#1565C0] to-[#0A2472] text-dullBlue z-50 h-12 md:h-14">
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
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-gradient-to-b from-[#0B33FF] to-[#000B33] shadow-lg ring-2 ring-white">
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
