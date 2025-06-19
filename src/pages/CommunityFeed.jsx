import React from "react";
import Video from '../assets/video.png';
import { CiSearch, CiHeart, CiCamera } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import Profile from "../Components/Profile";
import Navbar from "../components/Navbar";

const posts = [
  {
    id: 1,
    user: "alexjhonson",
    time: "2h",
    likes: 1034,
    comments: 87,
    shares: 23,
    videoThumbnail: Video,
  },
  {
    id: 2,
    user: "alexjhonson",
    time: "2h",
    likes: 1034,
    comments: 87,
    shares: 23,
    videoThumbnail: Video,
  },
  {
    id: 3,
    user: "alexjhonson",
    time: "2h",
    likes: 1034,
    comments: 87,
    shares: 23,
    videoThumbnail: Video,
  },
];

const CommunityFeed = () => {
  const [profile, setProfile] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const handleUserClick = (userData) => {
    setProfile(true);
    setSelectedUser(userData);
  };

  return (
    
    <div className="max-w-md mx-auto p-4 bg-communityGradient text-white font-sans h-screen overflow-y-auto">
      
      {/* Search Bar */}
      <div className="relative w-full max-w-md mx-auto mt-5">
        <input
          type="text"
          placeholder="Search Users and Hashtags"
          className="w-full p-2 pr-10 pl-4 rounded-xl border border-gray-300 bg-blue-200 text-gray-800 text-base outline-none"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl text-gray-600">
          <CiSearch />
        </button>
      </div>

      {/* Post Input */}
      <div className="relative w-full max-w-md mx-auto mt-5">
        <input
          type="text"
          placeholder="What's on your mind?"
          className="w-full p-2 pr-10 pl-4 rounded-xl border border-gray-300 bg-blue-200 text-gray-800 text-base outline-none"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl text-gray-600">
          <CiCamera />
        </button>
      </div>

      {/* Profile Component */}
      {profile && selectedUser && (
        <div className="fixed top-8 left-0 w-full h-full z-[999] flex items-center justify-center">
          <Profile setProfile={setProfile} user={selectedUser} />
        </div>
      )}

      {/* Posts */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-[#073970] rounded-xl p-4 my-4"
        >
          {/* Post Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-300 rounded-full" />
            <span
              className="font-bold cursor-pointer"
              onClick={() => handleUserClick(post)}
            >
              {post.user}
            </span>
            <span className="ml-auto text-xs opacity-70">{post.time}</span>
          </div>

          {/* Video Thumbnail */}
          <div className="mt-3 relative">
            <img
              src={post.videoThumbnail}
              alt="thumbnail"
              className="w-full rounded-lg my-4"
            />
          </div>

          {/* Post Footer */}
          <div className="flex items-center justify-between mt-2 text-lg">
            <span className="flex items-center">
              <CiHeart className="text-2xl font-bold mr-1" /> {post.likes}
            </span>
            <span className="flex items-center">
              <FaRegComment className="text-2xl font-bold mr-1" />
              {post.comments}
            </span>
            <span className="flex items-center">
              <IoShareSocialSharp className="text-2xl font-bold mr-1" />
              {post.shares}
            </span>
            <button className="bg-blue-600 px-3 py-1 rounded-lg text-white text-sm">
              Send Challenge
            </button>
          </div>
        </div>
      ))}
      <Navbar/>
    </div>
  );
};

export default CommunityFeed;
