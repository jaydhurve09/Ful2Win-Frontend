import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Header from './Header';
import Navbar from './Navbar';
import BackgroundBubbles from './BackgroundBubbles';

// Users data with different types for tabs to switch properly
const users = [
  // Coin leaderboard users
  { id: 1, name: 'Isabella', type: 'coin', score: 500 },
  { id: 2, name: 'Alicia', type: 'coin', score: 350 },
  { id: 3, name: 'Greece', type: 'coin', score: 150 },
  { id: 4, name: 'Whitefish664', type: 'coin', score: 90 },
  { id: 5, name: 'sadpanda156', type: 'coin', score: 85 },
  { id: 6, name: 'silverduck65', type: 'coin', score: 70 },
  { id: 7, name: 'Anna34', type: 'coin', score: 68 },

  // Winnings leaderboard users
  { id: 8, name: 'WinnerX', type: 'winnings', score: 780 },
  { id: 9, name: 'Champion', type: 'winnings', score: 620 },
  { id: 10, name: 'Victor', type: 'winnings', score: 450 },
  { id: 11, name: 'AcePlayer', type: 'winnings', score: 400 },
  { id: 12, name: 'ProGamer', type: 'winnings', score: 350 },

  // Game-Wise leaderboard users
  { id: 13, name: 'GameMaster', type: 'gamewise', score: 980 },
  { id: 14, name: 'LevelUp', type: 'gamewise', score: 900 },
  { id: 15, name: 'Speedster', type: 'gamewise', score: 870 },
  { id: 16, name: 'SharpShooter', type: 'gamewise', score: 820 },
  { id: 17, name: 'BossKiller', type: 'gamewise', score: 800 },
];

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState('Coins');

  const getSortedUsers = () => {
    const typeMap = {
      Coins: 'coin',
      Winnings: 'winnings',
      'Game-Wise': 'gamewise',
    };
    const filtered = users.filter(u => u.type === typeMap[activeTab]);
    return filtered.sort((a, b) => b.score - a.score);
  };

  const sortedUsers = getSortedUsers();
  const top3 = sortedUsers.slice(0, 3);
  const rest = sortedUsers.slice(3);

  const getValue = (user) => `${user.score}+`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff] text-white pb-24 overflow-hidden">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

        <div className="pt-20 px-4 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4">LEADERBOARD</h1>

          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-10"> {/* Increased mb here */}
            {['Coins', 'Winnings', 'Game-Wise'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors ${
                  activeTab === tab ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Top 3 Users */}
          <div className="flex justify-center items-end gap-10 mb-10">
            {[1, 0, 2].map((pos) => (
              top3[pos] && (
                <div key={pos} className={`text-center ${pos === 0 ? '-translate-y-6' : ''}`}>
                  <div className="relative mb-2">
                    <div className="w-20 h-20 rounded-full bg-gray-700 border-4 border-blue-300 mx-auto">
                      <FaUser size={36} className="mx-auto mt-4 text-white" />
                    </div>
                    {/* Rank Badge */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 flex items-center justify-center">
                      <span className="text-yellow-300 font-bold text-sm">{pos + 1}</span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold">{top3[pos].name}</div>
                  <div className="text-sm text-white/70">{getValue(top3[pos])}</div>
                </div>
              )
            ))}
          </div>

          {/* 4–10 Users */}
          <div className="bg-white/10 rounded-xl p-4 max-w-md mx-auto space-y-3">
            {rest.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center bg-white/5 p-2 rounded-lg gap-3"
              >
                <div className="text-yellow-300 font-bold w-6 text-center">
                  {index + 4}
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                  <FaUser size={20} />
                </div>
                <div>
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs text-white/60">{getValue(user)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default LeaderboardPage;
