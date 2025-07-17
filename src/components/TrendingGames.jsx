import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import flappyball from '../assets/Flappy-Ball.png';
import colorsmash from '../assets/colorsmash.png';
import matchmerge from '../assets/MatchMerge.png';
import eggcatcher from '../assets/EggCatcher.png';
import gravityhop from '../assets/GravityHop.png';
import api from '../services/api.js'; // Assuming you have an api.js file for API calls

const TrendingGames = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [rowHeight, setRowHeight] = useState(null);
  const [games, setGames] = useState([]);
  const gridRef = useRef(null);

  // const games = [
  //   { id: 1, name: 'Flappy Ball', path: '/games', image: flappyball },
  //   { id: 2, name: 'Color Smash', path: '/games', image: colorsmash },
  //   { id: 3, name: 'Match Merge', path: '/games', image: matchmerge },
  //   { id: 4, name: 'Egg Catcher', path: '/games', image: eggcatcher },
  //   { id: 5, name: 'Gravity Hop', path: '/games', image: gravityhop },
  // ];
 const fetchGames = async () => {
      try {
        
        const response = await api.get('/games', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        });

        let gamesData = [];
        if (response.data?.success !== undefined) {
          gamesData = Array.isArray(response.data.data) ? response.data.data : [];
        } else if (Array.isArray(response.data)) {
          gamesData = response.data;
        } else if (response.data?.games) {
          gamesData = Array.isArray(response.data.games) ? response.data.games : [];
        }

        setGames(gamesData);
      } catch (err) {
        let errorMsg = 'Failed to load games. Please try again later.';
        if (err.response?.data?.error) {
          errorMsg = `Server error: ${err.response.data.error}`;
        } else if (err.message) {
          errorMsg = `Error: ${err.message}`;
        }
       console.log(errorMsg);
        setGames([]);
      } 
    };

  useEffect(() => {
    const checkWrapAndRowHeight = () => {
      if (!gridRef.current) return;

      const children = Array.from(gridRef.current.children);
      if (!children.length) return;

      const firstRowTop = children[0].getBoundingClientRect().top;
      const rowTops = children.map(child => child.getBoundingClientRect().top);
      const rows = [...new Set(rowTops)];

      const firstRowHeight =
        children[0].getBoundingClientRect().bottom -
        children[0].getBoundingClientRect().top;

      setRowHeight(firstRowHeight + 12); // 12px = gap-3

      setShowButton(rows.length > 1);
    };
   fetchGames();
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
              key={game._id}
              onClick={() => navigate(`/game-lobby/${game._id}`)}
              className="bg-white/10 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95 relative"
              style={{ border: '3px solid #AECBF9' }}
            >
              <div className="shine-overlay"></div>
              <div className="w-full aspect-square">
                <img
                  src={game.assets?.thumbnail || game.image}
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
            >
              {expanded ? 'See Less' : 'See More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingGames;
