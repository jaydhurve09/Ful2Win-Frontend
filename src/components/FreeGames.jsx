import React, { useState, useEffect, useRef ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import poker from '../assets/poker.png';
import ludo from '../assets/ludo.png';
import carrom from '../assets/carrom.png';
import { Ful2WinContext } from '../context/ful2winContext';

const FreeGames = () => {
  const { games } = useContext(Ful2WinContext);

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [rowHeight, setRowHeight] = useState(null);
  const gridRef = useRef(null);
 const [game, setGame] = useState(null);
  //filter games that type only unlimited
  const fetchedGames = () => {
    const filteredGames = games.filter((game) => game.type === 'Unlimited');
    setGame(filteredGames);
    console.log(filteredGames, "all are filtered games");
    console.log(games.id, "all games from context");
    return filteredGames;
  };
  useEffect(() => {
    fetchedGames();
  }, [games]);
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
  const tournamentId = "127Asfs";
  return (
    <section
      className="w-full text-white px-4 flex items-start justify-start rounded-tr-[32px]"
      style={{
        minHeight: '140px',
        paddingBottom: '0px',
        background: 'linear-gradient(to bottom,rgba(32, 28, 70, 0.75) 50%, rgba(37, 33, 79, 0.34) 75%, rgba(48, 43, 99, 0) 100%)',
      }}
    >
      <div ref={gridRef} className="flex gap-4 flex-wrap w-full">
        {game?.map((g) => (
          <div
            key={g._id}
            onClick={() => navigate(`/gameOn2/${g._id}/${tournamentId}`)}
            className="bg-white/10 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95 relative"
            style={{ border: '3px solid #AECBF9' }}
          >
            <div className="shine-overlay"></div>
            <div className="w-full aspect-square">
              <img src={g.assets?.thumbnail || g.image} alt={g.name} className="w-full h-full object-cover" />
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
    </section>
  );
};

export default FreeGames;
