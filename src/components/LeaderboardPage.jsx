import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { users } from "./data";

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("Coins");

  const getSortedUsers = () => {
    let filtered = [];

    if (activeTab === "Coins") {
      filtered = users.filter(u => u.type === "coin");
      return filtered.sort((a, b) => b.score - a.score); // Sorting by SCORE for Coins
    } else if (activeTab === "Winnings") {
      filtered = users.filter(u => u.type === "cash");
      return filtered.sort((a, b) => b.score - a.score); // Sorting by SCORE for Winnings
    } else if (activeTab === "Followers") {
      return [...users].sort((a, b) => b.followers - a.followers); // Sorting by followers
    }
  };

  const sortedUsers = getSortedUsers();
  const top3 = sortedUsers.slice(0, 3);
  const rest = sortedUsers.slice(3);

  const getValue = (user) => {
    if (activeTab === "Coins" || activeTab === "Winnings") return `${user.score}+`; // Showing SCORE
    if (activeTab === "Followers") return `${user.followers}`; // Showing followers
    return "";
  };

  return (
    <div className="min-h-screen text-white pb-24 overflow-hidden">
      <div className="relative z-10">
        <div className="px-4 max-w-3xl mx-auto">

          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-10 mt-0">
            {["Coins", "Winnings", "Followers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors ${
                  activeTab === tab
                    ? "bg-yellow-400 text-black"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Top 3 Users */}
          <div className="flex justify-center items-end gap-6 mb-6 flex-wrap mt-4">
            {[1, 0, 2].map((pos) => (
              top3[pos] && (
                <div
                  key={pos}
                  className={`text-center ${pos === 0 ? "-translate-y-6" : ""}`}
                >
                  <div className="relative mb-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-700 border-4 border-blue-300 mx-auto">
                      <FaUser
                        size={30}
                        className="mx-auto mt-3 md:mt-4 text-white"
                      />
                    </div>
                    {/* Rank Badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 flex items-center justify-center">
                      <span className="text-yellow-300 font-bold text-xs md:text-sm">
                        {pos + 1}
                      </span>
                    </div>
                  </div>
                  <div className="text-base md:text-lg font-semibold">
                    {top3[pos].name}
                  </div>
                  <div className="text-sm text-white/70">
                    {getValue(top3[pos])}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* 4–10 Users */}
          <div className="bg-white/10 rounded-xl p-4 max-w-md mx-auto space-y-3">
            {rest.map((user, index) => (
              <div
                key={index}
                className="flex items-center bg-white/5 p-2 rounded-lg gap-3"
              >
                <div className="text-yellow-300 font-bold w-6 text-center">
                  {index + 4}
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                  <FaUser size={20} />
                </div>
                <div>
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs text-white/60">{getValue(user)}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
