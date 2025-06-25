import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import BackgroundBubbles from '../components/BackgroundBubbles';
import Button from '../components/Button';
import CommunityProfile from '../components/CommunityProfile';
import ChatScreen from '../components/ChatScreen';
import LeaderboardPage from '../components/LeaderboardPage';
import {
  FiHome,
  FiMessageSquare,
  FiAward,
  FiStar,
  FiClock,
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
  const navigate = useNavigate();

  const communityTabs = [
    { id: 'feed', label: 'Feed', icon: <FiHome /> },
    { id: 'chats', label: 'Chats', icon: <FiMessageSquare /> },
    { id: 'challenges', label: 'Challenges', icon: <RiSwordLine /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FiAward /> },
  ];

  const typeTabs = [
    { id: 'all', label: 'All' },
    { id: 'popular', label: 'Popular', icon: <FiStar /> },
    { id: 'recent', label: 'Recent', icon: <FiClock /> },
  ];

  const communityPosts = [
    {
      id: 1,
      user: 'gaming_legend',
      name: 'Alex Johnson',
      avatar: 'AJ',
      time: '1h ago',
      content: 'Check out this insane headshot I hit in the tournament yesterday!',
      image: '',
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
      navigate('/challenges');
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="relative h-screen pb-24 overflow-y-auto text-white bg-blueGradient">
      <BackgroundBubbles />

      {viewingProfile && (
        <CommunityProfile user={viewingProfile} onClose={() => setViewingProfile(null)} />
      )}

      {!selectedFriend && (
        <div className="relative z-10">
          <Header />

          <div className="pt-16 md:pt-0 w-full flex justify-center">
            <div className="w-full max-w-3xl px-4">
              {/* Tabs for Feed / Chats / Leaderboard */}
              <div className="flex gap-2 mb-4 overflow-x-auto py-2 md:justify-center justify-start flex-wrap">
                {communityTabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'ghost'}
                    onClick={() => handleTabChange(tab.id)}
                    className="rounded-full text-xs px-3 py-1.5 flex items-center justify-center"
                  >
                    {tab.icon}
                    <span className="ml-1 hidden md:inline">{tab.label}</span>
                    {activeTab === tab.id && <span className="ml-1 md:hidden">{tab.label}</span>}
                  </Button>
                ))}
              </div>

              {/* Filter Tabs */}
              {activeTab === 'feed' && (
                <>
                  <div className="flex gap-2 mb-4 overflow-x-auto py-2 justify-start">
                    {typeTabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeType === tab.id ? 'primary' : 'outline'}
                        onClick={() => setActiveType(tab.id)}
                        className="rounded-full text-sm px-4 py-1.5 flex items-center"
                      >
                        {tab.icon && React.cloneElement(tab.icon, { className: 'text-sm' })}
                        <span className={tab.icon ? 'ml-1' : ''}>{tab.label}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Create Post Box */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/20">
                    <h3 className="text-lg font-semibold mb-4">Create Post</h3>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">U</div>
                      <input
                        type="text"
                        placeholder="What's on your mind?"
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white"
                        onClick={() => setShowCreatePost(true)}
                        readOnly
                      />
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <div className="flex space-x-2">
                        <button className="flex items-center text-sm text-gray-300 hover:text-white"><FaImage className="mr-1" /> Photo</button>
                        <button className="flex items-center text-sm text-gray-300 hover:text-white"><FaVideo className="mr-1" /> Video</button>
                        <button className="flex items-center text-sm text-gray-300 hover:text-white"><FaPoll className="mr-1" /> Poll</button>
                      </div>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium"
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
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white mb-3"
                          rows="3"
                          autoFocus
                        />
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowCreatePost(false)} size="sm">Cancel</Button>
                          <Button variant="primary" onClick={handleCreatePost} size="sm" disabled={!newPostContent.trim()}>Post</Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Posts Feed */}
                  <div className="space-y-4">
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map((post) => (
                        <div key={post.id} className="bg-blue-600/60 backdrop-blur-md rounded-2xl p-4 border border-blue-700/20 shadow-md transition duration-300 hover:scale-[1.01]"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <button onClick={() => setViewingProfile(post)} className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">{post.avatar}</div>
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
                          {post.image && <img src={post.image} alt="Post" className="rounded-lg w-full h-auto object-cover mb-3" />}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                            <button onClick={() => toggleLike(post.id)} className={`flex items-center text-sm ${post.userLiked ? 'text-red-400' : 'text-white/60 hover:text-white'}`}>
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
                </>
              )}

              {activeTab === 'chats' && (
                <ChatScreen selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} />
              )}

              {activeTab === 'leaderboard' && (
                <LeaderboardPage />
              )}
            </div>
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
