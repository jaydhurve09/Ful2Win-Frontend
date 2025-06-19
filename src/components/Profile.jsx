import React from 'react';
import { RxCrossCircled } from "react-icons/rx";
import {
  FaUserPlus,
  FaCommentDots,
  FaTrophy,
  FaHistory,
  FaPaperPlane
} from 'react-icons/fa';

const Profile = ({ user, setProfile }) => {
  return (
    <div className="relative w-[95%] max-w-full h-[600px] m-auto rounded-2xl p-5 bg-white/5 backdrop-blur-lg border border-white/20 shadow-xl text-white text-center animate-fadeIn">
      
      {/* ❌ Close Button */}
      <button
        className="absolute top-3 right-3 text-white/80 text-2xl z-10"
        onClick={() => setProfile(false)}
      >
        <RxCrossCircled />
      </button>

      {/* 👤 Avatar Section */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-yellow-400 mb-2" />
        <h2 className="text-lg font-bold text-white">
          Full Name <span className="text-yellow-400">@{user.user}</span>
        </h2>
      </div>

      {/* 🟡 Action Buttons */}
      <div className="grid grid-cols-5 gap-2 justify-center text-yellow-400 text-sm mb-5 bg-white/10 p-3 rounded-xl border border-white/20">
        <div className="flex flex-col items-center">
          <FaUserPlus className="text-lg mb-1" />
          <span className="text-xs">Add</span>
        </div>
        <div className="flex flex-col items-center">
          <FaCommentDots className="text-lg mb-1" />
          <span className="text-xs">Chat</span>
        </div>
        <div className="flex flex-col items-center">
          <FaTrophy className="text-lg mb-1" />
          <span className="text-xs">Challenge</span>
        </div>
        <div className="flex flex-col items-center">
          <FaHistory className="text-lg mb-1" />
          <span className="text-xs">History</span>
        </div>
        <div className="flex flex-col items-center">
          <FaPaperPlane className="text-lg mb-1" />
          <span className="text-xs">Share</span>
        </div>
      </div>

      {/* 📊 Stats Section */}
      <div className="flex justify-between flex-wrap bg-white/10 rounded-xl px-4 py-3 mb-4 border border-white/20">
        <div className="flex-1 min-w-[70px] text-center">
          <strong className="text-white text-base block">32</strong>
          <span className="text-sm text-gray-300">Wins</span>
        </div>
        <div className="flex-1 min-w-[70px] text-center">
          <strong className="text-white text-base block">76%</strong>
          <span className="text-sm text-gray-300">Win Rate</span>
        </div>
        <div className="flex-1 min-w-[70px] text-center">
          <strong className="text-white text-base block">543</strong>
          <span className="text-sm text-gray-300">Games</span>
        </div>
        <div className="flex-1 min-w-[70px] text-center">
          <strong className="text-white text-base block">85</strong>
          <span className="text-sm text-gray-300">Friends</span>
        </div>
      </div>

      {/* 🫂 Mutual Friends */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-3 mb-4">
        <h4 className="text-white text-sm mb-2">Mutual Friends (5)</h4>
        <div className="flex justify-center gap-2 flex-wrap items-center">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="w-9 h-9 bg-white rounded-full border-2 border-blue-700"
            />
          ))}
        </div>
      </div>

      {/* 🏆 Achievements */}
      <div className="bg-white/10 rounded-lg p-3 mt-3">
        <div className="flex justify-center items-center text-yellow-400 font-bold text-sm">
          <FaTrophy className="mr-2 text-base" />
          <span className='text-white'>Achievements</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
