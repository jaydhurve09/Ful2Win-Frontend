import React from 'react';
import GameLobby from '../components/GameLobby';
import { useNavigate, useLocation } from 'react-router-dom';
import snakeAndLadderImage from '../assets/snake-and-ladder.png';

const GameLobbyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from location state or use defaults
  const game = location.state?.game || { name: 'Snake and Ladders', category: 'Board' };
  const gameImage = location.state?.image || snakeAndLadderImage;

  return (
    <div style={{
      backgroundImage: `url(${gameImage})` || snakeAndLadderImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      backgroundAttachment: 'fixed'
    }}>
      <div className="backdrop-blur-sm bg-black/50 min-h-screen">
        <GameLobby 
          gameTitle={game.name}
          gameImage={gameImage}
          gameCategory={game.category}
          rating={4.2}
          playersCount="4 playing"
          entryFees={{
            classic: "₹10 - ₹50",
            quick: "₹5 - ₹25",
            tournament: "₹20 - ₹100",
            private: "Custom",
          }}
          walletBalance={150}
          onClose={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default GameLobbyPage;
