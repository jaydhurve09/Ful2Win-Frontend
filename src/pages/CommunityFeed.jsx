import React, { useState } from "react";
import { CiSearch, CiHeart, CiCamera } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import Navbar from "../components/Navbar";

// Import a default image in case the video thumbnail fails to load
import defaultThumbnail from '../assets/default-thumbnail.jpg';

const posts = [
  {
    id: 1,
    user: "gaming_legend",
    time: "2h",
    likes: 1034,
    comments: 87,
    shares: 23,
    videoThumbnail: defaultThumbnail,
  },
  {
    id: 2,
    user: "esports_pro",
    time: "4h",
    likes: 2456,
    comments: 132,
    shares: 45,
    videoThumbnail: defaultThumbnail,
  },
  {
    id: 3,
    user: "game_master",
    time: "6h",
    likes: 876,
    comments: 54,
    shares: 12,
    videoThumbnail: defaultThumbnail,
  },
];

const CommunityFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `#${post.user.toLowerCase().replace(/\s+/g, '')}`.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-blue-900 to-blue-800 min-h-screen text-white font-sans">
      <div className="p-4 pb-20">
        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-auto mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Users and Hashtags"
            className="w-full p-3 pr-10 pl-4 rounded-xl border border-blue-400 bg-blue-800/50 text-white text-base outline-none placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-blue-300">
            <CiSearch />
          </button>
        </div>

        {/* Create Post */}
        <div className="relative w-full max-w-md mx-auto mt-4 mb-6">
          <div className="flex items-center gap-3 bg-blue-700/50 p-3 rounded-xl">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex-shrink-0"></div>
            <input
              type="text"
              placeholder="What's on your mind?"
              className="flex-1 p-2 pl-4 pr-10 rounded-xl border border-blue-600 bg-blue-900/50 text-white text-base outline-none placeholder-blue-400"
            />
            <button className="text-2xl text-blue-300 ml-2">
              <CiCamera />
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-blue-800/40 backdrop-blur-sm rounded-xl p-4 border border-blue-700/50">
                {/* Post Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-100">{post.user}</h3>
                    <p className="text-xs text-blue-300">{post.time} ago</p>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mt-3">
                  <p className="text-blue-100 mb-3">
                    Check out my latest gaming highlight! #{post.user.replace(/\s+/g, '')}
                  </p>
                  <div className="relative rounded-lg overflow-hidden bg-blue-900/50">
                    <img
                      src={post.videoThumbnail}
                      alt="Post thumbnail"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultThumbnail;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-0 h-0 border-t-8 border-b-8 border-t-transparent border-b-transparent border-l-16 border-l-white"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-700/50">
                  <button className="flex items-center text-blue-200 hover:text-white">
                    <CiHeart className="text-2xl mr-1" />
                    <span className="text-sm">{post.likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center text-blue-200 hover:text-white">
                    <FaRegComment className="text-xl mr-1" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center text-blue-200 hover:text-white">
                    <IoShareSocialSharp className="text-xl mr-1" />
                    <span className="text-sm">{post.shares}</span>
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg text-white text-sm font-medium transition-colors">
                    Challenge
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-blue-300">
              No posts found. Try a different search.
            </div>
          )}
        </div>
      </div>
      
      {/* Fixed Navbar at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-blue-900/80 backdrop-blur-md border-t border-blue-700 z-10">
        <Navbar />
      </div>
    </div>
  );
};

export default CommunityFeed;
