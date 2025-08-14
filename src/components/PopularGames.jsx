import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import poker from '../assets/poker.png';
import ludo from '../assets/ludo.png';
import carrom from '../assets/carrom.png';

const PopularGames = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [rowHeight, setRowHeight] = useState(null);
  const gridRef = useRef(null);

  const games = [
    { id: 1, name: 'Poker', path: '/comingsoon', image: poker },
    { id: 2, name: 'Ludo', path: '/comingsoon', image: ludo },
    { id: 3, name: 'Carrom', path: '/comingsoon', image: carrom },
  ];

  useEffect(() => {
    const checkWrapAndRowHeight = () => {
      if (!gridRef.current) return;

      const children = Array.from(gridRef.current.children);
      if (!children.length) return;

      const rowTops = children.map(child => child.getBoundingClientRect().top);
      const rows = [...new Set(rowTops)];

      const firstRowHeight =
        children[0].getBoundingClientRect().bottom -
        children[0].getBoundingClientRect().top;

      setRowHeight(firstRowHeight + 12);
      setShowButton(rows.length > 1);
    };

    checkWrapAndRowHeight();
    window.addEventListener('resize', checkWrapAndRowHeight);
    return () => window.removeEventListener('resize', checkWrapAndRowHeight);
  }, []);

  return (
    <section
      className="w-full text-white px-4 flex items-start justify-start rounded-tr-[32px] pt-6"
      style={{
        minHeight: '140px',
        paddingBottom: '0px',
        background: 'transparent',
      }}
    >
      <div className="w-full">
        <div
          ref={gridRef}
          className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 transition-all duration-300"
          style={{
            maxHeight: !expanded && rowHeight ? `${rowHeight}px` : 'none',
            overflow: 'visible',
          }}
        >
          {games.map((game, index) => (
            <div
              key={game.id}
              onClick={() => navigate(game.path)}
              className="cursor-pointer transition-transform hover:scale-105 active:scale-95 relative rounded-xl"
              style={{
                overflow: 'visible',
                border: '3px solid #4ADE80', // green border
                borderRadius: '16px',
              }}
            >
              {/* Number Overlay */}
              <div
                className="absolute -left-2.5 -top-3 font-extrabold text-3xl z-10"
                style={{
                  color: 'white', 
                  fontStyle: 'italic', 
                  WebkitTextStroke: '2px #ffd700', 
                  textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
                }}
              >
                {index + 1}
              </div>

              {/* Game Image */}
              <div className="w-full aspect-square rounded-xl overflow-hidden">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {showButton && (
          <div className="mt-0 flex justify-end">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] text-white/80 underline hover:text-white transition"
              style={{ visibility: 'hidden' }}
            >
              {expanded ? 'See Less' : 'See More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularGames;