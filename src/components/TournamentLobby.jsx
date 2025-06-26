import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCoins, FaRupeeSign } from 'react-icons/fa';
import BackgroundBubbles from '../components/BackgroundBubbles';

const TournamentLobby = () => {
  const navigate = useNavigate();

  const cashTournaments = [
    { id: 1, entryFee: 10, prizePool: 100, players: 15, maxPlayers: 20, timeLeft: '1m 20s' },
    { id: 2, entryFee: 25, prizePool: 300, players: 30, maxPlayers: 50, timeLeft: '2m 10s' },
  ];

  const coinTournaments = [
    { id: 3, entryFee: 100, prizePool: 3000, players: 45, maxPlayers: 50, timeLeft: '0m 30s' },
    { id: 4, entryFee: 50, prizePool: 1500, players: 28, maxPlayers: 40, timeLeft: '1m 10s' },
  ];

  const TournamentCard = ({ entryFee, prizePool, players, maxPlayers, timeLeft, type }) => (
    <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-xl px-4 py-4 shadow-md">
      <div className="flex justify-between items-center mb-2 text-sm text-white/80">
        <div className="flex flex-col">
          <span className="text-xs text-white/50">Entry Fee</span>
          <span className="flex items-center gap-1 font-medium text-yellow-300">
            {type === 'cash' ? <FaRupeeSign className="text-xs" /> : <FaCoins className="text-xs" />}
            {entryFee}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-white/50">Prize</span>
          <span className="flex items-center gap-1 font-medium text-green-300">
            {type === 'cash' ? <FaRupeeSign className="text-xs" /> : <FaCoins className="text-xs" />}
            {prizePool}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-white/50">Players</span>
          <span className="text-blue-300 font-medium">{players}/{maxPlayers}</span>
        </div>
      </div>

      {/* Dual Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          className={`w-1/2 py-1.5 rounded-full font-semibold text-sm transition
            ${type === 'cash' ? 'bg-green-400 hover:bg-green-500 text-black' : 'bg-yellow-400 hover:bg-yellow-500 text-black'}`}
        >
          Join Tournament
        </button>

        <button
          onClick={() => navigate('/leaderboard_singlegame')}
          className="w-1/2 py-1.5 rounded-full font-semibold text-sm bg-white/20 hover:bg-white/30 text-white border border-white/20"
        >
          Leaderboard
        </button>
      </div>

      <p className="text-center text-xs text-white/60 mt-1">{timeLeft} left</p>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-blueGradient text-white px-4 py-4">
      <BackgroundBubbles />

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-white text-lg mr-3">
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold">Snake & Ladder</h1>
            <p className="text-sm text-white/70">Tournament Lobby</p>
          </div>
        </div>

        {/* Game Image */}
        <div className="w-full mb-4 rounded-xl overflow-hidden border border-white/10 shadow-md">
          <img
            src="https://cdn.pixabay.com/photo/2020/05/01/06/05/snake-and-ladder-5117207_1280.jpg"
            alt="Snake and Ladder"
            className="w-full h-40 object-cover"
          />
        </div>

        {/* User Balances */}
        <div className="mb-6 flex justify-between text-sm px-1">
          <div className="flex items-center gap-1">
            <FaRupeeSign className="text-yellow-300" />
            <span className="text-white/90 font-medium">1246.00</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCoins className="text-yellow-300" />
            <span className="text-white/90 font-medium">2560 Coins</span>
          </div>
        </div>

        {/* Scrollable Tournament List */}
        <div className="max-h-[calc(100vh-320px)] overflow-y-auto space-y-6 pr-1 pb-4">
          {/* Cash Tournaments */}
          <div>
            <h2 className="text-white/90 text-base font-semibold mb-2">Cash Tournaments</h2>
            <div className="space-y-4">
              {cashTournaments.map((t) => (
                <TournamentCard
                  key={t.id}
                  {...t}
                  type="cash"
                />
              ))}
            </div>
          </div>

          {/* Coin Tournaments */}
          <div>
            <h2 className="text-white/90 text-base font-semibold mt-4 mb-2">Coin Tournaments</h2>
            <div className="space-y-4">
              {coinTournaments.map((t) => (
                <TournamentCard
                  key={t.id}
                  {...t}
                  type="coin"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentLobby;
