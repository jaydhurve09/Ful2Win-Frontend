import React, { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { FaTrophy } from 'react-icons/fa';
import ludo from '../assets/ludo.png';
import rummy from '../assets/rummy.png';
import carrom from '../assets/carrom.png';
import BackgroundBubbles from '../components/BackgroundBubbles';

const LeaderboardFullScreen = ({ mode, leaderboard, playerName }) => (
  <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900/90 to-purple-900/90 text-white p-6 overflow-y-auto">
    <h2 className="text-center text-2xl font-bold mb-4">🏆 Leaderboard</h2>
    <div className="max-w-md mx-auto">
      <div className="grid grid-cols-3 font-semibold border-b border-white/10 pb-2 mb-2">
        <span>Rank</span>
        <span>Player</span>
        <span>Prize</span>
      </div>
      {leaderboard.map(({ rank, name, winnings }) => (
        <div
          key={rank}
          className={`grid grid-cols-3 py-1.5 text-sm border-b border-white/5 transition-all duration-150 ${
            name === playerName ? 'border border-white rounded text-yellow-300 font-bold' : 'text-white'
          }`}
        >
          <span>{rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}</span>
          <span>{name}</span>
          <span className="text-green-400 font-semibold">{winnings} {mode}</span>
        </div>
      ))}
    </div>
  </div>
);

const Tournaments = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [tournamentType, setTournamentType] = useState('coin');
  const [showLeaderboardFull, setShowLeaderboardFull] = useState(false);
  const [expandedLeaderboard, setExpandedLeaderboard] = useState(null);
  const [showGameScreen, setShowGameScreen] = useState(false);

  const playerName = 'You';

  const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'live', label: 'Live' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
  ];

  const tournaments = [
    { id: 1, name: 'Ludo Championship', image: ludo, entryFee: 100, prizePool: 3000, players: '45/50', timeLeft: '0m left', status: 'live', type: 'ludo', mode: 'coin' },
    { id: 2, name: 'Rummy Masters', image: rummy, entryFee: 200, prizePool: 5000, players: '32/60', timeLeft: '0m left', status: 'live', type: 'rummy', mode: 'cash' },
    { id: 3, name: 'Carrom Championship', image: carrom, entryFee: 150, prizePool: 4000, players: '40/40', timeLeft: '0m left', status: 'completed', type: 'carrom', mode: 'coin' },
    { id: 4, name: 'Ludo Championship', image: ludo, entryFee: 100, prizePool: 3000, players: '45/50', timeLeft: '0m left', status: 'completed', type: 'ludo', mode: 'cash' },
    { id: 5, name: 'Ludo Championship', image: ludo, entryFee: 100, prizePool: 3000, players: '45/50', timeLeft: '1h 20m left', status: 'upcoming', type: 'ludo', mode: 'coin' },
    { id: 6, name: 'Rummy Masters', image: rummy, entryFee: 100, prizePool: 3000, players: '45/50', timeLeft: '1h 20m left', status: 'upcoming', type: 'rummy', mode: 'cash' },
    { id: 7, name: 'Ludo Championship', image: ludo, entryFee: 100, prizePool: 3000, players: '45/50', timeLeft: '0m left', status: 'completed', type: 'ludo', mode: 'cash' },
  ];

  const dummyLeaderboard = [
    { rank: 1, name: 'Alpha', winnings: 1500 },
    { rank: 2, name: 'Bravo', winnings: 1000 },
    { rank: 3, name: 'Charlie', winnings: 800 },
    { rank: 4, name: 'You', winnings: 400 },
    { rank: 5, name: 'Delta', winnings: 400 },
  ];

  const getFilteredTournaments = () => tournaments.filter(t => activeTab === 'all' || t.status === activeTab);

  const handleJoinTournament = () => {
    setShowGameScreen(true);
    setTimeout(() => {
      setShowGameScreen(false);
      setShowLeaderboardFull(true);
    }, 10000);
  };

  return (
    <div className="bg-blueGradient text-white min-h-screen pb-24 relative">
      <BackgroundBubbles />
      {showLeaderboardFull && (
        <LeaderboardFullScreen mode={tournamentType} leaderboard={dummyLeaderboard} playerName={playerName} />
      )}

      {showGameScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-white text-3xl font-bold">
          Game Playing... (Snake & Ladder)
        </div>
      )}

      <div className="bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex md:hidden gap-2 mb-6 mt-16">
            <Button variant={tournamentType === 'coin' ? 'primary' : 'gradient'} onClick={() => setTournamentType('coin')} className="rounded-full text-sm px-4 py-2 flex-1">Coin Tournaments</Button>
            <Button variant={tournamentType === 'cash' ? 'primary' : 'gradient'} onClick={() => setTournamentType('cash')} className="rounded-full text-sm px-4 py-2 flex-1">Cash Tournaments</Button>
          </div>

          <div className="flex md:hidden gap-2 mb-6 overflow-x-auto">
            {statusTabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id ? 'bg-yellow-400 text-black rounded-full' : 'text-gray-300 hover:text-white'}`}>{tab.label}</button>
            ))}
          </div>

          <div className="md:hidden space-y-4">
            {getFilteredTournaments().map((tournament) => (
              <div key={tournament.id} className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4 relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img src={tournament.image} alt={tournament.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{tournament.name}</h3>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <div><p className="text-gray-400">Entry Fee</p><p className="text-yellow-400 font-medium">{tournament.entryFee}</p></div>
                      <div><p className="text-gray-400">Prize Pool</p><p className="text-yellow-400 font-medium">{tournament.prizePool}</p></div>
                      <div>
                        <p className="text-gray-400">Players</p>
                        <p className="text-yellow-400 font-medium flex items-center gap-2">
                          {tournament.players}
                          <FaTrophy className="cursor-pointer" onClick={() => setExpandedLeaderboard(expandedLeaderboard === tournament.id ? null : tournament.id)} />
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Button onClick={handleJoinTournament} className="text-sm py-2 px-4 bg-yellow-400 text-black font-semibold rounded w-full">Join Tournament</Button>
                      <p className="text-center text-xs text-gray-400 mt-1">{tournament.timeLeft}</p>
                    </div>
                    {expandedLeaderboard === tournament.id && (
                      <div className="bg-[#1517565f] border border-blue-700 rounded-lg px-4 py-3 mt-3 text-sm text-white shadow-xl">
                        <div className="grid grid-cols-3 font-semibold border-b border-white/10 pb-2 mb-2">
                          <span>Rank</span>
                          <span>Player</span>
                          <span>Prize</span>
                        </div>
                        {dummyLeaderboard.map(({ rank, name, winnings }) => (
                          <div
                            key={rank}
                            className={`grid grid-cols-3 py-1.5 text-sm border-b border-white/5 ${
                              name === playerName ? 'border border-white rounded text-yellow-300 font-bold' : 'text-white'
                            }`}
                          >
                            <span>{rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}</span>
                            <span>{name}</span>
                            <span className="text-green-400 font-semibold">{winnings} {tournament.mode}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

export default Tournaments;