import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:5000'; // Use the environment variable for API URL
const Leaderboard = () => {
  const navigate = useNavigate();
  const { gameName, tournamentId } = useParams(); // ✅ Get from URL
  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  const [leaderboardData, setLeaderboardData] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/score/get-score`, {
        gameName,
        roomId: tournamentId,
      });

      const data = response.data;
      if (data && Array.isArray(data.scores)) {
        setLeaderboardData(data.scores);
      } else {
        console.error("Invalid leaderboard data format", response.data);
      }
    } catch (error) {
      
      toast.error(error.response?.data?.message || "An error occurred while fetching leaderboard data.");
      navigate(-1);
      console.error("Error fetching leaderboard data:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (gameName && tournamentId) {
      fetchLeaderboard();
    } else {
      console.error("Invalid gameName or tournamentId");
    }
  }, [gameName, tournamentId]);

  const myScore = leaderboardData.find(player => player.userId === userId);

  return (
    <div className="relative min-h-screen bg-blueGradient text-white">
      <BackgroundBubbles />
      <Header />

      {/* Scrollable Content */}
      <div className="relative z-10 max-w-md mx-auto px-4 pt-14 pb-24 flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
        {/* Back & Title */}
        <div className="flex items-center mt-6 mb-4">
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
          <div className="w-3/12 text-right">Score</div>
          <div className="w-3/12 text-right">Prize Won</div>
        </div>

        {/* Leaderboard Entries */}
        <div className="space-y-2 pr-1 pb-4">
          {leaderboardData && leaderboardData.map((player, index) => (
            <div
              key={player._id}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 flex justify-between items-center hover:scale-[1.01] transition"
            >
              <div className="w-1/12 text-sm text-white/80 font-semibold">#{index + 1}</div>
              <div className="w-5/12">
                <p className="text-sm text-white font-medium truncate">{player.username}</p>
              </div>
              <div className="w-3/12 text-right text-green-300 font-semibold text-sm">
                {player.score}
              </div>
              <div className="w-3/12 text-right text-lime-400 font-semibold text-sm">
                {player.prize}
              </div>
            </div>
          ))}

          {/* My Score Placeholder Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 flex justify-between items-center hover:scale-[1.01] transition mt-4">
            <div className="w-1/12 text-sm text-white/80 font-semibold">–</div>
            <div className="w-5/12">
              {myScore ? (
                <>
                  <p className="text-sm text-white font-medium truncate">{myScore.username || "Me"}</p>
                  <p className="text-xs text-white/50">You played in this tournament</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-white font-medium truncate">ME</p>
                  <p className="text-xs text-white/50">No match played yet</p>
                </>
              )}
            </div>
            <div className="w-3/12 text-right text-white/40 font-semibold text-sm">
              {myScore ? myScore.score : "—"}
            </div>
            <div className="w-3/12 text-right text-white/40 font-semibold text-sm">
              {myScore ? myScore.prize : "—"}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/50 mt-3">Compete daily to reach the top!</p>
      </div>

      <Navbar />
    </div>
  );
};

export default Leaderboard;
