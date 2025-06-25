import React from 'react';
import { useNavigate } from 'react-router-dom';
import callBreak from '../assets/call-break.png';
import rummy from '../assets/rummy.png';
import mazeRunner from '../assets/maze-runner.png';
import poker from '../assets/poker.png';
import ludo from '../assets/ludo.png';
import colorsmash from '../assets/colorsmash.png';
import flappyball from '../assets/Flappy-Ball.png';

const TrendingGames = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      name: 'Flappy Ball',
      path: '/flappyball',
      image: flappyball,
      description: 'Play the ball game',
      className: 'bg-gray-800/50',
      titleSize: 'text-lg',
      padding: 'p-3',
      descSize: 'text-sm'
    },
    {
      id: 2,
      name: 'Color Smash',
      path: '/colorsmash',
      image: colorsmash,
      description: 'Master the art of color smash',
      className: 'bg-gray-800',
      titleSize: 'text-xl',
      padding: 'p-4',
      descSize: ''
    },
    {
      id: 3,
      name: 'Maze Runner',
      path: '/comingsoon',
      image: mazeRunner,
      description: 'Navigate through challenging mazes',
      className: 'bg-gray-800',
      titleSize: 'text-xl',
      padding: 'p-4',
      descSize: ''
    },
    {
      id: 4,
      name: 'Poker',
      path: '/comingsoon',
      image: poker,
      description: 'Test your poker face',
      className: 'bg-gray-800/50',
      titleSize: 'text-lg',
      padding: 'p-3',
      descSize: 'text-sm'
    },
    {
      id: 5,
      name: 'Ludo',
      path: '/comingsoon',
      image: ludo,
      description: 'Family favorite board game',
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
      <h2 className="text-2xl font-bold mb-4 text-pink-200">🔥 Trending Games</h2>
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

export default TrendingGames;
