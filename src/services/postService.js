import axios from 'axios';
import api from './api';


const baseURL =  import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_API_BACKEND_URL;

const postService = {
  /**
   * Create a new post
   * @param {FormData} formData - Form data containing post content and optional media
   * @returns {Promise<Object>} Created post data
   */


  async createPost(postData, file = null) {
    try {
      // Create a new FormData instance
      const formData = new FormData();
      
      // Add content and tags to formData
      formData.append('content', postData.content || '');
      if (postData.tags) {
        formData.append('tags', postData.tags);
      }
      
      // Handle file upload if present
      if (file) {
        try {
          // Ensure we have a proper File object
          if (!(file instanceof File)) {
            file = new File([file], file.name || 'file', {
              type: file.type || 'application/octet-stream',
            });
          }
          formData.append('media', file);
          console.log('File prepared for upload:', {
            name: file.name,
            type: file.type,
            size: file.size
          });
        } catch (fileError) {
          console.error('Error preparing file:', fileError);
          throw new Error('Failed to prepare file for upload');
        }
      }

      // Log formData entries for debugging
      console.log('Form data entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `[File] ${value.name}` : value);
      }

      // Get the token for manual header
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Make the request with fetch API for better control
      console.log('Sending POST request to /api/posts');
      const response = await fetch(`${baseURL}/api/posts`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Let the browser set the Content-Type with boundary
        },
        credentials: 'include'
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Server responded with error:', responseData);
        throw new Error(responseData.message || 'Failed to create post');
      }

      console.log('Post created successfully:', responseData);
      return { data: responseData };
    } catch (error) {
      console.error('Error in createPost:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error; // Re-throw to be handled by the caller
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
      console.log('[postService.js:getPosts] Requesting posts with params:', {
        ...filters,
        sort: filters.sort || '-createdAt',
        limit: filters.limit || 20,
        populate: 'user,author,createdBy'
      });
      
      // Use the full path to the posts endpoint with /api prefix
      const response = await api.get('/api/posts', {
        params: {
          ...filters,
          sort: filters.sort || '-createdAt',
          limit: filters.limit || 20,
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
      const response = await api.put(`/posts/${postId}`, postData);
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
      const response = await api.delete(`/posts/${postId}`);
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
        `/posts/${postId}/report`,
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
