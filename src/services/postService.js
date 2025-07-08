import axios from 'axios';

const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_API_BACKEND_URL;

const postService = {
  /**
   * Create a new post
   * @param {Object} postData - Post data containing content and optional tags
   * @param {File} [file=null] - Optional file to upload with the post
   * @returns {Promise<Object>} Created post data
   */
  async createPost(postData, file = null) {
    try {
      // Create a new FormData instance
      const formData = new FormData();
      
      // Add content and tags to formData
      if (postData.content) {
        formData.append('content', postData.content);
      }
      
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
          // Append file with the correct field name that backend expects
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

      // Get the token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create a new XMLHttpRequest for better control over the upload
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('POST', `${baseURL}/api/posts`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            console.log('Post created successfully:', response);
            resolve({ data: response });
          } else {
            let error;
            try {
              error = new Error(JSON.parse(xhr.responseText).message || 'Failed to create post');
              error.response = { data: JSON.parse(xhr.responseText) };
            } catch (e) {
              error = new Error('Failed to create post');
            }
            error.status = xhr.status;
            console.error('Error creating post:', error);
            reject(error);
          }
        };
        
        xhr.onerror = function() {
          const error = new Error('Network error occurred');
          console.error('Network error:', error);
          reject(error);
        };
        
        // Don't set Content-Type header, let the browser set it with the correct boundary
        xhr.withCredentials = true;
        
        // Send the form data
        xhr.send(formData);
      });
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

      // Get the token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create a new axios instance with the correct configuration
      const axiosInstance = axios.create({
        baseURL,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        timeout: 60000
      });
      
      // Make the request
      const response = await axiosInstance.get('/api/posts', {
        params: {
          ...filters,
          sort: filters.sort || '-createdAt',
          limit: filters.limit || 20,
          populate: 'user,author,createdBy'  // Ensure we get user data populated
        }
      });
      
      // Process the response to ensure consistent post structure
      const responseData = response.data;
      const posts = Array.isArray(responseData) ? responseData : [];
      
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
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
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
