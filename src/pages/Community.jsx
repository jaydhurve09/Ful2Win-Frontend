import React, { useState, useEffect, useRef } from 'react';
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
import { BsThreeDotsVertical, BsPencil, BsTrash, BsHeart, BsChat, BsShare, BsBookmark, BsEmojiSmile } from 'react-icons/bs';
import { FaRegComment, FaRegBookmark, FaBookmark, FaRegHeart, FaHeart, FaRegShareSquare, FaImage, FaVideo, FaPoll } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { formatTimeAgo } from '../utils/timeUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api, { authService } from '../services/api';

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const [showCommentInput, setShowCommentInput] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // For Challenges redirect

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle like action
  const handleLike = async (postId) => {
    try {
      // Find the post being liked/unliked
      const postToUpdate = posts.find(post => post._id === postId);
      if (!postToUpdate) return;

      // Determine if this is a like or unlike action
      const isLiked = postToUpdate.likes?.includes(currentUser?._id);
      
      // Optimistic UI update - immediately update the UI
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const updatedLikes = isLiked 
            ? post.likes.filter(id => id !== currentUser?._id) // Remove like
            : [...(post.likes || []), currentUser?._id]; // Add like
          
          return {
            ...post,
            likes: updatedLikes,
            likeCount: isLiked 
              ? Math.max(0, (post.likeCount || post.likes?.length || 1) - 1) // Ensure count doesn't go below 0
              : (post.likeCount || post.likes?.length || 0) + 1
          };
        }
        return post;
      }));

      try {
        // API call to like/unlike post
        const response = await authService.likePost(postId, isLiked);
        
        // Update the post with the server response
        if (response?.success) {
          setPosts(posts.map(post => {
            if (post._id === postId) {
              return {
                ...post,
                likes: response.likes || post.likes,
                likeCount: response.likeCount || post.likeCount
              };
            }
            return post;
          }));
        }
      } catch (apiError) {
        console.error('API Error in handleLike:', apiError);
        // If API call fails, show error but don't revert UI (better UX)
        toast.error(isLiked ? 'Failed to unlike post' : 'Failed to like post');
      }
    } catch (error) {
      console.error('Error in handleLike:', error);
      toast.error('Something went wrong');
    }
  };

  // Fetch user profile by ID
  const fetchUserProfile = async (userId) => {
    try {
      const response = await authService.getUserProfile(userId);
      return response.data || response;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return {
        _id: userId,
        username: 'user',
        fullName: 'User',
        profilePicture: null
      };
    }
  };

  // Process comments to ensure they have complete user data
  const processComments = async (comments = []) => {
    if (!Array.isArray(comments)) return [];
    
    const processedComments = [];
    
    for (const comment of comments) {
      try {
        let userData = comment.user;
        let userId = comment.user;
        
        // Handle different user reference formats
        if (typeof comment.user === 'string') {
          userId = comment.user; // User ID string
        } else if (comment.user?._id) {
          userId = comment.user._id; // User object with _id
          // If we already have complete user data, use it
          if (comment.user.username && comment.user.profilePicture) {
            userData = comment.user;
          }
        }
        
        // If we don't have complete user data, fetch it
        if (!userData?.username && userId) {
          try {
            userData = await fetchUserProfile(userId);
          } catch (err) {
            console.error(`Error fetching user ${userId} for comment:`, err);
            userData = {
              _id: userId,
              username: 'user',
              fullName: 'User',
              profilePicture: null
            };
          }
        }
        
        // Ensure we have a valid user object
        const safeUserData = userData ? {
          _id: userData._id || userId || 'unknown',
          username: userData.username || 'user',
          fullName: userData.fullName || userData.username || 'User',
          profilePicture: userData.profilePicture || null
        } : {
          _id: 'unknown',
          username: 'user',
          fullName: 'User',
          profilePicture: null
        };
        
        processedComments.push({
          ...comment,
          user: safeUserData,
          // Ensure we have a valid date
          createdAt: comment.createdAt || new Date().toISOString(),
          // Ensure we have content
          content: comment.content || comment.comment || ''
        });
      } catch (error) {
        console.error('Error processing comment:', error, comment);
        // Add a fallback comment if processing fails
        processedComments.push({
          ...comment,
          user: {
            _id: 'error',
            username: 'user',
            fullName: 'Error Loading User',
            profilePicture: null
          },
          content: comment.content || 'Error loading comment',
          createdAt: comment.createdAt || new Date().toISOString()
        });
      }
    }
    
    return processedComments;
  };

  // Handle comment submission
  const handleComment = async (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;
    
    try {
      // Ensure we have a valid current user
      if (!currentUser?._id) {
        throw new Error('You must be logged in to comment');
      }

      // Get fresh user data to ensure we have the latest profile info
      let userData;
      try {
        userData = await fetchUserProfile(currentUser._id);
      } catch (error) {
        console.error('Error fetching current user data:', error);
        // Fallback to existing data if fetch fails
        userData = {
          _id: currentUser._id,
          username: currentUser.username || 'user',
          fullName: currentUser.fullName || currentUser.username || 'User',
          profilePicture: currentUser.profilePicture
        };
      }

      // Create a temporary comment for optimistic UI
      const tempCommentId = `temp-${Date.now()}`;
      const newComment = {
        _id: tempCommentId,
        content: commentText,
        user: userData,
        createdAt: new Date().toISOString(),
        isTemp: true
      };

      // Optimistic UI update
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            const currentComments = Array.isArray(post.comments) ? post.comments : [];
            return {
              ...post,
              comments: [...currentComments, newComment],
              commentCount: (post.commentCount || currentComments.length) + 1
            };
          }
          return post;
        })
      );

      // Clear input
      setCommentInputs(prev => ({
        ...prev,
        [postId]: ''
      }));

      try {
        // API call to add comment
        const response = await authService.addComment(postId, { 
          comment: commentText
        });
        
        if (response?.data) {
          // Process the server's response to ensure we have user data
          const processedComments = await processComments([response.data]);
          const serverComment = processedComments[0];
          
          if (serverComment) {
            // Update the post with the server's response
            setPosts(prevPosts => 
              prevPosts.map(post => {
                if (post._id === postId) {
                  // Remove temp comment and add the server's comment with user data
                  const filteredComments = (post.comments || []).filter(
                    c => !c.isTemp || c._id !== tempCommentId
                  );
                  
                  return {
                    ...post,
                    comments: [...filteredComments, serverComment],
                    commentCount: post.commentCount || filteredComments.length + 1
                  };
                }
                return post;
              })
            );
          }
          
          return response.data;
        } else {
          throw new Error('Failed to add comment: Invalid server response');
        }
      } catch (apiError) {
        console.error('API Error in handleComment:', apiError);
        // Remove the temporary comment on error
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post._id === postId) {
              const filteredComments = (post.comments || []).filter(
                comment => comment?._id !== tempCommentId
              );
              
              return {
                ...post,
                comments: filteredComments,
                commentCount: Math.max(0, (post.commentCount || 0) - 1)
              };
            }
            return post;
          })
        );
        throw new Error(apiError.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error in handleComment:', error);
      toast.error(error.message || 'Failed to add comment');
    }
  };

  // Function to enhance posts with user data and process comments
  const enhancePostsWithUserData = async (posts) => {
    if (!Array.isArray(posts)) return [];
    
    try {
      const enhancedPosts = [];
      
      for (const post of posts) {
        try {
          // Process post user data
          let userData;
          let userId = post.user?._id || post.author?._id || post.author || post.createdBy?._id || post.createdBy;
          
          // If post already has complete user data, use it
          if (post.user?._id && post.user?.username) {
            userData = post.user;
          } 
          // If we have a user ID but no complete user data, fetch it
          else if (userId) {
            try {
              userData = await fetchUserProfile(userId);
            } catch (err) {
              console.error(`Error fetching user ${userId} for post:`, err);
              userData = {
                _id: userId,
                username: 'user',
                fullName: 'User',
                profilePicture: null
              };
            }
          }
          
          // Process comments for this post
          let processedComments = [];
          if (Array.isArray(post.comments) && post.comments.length > 0) {
            processedComments = await processComments(post.comments);
          }
          
          // Create enhanced post with user data and processed comments
          const enhancedPost = {
            ...post,
            user: userData || { 
              _id: 'unknown', 
              username: 'user', 
              fullName: 'Unknown User',
              profilePicture: null 
            },
            comments: processedComments,
            // Ensure we have all required post fields
            likes: Array.isArray(post.likes) ? post.likes : [],
            likeCount: post.likeCount || post.likes?.length || 0,
            commentCount: post.commentCount || post.comments?.length || 0,
            createdAt: post.createdAt || new Date().toISOString(),
            content: post.content || ''
          };
          
          enhancedPosts.push(enhancedPost);
        } catch (error) {
          console.error(`Error processing post ${post._id || 'unknown'}:`, error);
          // If there's an error, add the post with minimal data
          enhancedPosts.push({
            ...post,
            user: post.user || post.author || { 
              _id: 'error', 
              username: 'user', 
              fullName: 'Error Loading User',
              profilePicture: null 
            },
            comments: Array.isArray(post.comments) ? post.comments : [],
            likes: Array.isArray(post.likes) ? post.likes : [],
            likeCount: post.likeCount || post.likes?.length || 0,
            commentCount: post.commentCount || post.comments?.length || 0,
            createdAt: post.createdAt || new Date().toISOString(),
            content: post.content || 'Error loading post content'
          });
        }
      }
      
      return enhancedPosts;
    } catch (error) {
      console.error('Error in enhancePostsWithUserData:', error);
      // Fallback to original posts if something goes wrong
      return posts.map(post => ({
        ...post,
        user: post.user || post.author || { 
          _id: 'unknown', 
          username: 'user', 
          fullName: 'Unknown User',
          profilePicture: null 
        },
        comments: Array.isArray(post.comments) ? post.comments : [],
        likes: Array.isArray(post.likes) ? post.likes : [],
        likeCount: post.likeCount || post.likes?.length || 0,
        commentCount: post.commentCount || post.comments?.length || 0,
        createdAt: post.createdAt || new Date().toISOString(),
        content: post.content || ''
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
        setCurrentUser(userData);

        // Fetch community posts with user data populated
        let postsData = await authService.getCommunityPosts({ 
          sort: '-createdAt',
          limit: 20,
          populate: 'user author createdBy', // Include all possible user reference fields
        });
        
        // Process posts to ensure we have user data
        if (Array.isArray(postsData)) {
          // First try to use the populated user data
          const processedPosts = postsData.map(post => ({
            ...post,
            user: post.user || post.author || post.createdBy || null
          }));
          
          // Then enhance any posts that still don't have user data
          const enhancedPosts = await enhancePostsWithUserData(processedPosts);
          setPosts(enhancedPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        toast.error('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    try {
      const file = e.target.files[0];
      
      if (!file) {
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error(`Unsupported file type. Please upload an image or video file.`);
        return;
      }

      // Check file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('File size should be less than 5MB');
        return;
      }

      console.log('File is valid, creating preview URL...');
      const previewUrl = URL.createObjectURL(file);
      console.log('Preview URL created:', previewUrl);
      
      setSelectedFile(file);
      setFileType(file.type.startsWith('image/') ? 'image' : 'video');
      setPreviewUrl(previewUrl);
      
    } catch (error) {
      console.error('Error in handleFileChange:', error);
      toast.error('Failed to process the selected file');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFileType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  // Filter and sort posts based on active tab
  const filteredPosts = React.useMemo(() => {
    let result = [...posts];
    
    switch(activeType) {
      case 'popular':
        // Sort by number of likes (descending)
        result.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
        
      case 'recent':
        // Sort by creation date (newest first)
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
        
      case 'discussions':
        // Sort by number of comments (descending)
        result = result.filter(post => (post.commentCount || 0) > 0)
                      .sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
        break;
        
      case 'all':
      default:
        // Default: sort by creation date (newest first)
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return result;
  }, [posts, activeType]);

  const handleCreatePost = async () => {
    console.log('handleCreatePost called');
    
    if (!newPostContent.trim() && !selectedFile) {
      const errorMsg = 'Please add some content or a file to your post';
      console.error(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      console.log('Starting post creation...');
      setIsCreatingPost(true);
      
      // Create FormData
      const formData = new FormData();
      
      // Add file if selected
      if (selectedFile) {
        console.log('Adding file to FormData:', {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size
        });
        formData.append('media', selectedFile);
      } else {
        console.log('No file selected for upload');
      }
      
      // Add post content
      console.log('Adding post content:', newPostContent);
      formData.append('content', newPostContent);
      
      // Add any additional data needed by your API
      const postData = {
        type: 'post',
        timestamp: new Date().toISOString()
      };
      formData.append('data', JSON.stringify(postData));
      
      // Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      
      console.log('Sending request to create post...');
      const response = await authService.createPost(formData);
      
      if (!response) {
        const errorMsg = 'No response from server';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log('Server response:', response);
      
      // Get current user data
      console.log('Fetching current user profile...');
      const currentUser = await authService.getCurrentUserProfile();
      console.log('Current user data:', currentUser);
      
      // Create new post object with proper media handling
      const newPost = {
        ...(response.data?.post || response), // Handle both response formats
        _id: response.data?.post?._id || response._id || `temp-${Date.now()}`,
        user: currentUser,
        content: response.data?.post?.content || response.content || newPostContent,
        createdAt: response.data?.post?.createdAt || response.createdAt || new Date().toISOString(),
        likes: [],
        comments: [],
        media: {
          url: response.data?.mediaUrl || response.mediaUrl || (selectedFile ? URL.createObjectURL(selectedFile) : null),
          type: response.data?.mediaType || response.mediaType || (selectedFile ? selectedFile.type : null)
        }
      };
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Created new post:', {
          ...newPost,
          media: newPost.media ? {
            ...newPost.media,
            // Don't log the entire URL if it's a blob URL as it can be very long
            url: newPost.media.url?.startsWith('blob:') ? 
                 '[Blob URL]' : 
                 newPost.media.url
          } : null
        });
      }
      
      // Update UI
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setNewPostContent('');
      setShowCreatePost(false);
      setSelectedFile(null);
      setPreviewUrl('');
      setFileType('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error in handleCreatePost:', error);
      
      // More specific error messages based on the error type
      let errorMessage = 'Failed to create post. Please try again.';
      
      if (error.message.includes('File size exceeds 5MB')) {
        errorMessage = 'File size exceeds 5MB limit. Please choose a smaller file.';
      } else if (error.message.includes('Invalid file type')) {
        errorMessage = 'Invalid file type. Please upload an image or video.';
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with error:', error.response.data);
        
        if (error.response.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (error.response.status === 413) {
          errorMessage = 'File is too large. Please choose a file smaller than 5MB.';
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid file type. Please upload an image or video.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Server error: ${error.response.status} ${error.response.statusText}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response from server:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsCreatingPost(false);
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

  const handleEditPost = async (postId) => {
    try {
      const response = await authService.updatePost(postId, { content: editContent });
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              content: editContent,
              isEdited: true,
              updatedAt: new Date().toISOString() 
            } 
          : post
      ));
      
      setEditingPost(null);
      setEditContent('');
      toast.success('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await authService.deletePost(postId);
        setPosts(posts.filter(post => post._id !== postId));
        toast.success('Post deleted successfully');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
    setDropdownOpen(null);
  };

  const openEditMode = (post) => {
    setEditingPost(post._id);
    setEditContent(post.content);
    setDropdownOpen(null);
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
      // Extract user data from the post
      const user = post.user || post.author || post.createdBy || { _id: 'unknown' };
      
      // Handle different possible user name fields
      const userName = user?.fullName || user?.name || user?.username || 'Unknown User';
      const userUsername = user?.username || 'user';
      const userAvatarUrl = user?.profilePicture || user?.avatar || null;
      const userInitial = userName.charAt(0).toUpperCase();
      
      const avatarElement = userAvatarUrl ? (
        <img 
          src={userAvatarUrl} 
          alt={userName}
          className="w-10 h-10 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
          {userInitial}
        </div>
      );
      
      return (
        <div key={post._id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
          <div className="flex items-start mb-3">
            <div 
              className="cursor-pointer mr-2"
              onClick={() => handleViewProfile(user?._id || user, post)}
            >
              {avatarElement}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h4 className="font-semibold mr-2">
                  {userName}
                </h4>
                <span className="text-xs text-dullBlue" title={new Date(post.createdAt).toLocaleString()}>
                  {formatTimeAgo(post.createdAt)}
                </span>
              </div>
              <p className="text-sm text-dullBlue">
                @{userUsername}
              </p>
            </div>
            {currentUser?._id === user?._id && (
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="text-dullBlue hover:text-white p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(dropdownOpen === post._id ? null : post._id);
                  }}
                >
                  <BsThreeDotsVertical />
                </button>
                
                {dropdownOpen === post._id && (
                  <div className="absolute right-0 mt-2 w-36 bg-gray-800 rounded-md shadow-lg z-10 border border-white/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditMode(post);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10"
                    >
                      <BsPencil className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post._id);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                    >
                      <BsTrash className="mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {editingPost === post._id ? (
            <div className="mb-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-white/30 mb-2"
                rows="3"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingPost(null)}
                  className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditPost(post._id)}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 rounded-md"
                  disabled={!editContent.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <p className="whitespace-pre-wrap">{post.content}</p>
              {post.isEdited && (
                <span className="text-xs text-dullBlue mt-1 block">
                  (edited)
                </span>
              )}
            </div>
          )}
          
          {/* Handle both old format (image) and new format (media) */}
          {(post.image || (post.media && post.media.url) || (post.images && post.images.length > 0)) && (
            <div className="mb-3 rounded-lg overflow-hidden">
              
              {/* Handle single image from 'image' field (old format) */}
              {post.image && (
                <img 
                  src={post.image} 
                  alt="Post content" 
                  className="w-full h-auto max-h-96 object-contain rounded-lg bg-black/20"
                  onError={(e) => {
                    console.error('Error loading image (old format):', {
                      url: post.image,
                      postId: post._id
                    });
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              {/* Handle single media from 'media' field */}
              {!post.image && post.media && post.media.url && (
                <>
                  {(!post.media.type || post.media.type.startsWith('image/')) ? (
                    <img 
                      src={post.media.url} 
                      alt="Post content" 
                      className="w-full h-auto max-h-96 object-contain rounded-lg bg-black/20"
                      onError={(e) => {
                        console.error('Error loading image (media format):', {
                          url: post.media.url,
                          type: post.media.type,
                          postId: post._id
                        });
                        e.target.style.display = 'none';
                      }}
                      onLoad={() => {
                        if (process.env.NODE_ENV === 'development') {
                          console.log('Image loaded (media format):', post.media.url);
                        }
                      }}
                    />
                  ) : post.media.type.startsWith('video/') ? (
                    <video 
                      src={post.media.url}
                      controls
                      className="w-full max-h-96 rounded-lg"
                      onError={(e) => {
                        console.error('Error loading video:', {
                          url: post.media.url,
                          type: post.media.type,
                          postId: post._id
                        });
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="p-4 bg-gray-800/50 text-center text-gray-400 rounded-lg">
                      Unsupported media type: {post.media.type || 'unknown'}
                    </div>
                  )}
                </>
              )}
              
              {/* Handle multiple images from 'images' array */}
              {!post.image && !(post.media && post.media.url) && post.images && post.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url || img}
                      alt={`Post content ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        console.error('Error loading image from images array:', {
                          url: img.url || img,
                          index: idx,
                          postId: post._id
                        });
                        e.target.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-dullBlue hover:text-white text-sm border-t border-white/10 pt-3">
              <button 
                className={`flex items-center group transition-colors ${post.likes?.includes(currentUser?._id) ? 'text-red-500' : 'text-dullBlue hover:text-red-500'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post._id);
                }}
                title={post.likes?.includes(currentUser?._id) ? 'Unlike' : 'Like'}
              >
                {post.likes?.includes(currentUser?._id) ? (
                  <FaHeart className="mr-1 text-red-500 animate-scale" />
                ) : (
                  <FiHeart className="mr-1 group-hover:scale-110 transition-transform" />
                )} 
                <span className="ml-1">{post.likeCount || post.likes?.length || 0}</span>
              </button>
              <div className="flex items-center">
                <button 
                  className={`flex items-center ${showComments[post._id] ? 'text-blue-400' : 'hover:text-white'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle comments visibility and reset showAllComments to false
                    const isShowingComments = !showComments[post._id];
                    setShowComments(prev => ({
                      ...prev,
                      [post._id]: isShowingComments
                    }));
                    // Reset showAllComments to false when toggling comments
                    if (isShowingComments) {
                      setShowAllComments(prev => ({
                        ...prev,
                        [post._id]: false
                      }));
                    }
                  }}
                  title="View comments"
                >
                  <FiMessageCircle className="mr-1" /> {post.commentCount || post.comments?.length || 0}
                </button>
                <button 
                  className="ml-2 text-xs text-blue-400 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Focus the comment input when clicking the comment button
                    setShowCommentInput(prev => prev === post._id ? null : post._id);
                    // Show comments if not already shown
                    if (!showComments[post._id]) {
                      setShowComments(prev => ({
                        ...prev,
                        [post._id]: true
                      }));
                    }
                  }}
                >
                </button>
              </div>
              <button 
                className="flex items-center text-dullBlue hover:text-white"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    // Create share data
                    const shareData = {
                      title: 'Check out this post on Ful2Win',
                      text: post.content ? 
                        (post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content) : 
                        'Check out this post',
                      url: `${window.location.origin}/community/post/${post._id}`
                    };

                    // Add image URL if available
                    const imageUrl = post.image || (post.media?.type?.startsWith('image/') ? post.media.url : null) || 
                                  (post.images?.length > 0 ? post.images[0].url || post.images[0] : null);
                    
                    if (imageUrl) {
                      shareData.files = [new File([await (await fetch(imageUrl)).blob()], 'post-image.jpg', { type: 'image/jpeg' })];
                    }

                    // Check if Web Share API is supported
                    if (navigator.share) {
                      await navigator.share(shareData);
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      await navigator.clipboard.writeText(shareData.url);
                      toast.success('Link copied to clipboard!');
                    }
                  } catch (err) {
                    // User cancelled the share or an error occurred
                    if (err.name !== 'AbortError') {
                      console.error('Error sharing:', err);
                      toast.error('Failed to share post');
                    }
                  }
                }}
                title="Share this post"
              >
                <FiShare2 className="mr-1" /> Share
              </button>
            </div>

            {/* Comment input - Show when comments are visible */}
            {showComments[post._id] && (
              <div className="mt-3 flex items-center">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/50"
                  value={commentInputs[post._id] || ''}
                  onChange={(e) => setCommentInputs({...commentInputs, [post._id]: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                  autoFocus={showCommentInput === post._id}
                />
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-dullBlue hover:text-white px-3 py-2 rounded-r-lg text-sm font-medium transition-colors"
                  onClick={() => handleComment(post._id)}
                >
                  Post
                </button>
              </div>
            )}

            {/* Comments list - Only show if comments exist and the section is toggled */}
            {showComments[post._id] && (post.comments?.length > 0 || showCommentInput === post._id) && (
              <div className="mt-3 space-y-3 max-h-60 overflow-y-auto pr-2">
                <div className="flex justify-between items-center text-sm font-medium text-gray-400 border-b border-white/10 pb-1">
                  <span>Comments</span>
                  <span className="text-xs">{post.commentCount || post.comments?.length} total</span>
                </div>
                
                {/* Show only first 2 comments by default */}
                {[...post.comments]
                  .filter(comment => comment) // Filter out any null/undefined comments
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
                  .slice(0, showAllComments[post._id] ? post.comments.length : 2)
                  .map((comment, idx) => {
                    // Comment user data should already be processed by processComments
                    const user = comment.user || {
                      _id: comment.userId || 'unknown',
                      username: 'User',
                      fullName: 'User',
                      profilePicture: null
                    };
                    
                    const createdAt = comment.createdAt || comment.date || new Date().toISOString();
                    const content = comment.content || comment.comment || '';
                    const commentId = comment._id || `comment-${Date.now()}-${idx}`;
                    
                    return (
                      <div key={commentId} className="bg-white/5 rounded-lg p-3 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0">
                            {user?.profilePicture ? (
                              <img 
                                src={user.profilePicture} 
                                alt={user.username || 'User'}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  // If image fails to load, show fallback
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium ${
                              user?.profilePicture ? 'hidden' : 'flex'
                            }`}>
                              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-blue-300 truncate">
                                {user?.username || 'User'}
                              </span>
                              <span className="text-xs text-gray-400" title={new Date(createdAt).toLocaleString()}>
                                {formatTimeAgo(createdAt)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-gray-200 break-words">
                              {content}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                
                {/* Show 'View more' button if there are more than 2 comments */}
                {!showAllComments[post._id] && post.comments.length > 2 && (
                  <button 
                    onClick={() => setShowAllComments(prev => ({ ...prev, [post._id]: true }))}
                    className="text-sm text-blue-400 hover:text-blue-300 w-full text-center py-1"
                  >
                    View {post.comments.length - 2} more comments
                  </button>
                )}
                
                {/* Show 'Show less' button when all comments are shown */}
                {showAllComments[post._id] && post.comments.length > 2 && (
                  <button 
                    onClick={() => setShowAllComments(prev => ({ ...prev, [post._id]: false }))}
                    className="text-sm text-gray-400 hover:text-gray-300 w-full text-center py-1"
                  >
                    Show less
                  </button>
                )}
              </div>
            )}
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
                      <div className="w-10 h-10 rounded-full border-2 border-dullBlue p-0.5 mr-3 flex-shrink-0">
                        <img 
                          src={currentUser.profilePicture} 
                          alt={currentUser.name || 'User'}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-dullBlue flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
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
                          {previewUrl && (
                            <div className="mt-2 relative">
                              {fileType === 'image' ? (
                                <img 
                                  src={previewUrl} 
                                  alt="Preview" 
                                  className="max-h-60 w-auto rounded-lg object-contain"
                                />
                              ) : (
                                <video 
                                  src={previewUrl} 
                                  controls 
                                  className="max-h-60 w-auto rounded-lg"
                                />
                              )}
                              <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1"
                                title="Remove media"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                        <div className="flex space-x-2">
                          <input
                            type="file"
                            id="media-upload"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/x-matroska"
                            onChange={handleFileChange}
                          />
                          <button 
                            type="button"
                            className="flex items-center text-sm text-gray-300 hover:text-white whitespace-nowrap"
                            onClick={() => document.getElementById('media-upload').click()}
                          >
                            <FaImage className="mr-1" /> {fileType === 'video' ? 'Change Media' : 'Photo'}
                          </button>
                          {/* <button className="flex items-center text-sm text-gray-300 hover:text-white whitespace-nowrap">
                            <FaPoll className="mr-1" /> Poll
                          </button> */}
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
