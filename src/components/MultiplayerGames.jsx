import React from 'react';
import { useNavigate } from 'react-router-dom';
import snakeLadder from '../assets/snake-and-ladder.png';
import bladeRunner from '../assets/blade-runner.png';
import templeRun from '../assets/temple-run.png';

const MultiplayerGames = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      name: 'Snake & Ladder',
      path: '/game-lobby',
      image: snakeLadder,
      description: 'Classic board game with friends',
      className: 'bg-gray-800/50',
      titleSize: 'text-lg',
      padding: 'p-3',
      descSize: 'text-sm'
    },
    {
      id: 2,
      name: 'Blade Runner',
      path: '/comingsoon',
      image: bladeRunner,
      description: 'Run and slice through obstacles',
      className: 'bg-gray-800',
      titleSize: 'text-xl',
      padding: 'p-4',
      descSize: ''
    },
    {
      id: 3,
      name: 'Temple Run',
      path: '/comingsoon',
      image: templeRun,
      description: 'Endless running adventure',
      className: 'bg-gray-800',
      titleSize: 'text-xl',
      padding: 'p-4',
      descSize: ''
    }
  ];

  const handleGameClick = (path) => {
    navigate(path);
  };

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-pink-200">🎮 Multiplayer Games</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {games.map((game) => (
          <div 
            key={game.id}
            onClick={() => handleGameClick(game.path)}
            className={`${game.className} rounded-lg overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
          >
            <img 
              src={game.image} 
              alt={game.name} 
              className="w-full aspect-square object-cover" 
            />
            <div className={`hidden md:block ${game.padding}`}>
              <h3 className={`${game.titleSize} font-semibold text-pink-200`}>
                {game.name}
              </h3>
              <p className={`text-gray-400 mt-${game.id % 2 === 0 ? '2' : '1'} ${game.descSize}`}>
                {game.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MultiplayerGames;
