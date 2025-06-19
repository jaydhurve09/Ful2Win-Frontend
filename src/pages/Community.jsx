import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import BackgroundBubbles from '../components/BackgroundBubbles';
import Button from '../components/Button';
import CommunityProfile from '../components/CommunityProfile';

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
import { FaEllipsisH, FaThumbsUp, FaComment, FaShare, FaBookmark, FaSmile, FaImage, FaVideo, FaPoll } from 'react-icons/fa';

const Community = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [activeType, setActiveType] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);

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
      user: 'gaming_legend',
      name: 'Alex Johnson',
      avatar: 'AJ',
      time: '1h ago',
      content: 'Check out this insane headshot I hit in the tournament yesterday! #headshot #gaming #esports',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      likes: 256,
      comments: 32,
      shares: 18,
      type: 'popular',
      userLiked: true,
      game: 'Valorant',
      playTime: '2h 45m',
      views: '12.5K',
      verified: true,
      stats: {
        wins: 42,
        winRate: '87%',
        games: 156,
        friends: 128
      }
    },
    {
      id: 2,
      user: 'esports_pro',
      avatar: 'EP',
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
      avatar: 'GD',
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
      {viewingProfile && (
        <CommunityProfile 
          user={viewingProfile} 
          onClose={() => setViewingProfile(null)} 
        />
      )}
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
              <h3 className="text-lg font-semibold mb-4">Create Post</h3>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  U
                </div>
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  onClick={() => setShowCreatePost(true)}
                  readOnly
                />
              </div>
              
              {/* Post Type Selection */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex space-x-2">
                  <button className="flex items-center text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <FaImage className="mr-1" /> Photo
                  </button>
                  <button className="flex items-center text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <FaVideo className="mr-1" /> Video
                  </button>
                  <button className="flex items-center text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <FaPoll className="mr-1" /> Poll
                  </button>
                </div>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                  onClick={() => setShowCreatePost(true)}
                >
                  Post
                </button>
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
                      <button 
                        onClick={() => setViewingProfile(post)}
                        className="flex items-center hover:opacity-80 transition-opacity"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {post.avatar}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-white flex items-center">
                            {post.user}
                            {post.verified && (
                              <svg className="w-3.5 h-3.5 ml-1 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            )}
                          </h3>
                          <p className="text-xs text-white/60">{post.time}</p>
                        </div>
                      </button>
                      <button 
                        className="text-white/50 hover:text-white p-1 -mr-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add more options menu here if needed
                        }}
                      >
                        <BsThreeDotsVertical />
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="mb-3 text-white/90">{post.content}</p>

                    {/* Post Image */}
                    {post.image && (
                      <div className="relative rounded-lg overflow-hidden mb-3 border border-white/10 max-h-64">
                        <img 
                          src={post.image} 
                          alt="Post content" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        {post.game && (
                          <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            {post.game} • {post.playTime}
                          </div>
                        )}
                        {post.views && (
                          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                            👁️ {post.views}
                          </div>
                        )}
                      </div>
                    )}

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