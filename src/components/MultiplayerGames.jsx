import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import snakeLadder from '../assets/snake-and-ladder.png';
import bladeRunner from '../assets/blade-runner.png';
import templeRun from '../assets/temple-run.png';

const MultiplayerGames = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [rowHeight, setRowHeight] = useState(null);
  const gridRef = useRef(null);

  const games = [
    { id: 1, name: 'Snake & Ladder', path: '/comingsoon', image: snakeLadder },
    { id: 2, name: 'Blade Runner', path: '/comingsoon', image: bladeRunner },
    { id: 3, name: 'Temple Run', path: '/comingsoon', image: templeRun },
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
      className="w-full text-white px-4 flex items-start justify-start rounded-tr-[32px]"
      style={{
        minHeight: '140px',
        paddingBottom: '40px',
        background: 'linear-gradient(to bottom,rgba(32, 28, 70, 0.75) 50%, rgba(37, 33, 79, 0.34) 75%, rgba(48, 43, 99, 0) 100%)',
      }}
    >
      <div className="w-full pt-4">
        <div
          ref={gridRef}
          className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 transition-all duration-300 overflow-hidden"
          style={{
            maxHeight: !expanded && rowHeight ? `${rowHeight}px` : 'none',
          }}
        >
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => navigate(game.path)}
              className="bg-white/10 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95 relative"
              style={{ border: '3px solid #AECBF9' }}
            >
              <div className="shine-overlay"></div>
              <div className="w-full aspect-square">
                <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
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

export default MultiplayerGames;
