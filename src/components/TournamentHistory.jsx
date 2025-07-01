import React, { useState } from 'react';
import BackgroundBubbles from '../components/BackgroundBubbles';
import Navbar from '../components/Navbar';

const TournamentHistory = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const tournamentStats = {
    wins: 12,
    losses: 8,
    winRate: '60%',
    totalMatches: 20,
    currentStreak: 3,
    favouriteGame: 'Car Racer'
  };

  const tournamentHistory = [
    { id: 1, game: 'Car Racer', date: '2025-06-15', time: '3:45 PM', result: 'Win' },
    { id: 2, game: 'Match and Merge', date: '2025-06-14', time: '2:15 PM', result: 'Loss' },
    { id: 3, game: 'Bubble Shooter', date: '2025-06-13', time: '4:10 PM', result: 'Win' },
    { id: 4, game: 'Tick Tak Toe', date: '2025-06-12', time: '11:00 AM', result: 'Win' },
    { id: 5, game: 'Snake and Ladder', date: '2025-06-11', time: '5:00 PM', result: 'Loss' },
    { id: 6, game: 'Wack a mole', date: '2025-06-10', time: '1:30 PM', result: 'Win' },
    { id: 7, game: 'Car Racer', date: '2025-06-09', time: '4:00 PM', result: 'Win' },
    { id: 8, game: 'Tick Tak Toe', date: '2025-06-08', time: '2:45 PM', result: 'Loss' }
  ];

  const gameDetails = {
    'Car Racer': {
      totalMatches: 5,
      bestRank: '1st Place',
      maxTime: '3 mins 00 secs',
      winRate: '60%',
      history: [
        { time: '4:00 PM', date: '2025-06-15', result: 'Win' },
        { time: '3:00 PM', date: '2025-06-14', result: 'Loss' },
        { time: '2:30 PM', date: '2025-06-13', result: 'Win' },
        { time: '1:00 PM', date: '2025-06-12', result: 'Win' },
        { time: '11:00 AM', date: '2025-06-11', result: 'Win' }
      ]
    },
    'Match and Merge': {
      totalMatches: 3,
      bestRank: '2nd Place',
      maxTime: '2 mins 30 secs',
      winRate: '33%',
      history: [
        { time: '5:00 PM', date: '2025-06-14', result: 'Loss' },
        { time: '4:00 PM', date: '2025-06-13', result: 'Loss' },
        { time: '2:00 PM', date: '2025-06-12', result: 'Win' }
      ]
    },
    'Bubble Shooter': {
      totalMatches: 4,
      bestRank: '1300 Points',
      maxTime: '4 mins 10 secs',
      winRate: '75%',
      history: [
        { time: '4:10 PM', date: '2025-06-13', result: 'Win' },
        { time: '3:00 PM', date: '2025-06-12', result: 'Win' },
        { time: '1:00 PM', date: '2025-06-11', result: 'Loss' },
        { time: '11:30 AM', date: '2025-06-10', result: 'Win' }
      ]
    },
    'Tick Tak Toe': {
      totalMatches: 3,
      bestRank: 'Champion',
      maxTime: '1 min 50 secs',
      winRate: '67%',
      history: [
        { time: '11:00 AM', date: '2025-06-12', result: 'Win' },
        { time: '3:00 PM', date: '2025-06-11', result: 'Win' },
        { time: '2:45 PM', date: '2025-06-08', result: 'Loss' }
      ]
    },
    'Snake and Ladder': {
      totalMatches: 2,
      bestRank: '2nd Place',
      maxTime: '6 mins 00 secs',
      winRate: '50%',
      history: [
        { time: '5:00 PM', date: '2025-06-11', result: 'Loss' },
        { time: '4:00 PM', date: '2025-06-10', result: 'Win' }
      ]
    },
    'Wack a mole': {
      totalMatches: 3,
      bestRank: '35 Moles',
      maxTime: '2 mins 40 secs',
      winRate: '67%',
      history: [
        { time: '1:30 PM', date: '2025-06-10', result: 'Win' },
        { time: '12:00 PM', date: '2025-06-09', result: 'Loss' },
        { time: '11:00 AM', date: '2025-06-08', result: 'Win' }
      ]
    }
  };

  const calculateCurrentStreak = (history) => {
    let streak = 0;
    for (let i = 0; i < history.length; i++) {
      if (history[i].result === 'Win') {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="min-h-screen w-full text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #0A2472 0%, #0D47A1 45%, #1565C0 100%)' }}
    >
      <BackgroundBubbles />

      <div className="p-4 text-center text-2xl font-bold">History</div>

      <div className="max-w-2xl mx-auto grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 px-4 mb-4">
        {[
          { label: "Wins", value: tournamentStats.wins, color: 'text-green-400' },
          { label: "Losses", value: tournamentStats.losses, color: 'text-red-400' },
          { label: "Win Rate", value: tournamentStats.winRate, color: 'text-yellow-300' },
          { label: "Matches", value: tournamentStats.totalMatches, color: 'text-purple-400' },
          { label: "Winning Streak", value: tournamentStats.currentStreak, color: 'text-blue-300' },
          { label: "Favourite Game", value: tournamentStats.favouriteGame, color: 'text-pink-300' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center shadow-md min-h-[60px]">
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs mt-1 text-center">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 mb-2">
        <h2 className="text-lg font-semibold text-gray-200">Game History</h2>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-24" style={{ height: 'calc(100vh - 300px)', overflowY: 'auto' }}>
        {tournamentHistory.map(item => (
          <div 
            key={item.id} 
            onClick={() => setSelectedGame(item)}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:bg-white/20 cursor-pointer transition-all mb-3 w-full"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl text-yellow-300">🎮</div>
                <div>
                  <div className="text-sm font-medium">{item.game}</div>
                  <div className="text-xs text-gray-300">Last Played: {item.date}, {item.time}</div>
                </div>
              </div>
              <div className={`text-sm font-bold ${item.result === 'Win' ? 'text-green-400' : 'text-red-400'}`}>
                {item.result}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGame && gameDetails[selectedGame.game] && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
            <button 
              onClick={() => setSelectedGame(null)}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
            >✕</button>

            <div className="mb-4">
              <h3 className="text-xl font-bold">{selectedGame.game}</h3>
              <p className="text-sm text-gray-500">Last Played: {selectedGame.time}, {selectedGame.date}</p>
            </div>

            <div className="space-y-2 text-sm leading-6">
              <p><strong>Total Matches:</strong> {gameDetails[selectedGame.game].totalMatches}</p>
              <p><strong>Current Winning Streak:</strong> {calculateCurrentStreak(gameDetails[selectedGame.game].history)} Wins</p>
              <p><strong>Best Rank:</strong> {gameDetails[selectedGame.game].bestRank}</p>
              <p><strong>Max Match Duration:</strong> {gameDetails[selectedGame.game].maxTime}</p>
              <p><strong>Win Rate:</strong> {gameDetails[selectedGame.game].winRate}</p>
              <p><strong>Played History:</strong></p>
              {gameDetails[selectedGame.game].history.map((h, idx) => (
                <p key={idx} className="flex justify-between">
                  <span>{h.time}, {h.date}</span>
                  <span className={h.result === 'Win' ? 'text-green-500' : 'text-red-500'}>{h.result}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-2xl mx-auto">
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default TournamentHistory;
