import React from 'react';
import { useNavigate } from 'react-router-dom';
import controllerIcon from '../assets/Multiplayer.png';
import snakeLadder from '../assets/snake-and-ladder.png';
import bladeRunner from '../assets/blade-runner.png';
import templeRun from '../assets/temple-run.png';
import borderBackground from '../assets/Border.png';

const MultiplayerGames = () => {
  const navigate = useNavigate();

  const games = [
    { id: 1, name: 'Snake & Ladder', path: '/game-lobby', image: snakeLadder },
    { id: 2, name: 'Blade Runner', path: '/comingsoon', image: bladeRunner },
    { id: 3, name: 'Temple Run', path: '/comingsoon', image: templeRun },
  ];

  const totalColumns = 4;
  const placeholders = totalColumns - games.length;

  return (
    <section
      className="w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${borderBackground})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      }}
    >
      <div
        className="max-w-full mx-auto"
        style={{
          paddingTop: 'clamp(20px, 3vw, 36px)',
          paddingBottom: 'clamp(20px, 3.5vw, 36px)',
          paddingLeft: 'clamp(45px, 7.5vw, 105px)',
          paddingRight: 'clamp(40px, 7vw, 100px)',
        }}
      >
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <img src={controllerIcon} alt="icon" className="w-5 h-5" />
            <h2
              className="font-bold text-white font-orbitron italic leading-tight"
              style={{
                fontSize: 'clamp(14px, 2.5vw, 24px)',
              }}
            >
              Multiplayer Games
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(game.path)}
                className="bg-white/10 border border-white/20 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <div className="w-full aspect-square">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
            {Array.from({ length: placeholders }).map((_, index) => (
              <div key={`placeholder-${index}`} className="invisible" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiplayerGames;
