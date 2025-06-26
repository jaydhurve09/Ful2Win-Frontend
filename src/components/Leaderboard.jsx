import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import BackgroundBubbles from '../components/BackgroundBubbles';

const leaderboardData = [
  { id: 1, name: 'Johari B.', balance: '₹42,320.33', prize: '₹1,100' },
  { id: 2, name: 'Liam Ross', balance: '₹8,794.68', prize: '₹850' },
  { id: 3, name: 'Christopher Allen', balance: '₹7,456.96', prize: '₹625' },
  { id: 4, name: 'Michael Wilson', balance: '₹4,935', prize: '₹425' },
  { id: 5, name: 'Darryl H.', balance: '₹4,000.10', prize: '₹350' },
  { id: 6, name: 'Cooper Williams', balance: '₹3,377.31', prize: '₹300' },
  { id: 7, name: 'Noah Carter', balance: '₹2,744.69', prize: '₹250' },
  { id: 8, name: 'Dylan Price', balance: '₹2,400.34', prize: '₹225' },
  { id: 9, name: 'Vladlen S.', balance: '₹2,096.59', prize: '₹200' },
  { id: 10, name: 'Ahsan S.', balance: '₹2,057.47', prize: '₹175' },
  { id: 11, name: 'David Lewis', balance: '₹1,744.66', prize: '₹150' },
  { id: 12, name: 'Caleb Roberts', balance: '₹1,475.34', prize: '₹125' },
];

const Leaderboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen bg-blueGradient text-white px-4 py-4 overflow-hidden">
      <BackgroundBubbles />

      <div className="relative z-10 max-w-md mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-white text-lg mr-3">
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold">Leaderboard</h1>
            <p className="text-sm text-white/70">Top Tournament Players</p>
          </div>
        </div>

        {/* Table Header */}
        <div className="text-xs text-white/70 font-semibold px-2 mb-2 flex justify-between">
          <div className="w-1/12">#</div>
          <div className="w-5/12">Player</div>
          <div className="w-3/12 text-right">Balance</div>
          <div className="w-3/12 text-right">Prize Won</div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-4">
          {leaderboardData.map((player, index) => (
            <div
              key={player.id}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 flex justify-between items-center hover:scale-[1.01] transition"
            >
              <div className="w-1/12 text-sm text-white/80 font-semibold">#{index + 1}</div>
              <div className="w-5/12">
                <p className="text-sm text-white font-medium truncate">{player.name}</p>
              </div>
              <div className="w-3/12 text-right text-green-300 font-semibold text-sm">{player.balance}</div>
              <div className="w-3/12 text-right text-lime-400 font-semibold text-sm">{player.prize}</div>
            </div>
          ))}

          {/* Your Own Player Card - matches the design */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 flex justify-between items-center hover:scale-[1.01] transition mt-4">
            <div className="w-1/12 text-sm text-white/80 font-semibold">–</div>
            <div className="w-5/12">
              <p className="text-sm text-white font-medium truncate">ME</p>
              <p className="text-xs text-white/50">No match played yet</p>
            </div>
            <div className="w-3/12 text-right text-white/40 font-semibold text-sm">—</div>
            <div className="w-3/12 text-right text-white/40 font-semibold text-sm">—</div>
          </div>
        </div>

        <p className="text-center text-xs text-white/50 mt-3">Compete daily to reach the top!</p>
      </div>
    </div>
  );
};

export default Leaderboard;
