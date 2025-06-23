import React, { useEffect, useState } from 'react';
import BackgroundBubbles from '../components/BackgroundBubbles';
import Navbar from '../components/Navbar';

const TournamentHistory = () => {
  const [tournamentStats, setTournamentStats] = useState(null);
  const [tournamentHistory, setTournamentHistory] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameDetails, setGameDetails] = useState({});
  const [loading, setLoading] = useState(true);

  // Simulate API call
  useEffect(() => {
    setTimeout(() => {
      setTournamentStats({
        wins: 12,
        losses: 8,
        winRate: '60%',
        totalMatches: 20,
        currentStreak: 3,
        favouriteGame: 'Car Racer',
      });

      setTournamentHistory([
        { id: 1, game: 'Car Racer', date: '2025-06-15', time: '3:45 PM', result: 'Win', reward: '₹100' },
        { id: 2, game: 'Match and Merge', date: '2025-06-14', time: '2:15 PM', result: 'Loss' },
        { id: 3, game: 'Bubble Shooter', date: '2025-06-13', time: '4:10 PM', result: 'Win', reward: '🪙80' },
        { id: 4, game: 'Tick Tak Toe', date: '2025-06-12', time: '11:00 AM', result: 'Win', reward: '🪙40' },
        { id: 5, game: 'Snake and Ladder', date: '2025-06-11', time: '5:00 PM', result: 'Loss' },
        { id: 6, game: 'Wack a mole', date: '2025-06-10', time: '1:30 PM', result: 'Win', reward: '₹50' },
      ]);

      setGameDetails({
        'Car Racer': {
          totalMatches: 5,
          bestRank: '1st Place',
          maxTime: '3 mins 00 secs',
          winRate: '60%',
          history: [
            { time: '4:00 PM', date: '2025-06-15', result: 'Win', reward: '₹100' },
            { time: '3:00 PM', date: '2025-06-14', result: 'Loss' },
          ],
        },
        'Bubble Shooter': {
          totalMatches: 4,
          bestRank: '1300 Points',
          maxTime: '4 mins 10 secs',
          winRate: '75%',
          history: [
            { time: '4:10 PM', date: '2025-06-13', result: 'Win', reward: '🪙80' },
          ],
        },
        // add others similarly...
      });

      setLoading(false);
    }, 500);
  }, []);

  const calculateCurrentStreak = (history) => {
    let streak = 0;
    for (const h of history) {
      if (h.result === 'Win') streak++;
      else break;
    }
    return streak;
  };

  if (loading) return <div className="text-center text-white mt-20">Loading history...</div>;

  return (
    <div className="min-h-screen text-white relative overflow-hidden"
         style={{ background: 'linear-gradient(to bottom, #0A2472 0%, #0D47A1 45%, #1565C0 100%)' }}
    >
      <BackgroundBubbles />
      <div className="p-4 text-center text-2xl font-bold">History</div>

      {/* Stat Boxes */}
      <div className="max-w-2xl mx-auto grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 px-4 mb-4">
        {[
          { label: "Wins", value: tournamentStats.wins, color: 'text-green-400' },
          { label: "Losses", value: tournamentStats.losses, color: 'text-red-400' },
          { label: "Win Rate", value: tournamentStats.winRate, color: 'text-yellow-300' },
          { label: "Matches", value: tournamentStats.totalMatches, color: 'text-purple-400' },
          { label: "Streak", value: tournamentStats.currentStreak, color: 'text-blue-300' },
          { label: "Fav Game", value: tournamentStats.favouriteGame, color: 'text-pink-300' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center min-h-[60px]">
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs mt-1 text-center">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Game History */}
      <div className="max-w-2xl mx-auto px-4 pb-24" style={{ height: 'calc(100vh - 300px)', overflowY: 'auto' }}>
        {tournamentHistory.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedGame(item)}
            className="bg-white/10 rounded-xl p-4 mb-3 hover:bg-white/20 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🎮</div>
                <div>
                  <div className="text-sm font-medium">{item.game}</div>
                  <div className="text-xs text-gray-300">{item.date}, {item.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${item.result === 'Win' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.result}
                </div>
                {item.reward && (
                  <div className="text-xs mt-1 text-yellow-300 font-semibold">{item.reward}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Game Modal */}
      {selectedGame && gameDetails[selectedGame.game] && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
            <button onClick={() => setSelectedGame(null)} className="absolute top-2 right-3 text-gray-600">✕</button>
            <div className="mb-4">
              <h3 className="text-xl font-bold">{selectedGame.game}</h3>
              <p className="text-sm text-gray-500">{selectedGame.time}, {selectedGame.date}</p>
            </div>
            <div className="text-sm space-y-2">
              <p><strong>Total Matches:</strong> {gameDetails[selectedGame.game].totalMatches}</p>
              <p><strong>Winning Streak:</strong> {calculateCurrentStreak(gameDetails[selectedGame.game].history)}</p>
              <p><strong>Best Rank:</strong> {gameDetails[selectedGame.game].bestRank}</p>
              <p><strong>Max Duration:</strong> {gameDetails[selectedGame.game].maxTime}</p>
              <p><strong>Win Rate:</strong> {gameDetails[selectedGame.game].winRate}</p>
              <div>
                <p><strong>Played History:</strong></p>
                {gameDetails[selectedGame.game].history.map((h, idx) => (
                  <p key={idx} className="flex justify-between">
                    <span>{h.time}, {h.date}</span>
                    <span className={`${h.result === 'Win' ? 'text-green-900' : 'text-red-900'}`}>
                      {h.result} {h.reward ? `• ${h.reward}` : ''}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 w-full z-10">
        <div className="max-w-2xl mx-auto">
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default TournamentHistory;

