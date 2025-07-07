// IMPORTANT: All post-related API calls must use '/posts' (not '/users/posts').
// Authorization and Content-Type headers are managed globally by the axios instance in api.js.
// Do NOT set these headers manually in this file.
console.info('postService.js loaded - version 2025-07-07T15:01:42+05:30');
import api from './api';

const postService = {
  /**
   * Create a new post
   * @param {FormData} formData - Form data containing post content and optional media
   * @returns {Promise<Object>} Created post data
   */
  async createPost(postData, file = null) {
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      let response;
      
      if (file) {
        // If there's a file, use FormData
        const formData = new FormData();
        formData.append('media', file);
        formData.append('content', postData.content);
        
        response = await api.post('http://localhost:5000/api/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });
      } else {
        // For text-only posts, send as JSON
        response = await api.post('http://localhost:5000/api/posts', postData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        // If there's a validation error, show the specific error message
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response received from server. Please check your connection.');
      } else {
        console.error('Error message:', error.message);
        throw error;
      }
      
      throw new Error('Failed to create post. Please try again.');
    }
  },
  /**
   * Get all posts
   * @param {Object} [filters] - Optional filters for posts
   * @returns {Promise<Array>} Array of posts
   */
  /**
   * Only uses '/posts' endpoint. Never call '/users/posts' or construct endpoint dynamically.
   */
  async getPosts(filters = {}) {
    try {
      console.log('[postService.js:getPosts] Requesting /api/posts with params:', {
        ...filters,
        populate: 'user,author,createdBy'
      });
      const response = await api.get('http://localhost:5000/api/posts' || `${process.env.BACKEND_URL}api/posts`, {
        params: {
          ...filters,
          populate: 'user,author,createdBy'  // Ensure we get user data populated
        }
      });
      
      // Process the response to ensure consistent post structure
      const posts = Array.isArray(response.data) ? response.data : [];
      return posts.map(post => ({
        ...post,
        // Ensure we have a user object with all required fields
        user: post.user || post.author || post.createdBy || {
          _id: post.userId || 'unknown',
          username: 'user',
          fullName: 'Unknown User',
          profilePicture: null
        },
        // Ensure we have required post fields
        likes: Array.isArray(post.likes) ? post.likes : [],
        comments: Array.isArray(post.comments) ? post.comments : [],
        likeCount: post.likeCount || post.likes?.length || 0,
        commentCount: post.commentCount || post.comments?.length || 0,
        createdAt: post.createdAt || new Date().toISOString(),
        content: post.content || ''
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },
  /**
   * Update a post
   * @param {string} postId - Post ID
   * @param {Object} postData - Updated post data
   * @returns {Promise<Object>} Updated post data
   */
  async updatePost(postId, postData) {
    try {
      const response = await api.put(`http://localhost:5000/api/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  /**
   * Delete a post
   * @param {string} postId - Post ID to delete
   * @returns {Promise<Object>} Deletion response
   */
  async deletePost(postId) {
    try {
      const response = await api.delete(`http://localhost:5000/api/posts/{postId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  /**
   * Report a post
   * @param {string} postId - Post ID to report
   * @param {Object} reportData - Report data
   * @param {string} reportData.reason - Reason for reporting
   * @param {string} reportData.reportedUserId - ID of the user being reported
   * @returns {Promise<Object>} Report response
   */
  async reportPost(postId, reportData) {
    try {
      const response = await api.post(
        `/api/posts/${postId}/report`,
        reportData
      );
      return response.data;
    } catch (error) {
      console.error('Error reporting post:', error);
      throw error;
    }
  }
};

export default postService;
