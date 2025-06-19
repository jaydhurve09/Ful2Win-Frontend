import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import BackgroundBubbles from '../components/BackgroundBubbles';
import Button from '../components/Button';

// React Icons
import { 
  FiHome, 
  FiMessageSquare, 
  FiPlus, 
  FiTrendingUp,
  FiAward,
  FiStar,
  FiClock,
  FiMessageCircle,
  FiHeart,
  FiShare2,
  FiUserPlus
} from 'react-icons/fi';
import { RiSwordLine } from 'react-icons/ri';
import { BsThreeDotsVertical } from 'react-icons/bs';

const Community = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [activeType, setActiveType] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const communityTabs = [
    { id: 'feed', label: 'Feed', icon: <FiHome className="mr-1" /> },
    { id: 'trending', label: 'Trending', icon: <FiTrendingUp className="mr-1" /> },
    { id: 'challenges', label: 'Challenges', icon: <RiSwordLine className="mr-1" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FiAward className="mr-1" /> },
  ];

  const typeTabs = [
    { id: 'all', label: 'All' },
    { id: 'popular', label: 'Popular', icon: <FiStar className="mr-1" /> },
    { id: 'recent', label: 'Recent', icon: <FiClock className="mr-1" /> },
    { id: 'discussions', label: 'Discussions', icon: <FiMessageCircle className="mr-1" /> },
  ];

  // Sample community posts data
  const communityPosts = [
    {
      id: 1,
      user: 'gamer123',
      avatar: 'G',
      time: '2h ago',
      content: 'Just won my first tournament! 🎮🏆 #winner #gaming',
      likes: 42,
      comments: 8,
      shares: 3,
      type: 'popular',
      userLiked: false
    },
    {
      id: 2,
      user: 'esports_pro',
      avatar: 'E',
      time: '4h ago',
      content: 'Check out my latest gaming setup! What do you think? #gaming #setup',
      likes: 128,
      comments: 24,
      shares: 12,
      type: 'recent',
      userLiked: true
    },
    {
      id: 3,
      user: 'game_dev',
      avatar: 'D',
      time: '1d ago',
      content: 'What\'s your favorite game of all time? Let\'s discuss in the comments! #gamingcommunity',
      likes: 87,
      comments: 45,
      shares: 5,
      type: 'discussions',
      userLiked: false
    },
  ];

  const [posts, setPosts] = useState(communityPosts);
  const filteredPosts = activeType === 'all' 
    ? posts 
    : posts.filter(post => post.type === activeType);

  const handleCreatePost = () => {
    if (newPostContent.trim() === '') return;
    
    const newPost = {
      id: posts.length + 1,
      user: 'current_user',
      avatar: 'Y',
      time: 'Just now',
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      type: 'recent',
      userLiked: false
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
          userLiked: !post.userLiked
        };
      }
      return post;
    }));
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-blueGradient">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />
        <div className="pt-16 md:pt-0">
          <div className="container mx-auto px-4 py-2">
            {/* Community Type Tabs - Desktop */}
            <div className="hidden md:flex gap-2 mb-4 overflow-x-auto py-2">
              {communityTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'primary' : 'gradient'}
                  onClick={() => setActiveTab(tab.id)}
                  className="rounded-full flex items-center whitespace-nowrap"
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Community Type Tabs - Mobile */}
            <div className="flex md:hidden gap-2 mb-4 overflow-x-auto py-2">
              {communityTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'primary' : 'gradient'}
                  onClick={() => setActiveTab(tab.id)}
                  className="rounded-full text-xs px-3 py-1.5 flex items-center"
                >
                  {React.cloneElement(tab.icon, { className: 'text-sm' })}
                  <span className="ml-1">{tab.label}</span>
                </Button>
              ))}
            </div>

            {/* Content Type Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto py-2">
              {typeTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeType === tab.id ? 'primary' : 'outline'}
                  onClick={() => setActiveType(tab.id)}
                  className="rounded-full text-sm px-4 py-1.5 flex items-center"
                  size="sm"
                >
                  {tab.icon && React.cloneElement(tab.icon, { className: 'text-sm' })}
                  <span className={tab.icon ? 'ml-1' : ''}>{tab.label}</span>
                </Button>
              ))}
            </div>

            {/* Create Post Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  U
                </div>
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  onClick={() => setShowCreatePost(true)}
                  readOnly
                />
              </div>
              {showCreatePost && (
                <div className="mt-4">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mb-3"
                    rows="3"
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreatePost(false)}
                      size="sm"
                    >
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
                </div>
              )}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {post.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{post.user}</h3>
                          <p className="text-xs text-white/60">{post.time}</p>
                        </div>
                      </div>
                      <button className="text-white/50 hover:text-white">
                        <BsThreeDotsVertical />
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="mb-3 text-white/90">{post.content}</p>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                      <button 
                        className={`flex items-center ${post.userLiked ? 'text-red-400' : 'text-white/60 hover:text-white'}`}
                        onClick={() => toggleLike(post.id)}
                      >
                        <FiHeart className={`mr-1 ${post.userLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center text-white/60 hover:text-white">
                        <FiMessageSquare className="mr-1" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="flex items-center text-white/60 hover:text-white">
                        <FiShare2 className="mr-1" />
                        <span className="text-sm">{post.shares}</span>
                      </button>
                      <button className="flex items-center text-white/60 hover:text-white">
                        <FiUserPlus className="mr-1" />
                        <span className="text-sm">Follow</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-white/70">No posts found. Be the first to create one!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Community;