import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirect
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import BackgroundBubbles from '../components/BackgroundBubbles';
import Button from '../components/Button';
import CommunityProfile from '../components/CommunityProfile';
import ChatScreen from '../components/ChatScreen';
import Challenges from '../components/Challenges';
import LeaderboardPage from '../components/LeaderboardPage';

import {
  FiHome,
  FiMessageSquare,
  FiAward,
  FiStar,
  FiClock,
  FiMessageCircle,
  FiHeart,
  FiShare2,
  FiUserPlus,
} from 'react-icons/fi';
import { RiSwordLine } from 'react-icons/ri';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaImage, FaVideo, FaPoll } from 'react-icons/fa';

const Community = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [activeType, setActiveType] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const navigate = useNavigate(); // For Challenges redirect

  const communityTabs = [
    { id: 'feed', label: 'Feed', icon: <FiHome className="mr-1" /> },
    { id: 'chats', label: 'Chats', icon: <FiMessageSquare className="mr-1" /> },
    { id: 'challenges', label: 'Challenges', icon: <RiSwordLine className="mr-1" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FiAward className="mr-1" /> },
  ];

  const typeTabs = [
    { id: 'all', label: 'All' },
    { id: 'popular', label: 'Popular', icon: <FiStar className="mr-1" /> },
    { id: 'recent', label: 'Recent', icon: <FiClock className="mr-1" /> },
    { id: 'discussions', label: 'Discussions', icon: <FiMessageCircle className="mr-1" /> },
  ];

  const communityPosts = [
    {
      id: 1,
      user: 'gaming_legend',
      name: 'Alex Johnson',
      avatar: 'AJ',
      time: '1h ago',
      content: 'Check out this insane headshot I hit in the tournament yesterday!',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?...',
      likes: 256,
      comments: 32,
      shares: 18,
      type: 'popular',
      userLiked: true,
      verified: true,
    },
    {
      id: 2,
      user: 'esports_pro',
      avatar: 'EP',
      time: '4h ago',
      content: 'Check out my latest gaming setup!',
      likes: 128,
      comments: 24,
      shares: 12,
      type: 'recent',
      userLiked: true,
    },
    {
      id: 3,
      user: 'game_dev',
      avatar: 'GD',
      time: '1d ago',
      content: "What's your favorite game of all time?",
      likes: 87,
      comments: 45,
      shares: 5,
      type: 'discussions',
      userLiked: false,
    },
  ];

  const [posts, setPosts] = useState(communityPosts);
  const filteredPosts = activeType === 'all' ? posts : posts.filter(post => post.type === activeType);

  const handleCreatePost = () => {
    if (newPostContent.trim() === '') return;
    const newPost = {
      id: posts.length + 1,
      user: 'current_user',
      avatar: 'U',
      time: 'Just now',
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      type: 'recent',
      userLiked: false,
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowCreatePost(false);
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.userLiked ? post.likes - 1 : post.likes + 1,
          userLiked: !post.userLiked,
        };
      }
      return post;
    }));
  };

  const handleTabChange = (tabId) => {
    if (tabId === 'challenges') {
      navigate('/challenges'); // Redirect inline
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-blueGradient">
      <BackgroundBubbles />
      {viewingProfile && (
        <CommunityProfile
          user={viewingProfile}
          onClose={() => setViewingProfile(null)}
        />
      )}

      {!selectedFriend && (
        <div className="relative z-10">
          <Header />

          <div className="pt-20 md:pt-0 w-full flex justify-center">
            <div className="w-full max-w-3xl px-4">
              <div className="hidden md:flex gap-2 mb-2 overflow-x-auto py-1 justify-end pr-1">
                {communityTabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'gradient'}
                    onClick={() => handleTabChange(tab.id)}
                    className="rounded-full px-4 py-2 flex items-center whitespace-nowrap text-sm"
                  >
                    {React.cloneElement(tab.icon, { className: 'mr-1.5' })}
                    {tab.label}
                  </Button>
                ))}
              </div>

              <div className="flex md:hidden w-full mb-2 py-1 px-1">
                <div className="w-full flex justify-start space-x-1 pr-1">
                  {communityTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'primary' : 'gradient'}
                      onClick={() => handleTabChange(tab.id)}
                      className={`rounded-full ${activeTab === tab.id ? 'px-3 py-1.5' : 'p-2.5'} flex items-center justify-center`}
                      title={tab.label}
                    >
                      {React.cloneElement(tab.icon, { 
                        className: `text-sm ${activeTab === tab.id ? 'mr-1' : ''}` 
                      })}
                      {activeTab === tab.id && (
                        <span className="text-xs ml-0.5">{tab.label}</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            {activeTab === 'feed' && (
              <div className="w-full max-w-3xl px-4 mx-auto mt-1">
                <div className="w-full mb-2 py-1">
                  <div className="flex justify-start space-x-1 pr-1">
                    {typeTabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeType === tab.id ? 'primary' : 'outline'}
                        onClick={() => setActiveType(tab.id)}
                        className={`rounded-full text-sm ${activeType === tab.id ? 'px-3 py-1.5' : 'p-2.5'} flex items-center justify-center`}
                        title={tab.label}
                      >
                        {tab.icon ? (
                          <>
                            {React.cloneElement(tab.icon, { 
                              className: `text-sm ${activeType === tab.id ? 'mr-1' : ''}` 
                            })}
                            {activeType === tab.id && (
                              <span className="text-xs">{tab.label}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs">{tab.label}</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Create Post</h3>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">U</div>
                    <div className="flex-1">
                      {!showCreatePost ? (
                        <>
                          <input
                            type="text"
                            placeholder="What's on your mind?"
                            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white mb-3 focus:outline-none focus:ring-0 focus:border-white/20"
                            onClick={() => setShowCreatePost(true)}
                            readOnly
                          />
                        </>
                      ) : (
                        <div>
                          <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white mb-3 focus:outline-none focus:ring-0 focus:border-white/30 resize-none"
                            rows="3"
                            autoFocus
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                        <div className="flex space-x-2">
                          <button className="flex items-center text-sm text-gray-300 hover:text-white whitespace-nowrap">
                            <FaImage className="mr-1" /> Photo
                          </button>
                          <button className="flex items-center text-sm text-gray-300 hover:text-white whitespace-nowrap">
                            <FaVideo className="mr-1" /> Video
                          </button>
                          <button className="flex items-center text-sm text-gray-300 hover:text-white whitespace-nowrap">
                            <FaPoll className="mr-1" /> Poll
                          </button>
                        </div>
                        <div className="flex-shrink-0">
                          {showCreatePost ? (
                            <div className="flex space-x-2">
                              <Button variant="outline" onClick={() => setShowCreatePost(false)} size="sm">
                                Cancel
                              </Button>
                              <Button 
                                variant="primary" 
                                onClick={handleCreatePost} 
                                size="sm" 
                                disabled={!newPostContent.trim()}
                              >
                                Post
                              </Button>
                            </div>
                          ) : (
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap"
                              onClick={() => setShowCreatePost(true)}
                            >
                              Post
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <div key={post.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <button onClick={() => setViewingProfile(post)} className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                              {post.avatar}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white flex items-center">
                                {post.user}
                                {post.verified && <span className="ml-1 text-blue-400 text-sm">✔</span>}
                              </h3>
                              <p className="text-xs text-white/60">{post.time}</p>
                            </div>
                          </button>
                          <button className="text-white/50 hover:text-white"><BsThreeDotsVertical /></button>
                        </div>
                        <p className="mb-3 text-white/90">{post.content}</p>
                        {post.image && (
                          <img
                            src={post.image}
                            alt="Post"
                            className="rounded-lg w-full h-auto object-cover mb-3"
                          />
                        )}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                          <button
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center text-sm ${post.userLiked ? 'text-red-400' : 'text-white/60 hover:text-white'}`}
                          >
                            <FiHeart className="mr-1" /> {post.likes}
                          </button>
                          <button className="flex items-center text-sm text-white/60 hover:text-white"><FiMessageSquare className="mr-1" /> {post.comments}</button>
                          <button className="flex items-center text-sm text-white/60 hover:text-white"><FiShare2 className="mr-1" /> {post.shares}</button>
                          <button className="flex items-center text-sm text-white/60 hover:text-white"><FiUserPlus className="mr-1" /> Follow</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-white/70 py-10">No posts found.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'chats' && (
              <ChatScreen selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} />
            )}
            {activeTab === 'leaderboard' && <LeaderboardPage />}
          </div>
        </div>
      )}

      {selectedFriend && (
        <ChatScreen selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} />
      )}

      {!selectedFriend && <Navbar />}
    </div>
  );
};

export default Community;
