import React from 'react';
import { toast } from 'react-toastify';
import GameLobby from '../components/GameLobby';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
const GameLobbyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId } = useParams();
  const [game, setGame] = useState({});
  console.log("Game ID from URL:", gameId);
  // Get game data from location state or use defaults
 // const game = location.state?.game || { name: 'Snake and Ladders', category: 'Board' };
  const gameImage = location.state?.image;
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
    const userName = JSON.parse(localStorage.getItem("user"))?.username;
  
    // ✅ Fetch Game Details by ID
    useEffect(() => {
      const fetchGameById = async () => {
        try {
          const response = await api.get(`/games/${gameId}`);
          
          if (response.data && response.data.success) {
            setGame(response.data.data);
          } else {
            setError(response.data?.message || "Game not found");
            toast.error(response.data?.message || "Game not found");
            setTimeout(() => navigate('/api/games'), 2000);
          }
        } catch (err) {
          const errorMessage = err.response?.data?.message || "Failed to load game data";
          setError(errorMessage);
          toast.error(errorMessage);
          console.error('Game fetch error:', err);
          setTimeout(() => navigate('/api/games'), 2000);
        }
      };
  
      if (gameId) {
        fetchGameById();
      } else {
        const errorMsg = "No game ID provided";
        setError(errorMsg);
        toast.error(errorMsg);
        setTimeout(() => navigate('/api/games'), 2000);
      }
    }, [gameId]);
  
  return (
    <div style={{
      backgroundImage: `url(${game.assets?.thumbnail})` || snakeAndLadderImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      backgroundAttachment: 'fixed'
    }}>
      <div className="backdrop-blur-sm bg-black/50 min-h-screen">
        <GameLobby 
          gameTitle={game.name}
          gameImage={game.assets?.thumbnail}
          gameCategory={game.category}
          rating={4.2}
          playersCount="4 playing"
          entryFees={{
            classic: "₹10 - ₹50",
            quick: "₹5 - ₹25",
            tournament: "₹20 - ₹100",
            private: "Custom",
          }}
          gameId={game._id}
          walletBalance={150}
          onClose={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default GameLobbyPage;
