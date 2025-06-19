import React from 'react';
import { RxCrossCircled } from "react-icons/rx";
import { FaUserPlus, FaCommentDots, FaTrophy, FaHistory, FaPaperPlane, FaCrown, FaMedal } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

const CommunityProfile = ({ user, onClose }) => {
  // Sample data for the profile
  const stats = {
    wins: user.stats?.wins || 32,
    winRate: user.stats?.winRate || '76%',
    games: user.stats?.games || 543,
    friends: user.stats?.friends || 85
  };

  const achievements = [
    { id: 1, title: 'First Win', icon: <FaTrophy className="text-yellow-400" />, unlocked: true },
    { id: 2, title: 'Pro Gamer', icon: <FaCrown className="text-yellow-400" />, unlocked: true },
    { id: 3, title: 'Champion', icon: <FaMedal className="text-yellow-400" />, unlocked: false },
    { id: 4, title: 'Legend', icon: <FaTrophy className="text-yellow-400" />, unlocked: false },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#1A1C22] rounded-2xl border border-white/10 shadow-2xl mt-16 mb-8">
        {/* Header with close button */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-500 rounded-t-2xl"></div>
          <button 
            className="absolute top-4 right-4 bg-black/50 rounded-full p-1.5 text-white/80 hover:text-white transition-colors"
            onClick={onClose}
          >
            <RxCrossCircled size={24} />
          </button>
          
          {/* Avatar */}
          <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl border-4 border-[#1A1C22] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
            {user.avatar}
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-12 px-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                {user.name || user.user}
                {user.verified && (
                  <svg className="w-4 h-4 ml-1.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                )}
              </h2>
              <p className="text-sm text-gray-400">@{user.user}</p>
            </div>
            <button className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-white/60 hover:text-white transition-colors">
              <BsThreeDots size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 my-6">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{stats.wins}</div>
              <div className="text-xs text-gray-400">Wins</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{stats.winRate}</div>
              <div className="text-xs text-gray-400">Win Rate</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{stats.games}</div>
              <div className="text-xs text-gray-400">Games</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{stats.friends}</div>
              <div className="text-xs text-gray-400">Friends</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors">
              <FaUserPlus size={16} />
              Add Friend
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors">
              <FaCommentDots size={16} />
              Message
            </button>
          </div>

          {/* Follow Stats */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-2 bg-white/5 rounded-xl p-3">
              <div className="text-center">
                <div className="text-lg font-bold text-white">1.2K</div>
                <div className="text-xs text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">24.5K</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">1.5K</div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Achievements</h3>
            <div className="grid grid-cols-4 gap-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`flex flex-col items-center p-2 rounded-lg ${achievement.unlocked ? 'bg-white/5' : 'opacity-40'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                    {achievement.icon}
                  </div>
                  <span className="text-xs text-center text-white/80">{achievement.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfile;
