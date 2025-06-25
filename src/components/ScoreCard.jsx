import React from 'react';

const ScoreCard = ({ userId, score, roomId, gameName }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mt-10 text-center border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">🏆 Game Score</h2>

      <div className="text-gray-700 text-base mb-3">
        <p><strong>Player ID:</strong> {userId}</p>
        <p><strong>Room ID:</strong> {roomId}</p>
        <p><strong>Game:</strong> {gameName}</p>
        <p className="text-3xl font-bold text-green-600 mt-4">Score: {score}</p>
      </div>

      <div className="mt-4">
        <button
          className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all"
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default ScoreCard;
