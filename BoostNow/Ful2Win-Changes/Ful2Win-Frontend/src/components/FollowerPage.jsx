import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import BackgroundBubbles from "../components/BackgroundBubbles";

const FollowerPage = () => {
  const [activeTab, setActiveTab] = useState("following");
  const [search, setSearch] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await fetch("/api/followers");
        const data = await res.json();
        setFollowers(data.followers);
        setFollowing(data.following);
      } catch (err) {
        const fallbackUsers = [
          { id: 1, name: "GamerKing99", avatar: "https://i.pravatar.cc/150?img=3" },
          { id: 2, name: "PixelMaster", avatar: "https://i.pravatar.cc/150?img=4" },
          { id: 3, name: "ShadowNinja", avatar: "https://i.pravatar.cc/150?img=5" },
          { id: 4, name: "CodeCrusader", avatar: "https://i.pravatar.cc/150?img=6" },
        ];
        setFollowers(fallbackUsers);
        setFollowing([1, 3]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  const toggleFollow = (id) => {
    setFollowing((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const filteredUsers = (activeTab === "followers"
    ? followers
    : followers.filter((user) => following.includes(user.id))
  ).filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff] text-white pb-24 overflow-hidden">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

        <div className="pt-20 px-4 max-w-4xl mx-auto">
          {/* Back button + Heading */}
          <div className="flex items-center justify-center gap-3 mb-6 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 text-white text-3xl px-2"
            >
              &#8249;
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-100">
              My Followers
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setActiveTab("following")}
              className={`px-4 py-2 rounded-full font-medium transition-colors shadow-md ${
                activeTab === "following" ? "bg-blue-500" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              Following
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`px-4 py-2 rounded-full font-medium transition-colors shadow-md ${
                activeTab === "followers" ? "bg-blue-500" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              Followers
            </button>
          </div>

          {/* Search */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search followers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Users */}
          {loading ? (
            <p className="text-center text-white/70">Loading...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-4 flex items-center justify-between space-x-4 hover:scale-105 transform transition-transform duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full border-2 border-blue-400"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      <p className="text-sm text-white/60">
                        {activeTab === "following" ? "You follow them" : "Follows you"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-200 ${
                      following.includes(user.id)
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {following.includes(user.id) ? "Unfollow" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default FollowerPage;
