import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from '../services/api';

const Community = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [activeType, setActiveType] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // For Challenges redirect

  // Function to enhance posts with user data
  const enhancePostsWithUserData = async (posts) => {
    try {
      const enhancedPosts = [];
      
      for (const post of posts) {
        try {
          // Check if user data is already in the post
          if (post.user?._id || post.author?._id) {
            enhancedPosts.push({
              ...post,
              user: post.user || post.author || { _id: 'unknown' }
            });
            continue;
          }
          
          // If we have a user ID, try to fetch the user data
          const userId = post.user || post.userId || post.author || post.createdBy?._id || post.createdBy;
          if (userId && typeof userId === 'string') {
            console.log(`Fetching user data for post ${post._id}, user ID:`, userId);
            try {
              const userData = await authService.getUserProfile(userId);
              enhancedPosts.push({ ...post, user: userData });
            } catch (error) {
              console.error(`Failed to fetch user ${userId} for post ${post._id}:`, error);
              enhancedPosts.push({ ...post, user: { _id: userId } });
            }
          } else {
            console.log('No valid user ID found for post:', post._id, 'post data:', post);
            enhancedPosts.push({ ...post, user: { _id: 'unknown' } });
          }
        } catch (error) {
          console.error('Error processing post:', post._id, error);
          enhancedPosts.push({ ...post, user: { _id: 'unknown' } });
        }
      }
      
      return enhancedPosts;
    } catch (error) {
      console.error('Error in enhancePostsWithUserData:', error);
      return posts.map(post => ({
        ...post,
        user: post.user || post.author || { _id: 'unknown' }
      }));
    }
  };

  // Fetch current user data and posts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch current user data
        const userData = await authService.getCurrentUserProfile();
        console.log('Current user data:', userData);
        setCurrentUser(userData);

        // Fetch community posts with user data populated
        let postsData = await authService.getCommunityPosts({ 
          sort: '-createdAt',
          limit: 20,
          populate: 'user author createdBy', // Include all possible user reference fields
        });
        
        console.log('Raw posts data:', JSON.stringify(postsData, null, 2));
        
        // Process posts to ensure we have user data
        if (Array.isArray(postsData)) {
          // First try to use the populated user data
          const processedPosts = postsData.map(post => ({
            ...post,
            user: post.user || post.author || post.createdBy || null
          }));
          
          // Then enhance any posts that still don't have user data
          const enhancedPosts = await enhancePostsWithUserData(processedPosts);
          console.log('Processed posts with user data:', enhancedPosts);
          setPosts(enhancedPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Filter posts based on active tab
  const filteredPosts = React.useMemo(() => {
    if (activeType === 'all') return posts;
    return posts.filter(post => post.type === activeType);
  }, [posts, activeType]);

  const handleCreatePost = async () => {
    if (newPostContent.trim() === '') {
      toast.error('Please enter some content for your post');
      return;
    }

    if (!currentUser) {
      toast.error('User information not available');
      return;
    }

    setIsCreatingPost(true);
    
    try {
      const postData = {
        content: newPostContent,
        // Add any additional post data here (e.g., images, videos, etc.)
      };

      // Create the post
      const createdPost = await authService.createPost(postData);
      
      // Fetch the full post with populated user data
      const response = await authService.getCommunityPosts({ 
        _id: createdPost._id,
        populate: 'user' 
      });
      
      console.log('New post created:', newPost); // Debug log
      
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setShowCreatePost(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Failed to create post. Please try again.');
    }
  };



  const handleViewProfile = async (userId, post) => {
    try {
      // Navigate to the profile screen with the user ID
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error('Error navigating to profile:', error);
      toast.error('Failed to open profile');
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderPosts = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      );
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          No posts found. Be the first to post!
        </div>
      );
    }

    return filteredPosts.map((post) => {
      console.log('Post data:', post); // Log the full post data
      
      // Extract user data from the post
      const user = post.user || post.author || post.createdBy || { _id: 'unknown' };
      
      // Debug: Log the full post and user data
      console.log('Post ID:', post._id);
      console.log('Available user data in post:', {
        postUser: post.user,
        postAuthor: post.author,
        postCreatedBy: post.createdBy
      });
      
      // Handle different possible user name fields
      const userName = user?.fullName || user?.name || user?.username || 'Unknown User';
      const userUsername = user?.username || 'user';
      const userAvatarUrl = user?.profilePicture || user?.avatar || null;
      const userInitial = userName.charAt(0).toUpperCase();
      
      console.log('Extracted user data for post', post._id, ':', {
        userName,
        userUsername,
        userAvatarUrl,
        hasAvatar: !!userAvatarUrl
      });
      
      const avatarElement = userAvatarUrl ? (
        <img 
          src={userAvatarUrl} 
          alt={userName}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
          {userInitial}
        </div>
      );
      
      // Debug: Log the final post data
      console.log('Rendering post:', {
        postId: post._id,
        userName,
        userUsername,
        hasAvatar: !!userAvatarUrl,
        userData: user
      });

      return (
        <div key={post._id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
          <div className="flex items-start mb-3">
            <div 
              className="cursor-pointer"
              onClick={() => handleViewProfile(user?._id || user, post)}
            >
              {avatarElement}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h4 className="font-semibold mr-2">
                  {userName}
                </h4>
                <span className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-300">
                @{userUsername}
              </p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <BsThreeDotsVertical />
            </button>
          </div>
          
          <p className="mb-3">{post.content}</p>
          
          {post.image && (
            <div className="mb-3 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-auto max-h-96 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between text-gray-400 text-sm border-t border-white/10 pt-3">
            <button className="flex items-center hover:text-white">
              <FiHeart className="mr-1" /> {post.likes?.length || 0}
            </button>
            <button className="flex items-center hover:text-white">
              <FiMessageCircle className="mr-1" /> {post.comments?.length || 0}
            </button>
            <button className="flex items-center hover:text-white">
              <FiShare2 className="mr-1" /> Share
            </button>
          </div>
        </div>
      );
    });
  };

  // Fetch current user data and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user data
        const userData = await authService.getCurrentUserProfile();
        console.log('Current user data:', userData);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      }
    };

    fetchData();
  }, []);

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
                    {currentUser?.profilePicture ? (
                      <img 
                        src={currentUser.profilePicture} 
                        alt={currentUser.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                        {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
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
                              <Button 
                                variant="outline" 
                                onClick={() => setShowCreatePost(false)} 
                                size="sm"
                                disabled={isCreatingPost}
                              >
                                Cancel
                              </Button>
                              <Button 
                                variant="primary" 
                                onClick={handleCreatePost}
                                size="sm"
                                disabled={!newPostContent.trim() || isCreatingPost}
                              >
                                {isCreatingPost ? 'Posting...' : 'Post'}
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setShowCreatePost(true)}
                            >
                              Post
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {renderPosts()}
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
