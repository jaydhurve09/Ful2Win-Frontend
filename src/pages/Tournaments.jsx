import React, { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import ludo from '../assets/ludo.png';
import rummy from '../assets/rummy.png';
import carrom from '../assets/carrom.png';

const Tournaments = () => {
  const [activeTab, setActiveTab] = useState('all');

  const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'live', label: 'Live' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
  ];

  // Filter tournaments based on active tab
  const getFilteredTournaments = () => {
    if (activeTab === 'all') return tournaments;
    return tournaments.filter(tournament => tournament.status === activeTab);
  };

  const tournaments = [
    {
      id: 1,
      name: 'Ludo Championship',
      image: ludo,
      entryFee: 100,
      prizePool: 3000,
      players: '45/50',
      timeLeft: '1h 20m left',
      status: 'live',
      type: 'ludo'
    },
    {
      id: 2,
      name: 'Rummy Masters',
      image: rummy,
      entryFee: 200,
      prizePool: 5000,
      players: '32/60',
      timeLeft: '2h 45m left',
      status: 'upcoming',
      type: 'rummy'
    },
    {
      id: 3,
      name: 'Carrom Championship',
      image: carrom,
      entryFee: 150,
      prizePool: 4000,
      players: '40/40',
      timeLeft: '0m left',
      status: 'completed',
      type: 'carrom'
    }
  ];

  return (
    <div className="bg-bgColor text-white min-h-screen pb-24">
      <div className="bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Tournament Type Tabs - Desktop only */}
          <div className="hidden md:flex gap-4 mb-6">
            <Button
              variant={activeTab === 'coin' ? 'primary' : 'gradient'}
              onClick={() => setActiveTab('coin')}
              className="rounded-full"
            >
              Coin Tournaments
            </Button>
            <Button
              variant={activeTab === 'cash' ? 'primary' : 'gradient'}
              onClick={() => setActiveTab('cash')}
              className="rounded-full"
            >
              Cash Tournaments
            </Button>
          </div>

          {/* Tournament Type Tabs - Mobile */}
          <div className="flex md:hidden gap-2 mb-6 mt-16">
            <Button
              variant={activeTab === 'coin' ? 'primary' : 'gradient'}
              onClick={() => setActiveTab('coin')}
              className="rounded-full text-sm px-4 py-2 flex-1"
            >
              Coin Tournaments
            </Button>
            <Button
              variant={activeTab === 'cash' ? 'primary' : 'gradient'}
              onClick={() => setActiveTab('cash')}
              className="rounded-full text-sm px-4 py-2 flex-1"
            >
              Cash Tournaments
            </Button>
          </div>

          {/* Status Tabs - Desktop */}
          <div className="hidden md:flex gap-6 mb-8">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-active text-black rounded-full px-6' 
                    : 'text-dullBlue hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Tabs - Mobile */}
          <div className="flex md:hidden gap-2 mb-6 overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-yellow-400 text-black rounded-full' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tournament Cards - Desktop (unchanged) */}
          <div className="hidden md:grid md:grid-cols-2 gap-4">
            {getFilteredTournaments().map((tournament) => (
              <div key={tournament.id} className="bg-gradient-to-br from-gray-800/10 to-black/10 backdrop-blur-lg border border-white/30 rounded-xl p-6">
                <div className="flex gap-6">
                  <div className="w-2/5">
                    <img src={tournament.image} alt={tournament.name} className="w-full aspect-square rounded-lg object-cover" />
                  </div>
                  <div className="w-3/5">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{tournament.name}</h3>
                      {tournament.status === 'live' && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">LIVE</span>
                      )}
                      {tournament.status === 'completed' && (
                        <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-md font-medium">COMPLETED</span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-300">
                      <div>
                        <p>Entry Fee</p>
                        <p className="text-yellow-500 font-medium">{tournament.entryFee} Coins</p>
                      </div>
                      <div>
                        <p>Prize Pool</p>
                        <p className="text-yellow-500 font-medium">{tournament.prizePool} Coins</p>
                      </div>
                      <div>
                        <p>Players</p>
                        <p className="text-yellow-500 font-medium">{tournament.players}</p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      fullWidth
                      className="mb-2"
                    >
                      Join Tournament
                    </Button>
                    <p className="text-center text-sm text-gray-400">{tournament.timeLeft}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tournament Cards - Mobile (new layout) */}
          <div className="md:hidden space-y-4">
            {getFilteredTournaments().map((tournament) => (
              <div key={tournament.id} className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4 relative overflow-hidden">
                {/* Status Badge */}
                {tournament.status === 'live' && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                    LIVE
                  </div>
                )}
                {tournament.status === 'completed' && (
                  <div className="absolute top-3 right-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                    COMPLETED
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {/* Game Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={tournament.image} alt={tournament.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Tournament Info */}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{tournament.name}</h3>
                    
                    {/* Stats Row */}
                    <div className="flex justify-between text-sm text-gray-300 mb-3">
                      <div>
                        <span className="text-gray-400">Entry Fee</span>
                        <p className="text-yellow-400 font-medium">{tournament.entryFee} Coins</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Prize Pool</span>
                        <p className="text-yellow-400 font-medium">{tournament.prizePool} Coins</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Players</span>
                        <p className="text-yellow-400 font-medium">{tournament.players}</p>
                      </div>
                    </div>

                    {/* Join Button */}
                    <Button
                      variant="primary"
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg mb-2"
                    >
                      Join Tournament
                    </Button>

                    {/* Time Left */}
                    <p className="text-center text-xs text-gray-400">{tournament.timeLeft}</p>
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