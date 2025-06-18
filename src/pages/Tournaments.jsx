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
          {/* Tournament Type Tabs */}
          <div className="flex gap-4 mb-6">
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

          {/* Status Tabs */}
          <div className="flex gap-6 mb-8">
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

          {/* Tournament Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getFilteredTournaments().map((tournament) => (
              <div key={tournament.id} className="bg-gradient-to-br from-gray-800/10 to-black/10 backdrop-blur-lg border border-white/30 rounded-xl p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  <div className="w-full md:w-2/5">
                    <img src={tournament.image} alt={tournament.name} className="w-full aspect-square rounded-lg object-cover" />
                  </div>
                  <div className="w-full md:w-3/5">
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
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Tournaments;