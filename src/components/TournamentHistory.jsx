import React, { useState, useEffect } from 'react';
import BackgroundBubbles from '../components/BackgroundBubbles';
import Navbar from '../components/Navbar';
import tournamentService from '../services/tournamentService';

const TournamentHistory = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [tournamentHistory, setTournamentHistory] = useState([]);
  const [stats, setStats] = useState({ wins: 0, losses: 0, winRate: '0%', totalMatches: 0, currentStreak: 0, favouriteGame: '' });
  const [gameDetails, setGameDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const history = await tournamentService.getMyTournamentHistory();
        setTournamentHistory(history);
        // Compute stats and per-game details
        let wins = 0, losses = 0, gamesMap = {}, streak = 0, lastResult = null, favouriteGame = '', maxCount = 0;
        history.forEach(item => {
          if (item.result === 'Win') wins++;
          else if (item.result === 'Loss') losses++;

          // Track streak
          if (lastResult === null || lastResult === 'Win') {
            if (item.result === 'Win') streak++;
            else lastResult = 'Loss';
          }

          // Group by game
          if (!gamesMap[item.game]) gamesMap[item.game] = { totalMatches: 0, wins: 0, losses: 0, bestRank: item.bestRank || '', maxTime: item.maxTime || '', history: [] };
          gamesMap[item.game].totalMatches++;
          if (item.result === 'Win') gamesMap[item.game].wins++;
          if (item.result === 'Loss') gamesMap[item.game].losses++;
          gamesMap[item.game].history.push({ time: item.time, date: item.date, result: item.result });
        });
        // Compute winRate and favouriteGame
        const totalMatches = history.length;
        const winRate = totalMatches > 0 ? `${Math.round((wins / totalMatches) * 100)}%` : '0%';
        Object.entries(gamesMap).forEach(([game, data]) => {
          if (data.totalMatches > maxCount) {
            favouriteGame = game;
            maxCount = data.totalMatches;
          }
          data.winRate = data.totalMatches > 0 ? `${Math.round((data.wins / data.totalMatches) * 100)}%` : '0%';
        });
        setStats({ wins, losses, winRate, totalMatches, currentStreak: streak, favouriteGame });
        setGameDetails(gamesMap);
      } catch (err) {
        // Fallback to mock data if backend fails (e.g., 500 error)
        const mockHistory = [
          { id: 1, game: 'Car Racer', date: '2025-06-15', time: '3:45 PM', result: 'Win' },
          { id: 2, game: 'Match and Merge', date: '2025-06-14', time: '2:15 PM', result: 'Loss' },
          { id: 3, game: 'Bubble Shooter', date: '2025-06-13', time: '4:10 PM', result: 'Win' },
          { id: 4, game: 'Tick Tak Toe', date: '2025-06-12', time: '11:00 AM', result: 'Win' },
          { id: 5, game: 'Snake and Ladder', date: '2025-06-11', time: '5:00 PM', result: 'Loss' },
          { id: 6, game: 'Wack a mole', date: '2025-06-10', time: '1:30 PM', result: 'Win' },
          { id: 7, game: 'Car Racer', date: '2025-06-09', time: '4:00 PM', result: 'Win' },
          { id: 8, game: 'Tick Tak Toe', date: '2025-06-08', time: '2:45 PM', result: 'Loss' }
        ];
        setTournamentHistory(mockHistory);
        // Compute stats and per-game details for mock data
        let wins = 0, losses = 0, gamesMap = {}, streak = 0, lastResult = null, favouriteGame = '', maxCount = 0;
        mockHistory.forEach(item => {
          if (item.result === 'Win') wins++;
          else if (item.result === 'Loss') losses++;
          if (lastResult === null || lastResult === 'Win') {
            if (item.result === 'Win') streak++;
            else lastResult = 'Loss';
          }
          if (!gamesMap[item.game]) gamesMap[item.game] = { totalMatches: 0, wins: 0, losses: 0, bestRank: '', maxTime: '', history: [] };
          gamesMap[item.game].totalMatches++;
          if (item.result === 'Win') gamesMap[item.game].wins++;
          if (item.result === 'Loss') gamesMap[item.game].losses++;
          gamesMap[item.game].history.push({ time: item.time, date: item.date, result: item.result });
        });
        const totalMatches = mockHistory.length;
        const winRate = totalMatches > 0 ? `${Math.round((wins / totalMatches) * 100)}%` : '0%';
        Object.entries(gamesMap).forEach(([game, data]) => {
          if (data.totalMatches > maxCount) {
            favouriteGame = game;
            maxCount = data.totalMatches;
          }
          data.winRate = data.totalMatches > 0 ? `${Math.round((data.wins / data.totalMatches) * 100)}%` : '0%';
        });
        setStats({ wins, losses, winRate, totalMatches, currentStreak: streak, favouriteGame });
        setGameDetails(gamesMap);
        setError('Showing fallback data: ' + (err.message || 'Failed to load tournament history'));
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-center mb-4">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-2xl mx-auto px-4 mb-4">
            {[
              { label: "Wins", value: stats.wins, color: 'text-green-400' },
              { label: "Losses", value: stats.losses, color: 'text-red-400' },
              { label: "Win Rate", value: stats.winRate, color: 'text-yellow-300' },
              { label: "Matches", value: stats.totalMatches, color: 'text-purple-400' },
              { label: "Winning Streak", value: stats.currentStreak, color: 'text-blue-300' },
              { label: "Favourite Game", value: stats.favouriteGame, color: 'text-pink-300' }
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
            {tournamentHistory.length === 0 ? (
              <div className="text-center text-gray-300 mt-8">No tournament history found.</div>
            ) : (
              tournamentHistory.map((item, idx) => (
                <div
                  key={item.id || idx}
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
                    <div className={`text-sm font-bold ${item.result === 'Win' ? 'text-green-400' : 'text-red-400'}`}>{item.result}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

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
