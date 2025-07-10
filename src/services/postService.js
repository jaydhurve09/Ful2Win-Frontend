import api from './api';

const postService = {
  /**
   * Create a new post
   * @param {Object} postData - Post data containing content and optional tags
   * @param {File} [file=null] - Optional file to upload with the post
   * @returns {Promise<Object>} Created post data
   */
  async createPost(postData, file = null) {
    console.log('[PostService] Starting createPost with data:', {
      contentLength: postData?.content?.length || 0,
      hasFile: !!file,
      tags: postData?.tags
    });

    try {
      const formData = new FormData();
      
      // Add content to formData if it exists
      if (postData.content) {
        formData.append('content', postData.content);
        console.log('[PostService] Added content to formData');
      }
      
      // Handle tags - ensure it's properly formatted
      if (postData.tags) {
        const tagsArray = Array.isArray(postData.tags) ? postData.tags : [postData.tags];
        formData.append('tags', JSON.stringify(tagsArray));
        console.log('[PostService] Added tags to formData:', tagsArray);
      }
      
      // Handle file upload if present
      if (file) {
        console.log('[PostService] Processing file upload...');
        try {
          // Ensure we have a proper File object
          if (!(file instanceof File)) {
            const fileExtension = file.name?.split('.').pop() || 'jpg';
            file = new File(
              [file], 
              `upload-${Date.now()}.${fileExtension}`, 
              { type: file.type || 'application/octet-stream' }
            );
          }
          
          formData.append('media', file);
          console.log('[PostService] File prepared for upload:', {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
          });
        } catch (fileError) {
          console.error('[PostService] Error preparing file:', {
            error: fileError.message,
            stack: fileError.stack,
            fileType: typeof file,
            fileProps: Object.keys(file || {})
          });
          throw new Error('Failed to process file for upload');
        }
      }

      // Log form data keys for debugging (don't log file content)
      console.log('[PostService] FormData keys:');
      for (let key of formData.keys()) {
        console.log(`- ${key}`);
      }

      // Don't set Content-Type header - let the browser set it with boundary
      const config = {
        headers: {
          'Accept': 'application/json',
          // Remove Content-Type to let the browser set it with the correct boundary
        },
        // Important for FormData with files
        timeout: 30000, // 30 seconds timeout
        withCredentials: true // Include cookies in the request
      };

      console.log('[PostService] Sending request to /api/posts');
      const response = await api.post('/api/posts', formData, config);
      console.log('[PostService] Post created successfully:', {
        postId: response.data?._id,
        hasMedia: !!response.data?.media
      });
      return response.data;
    } catch (error) {
      console.error('[PostService] Error in createPost:', {
        error: error.message,
        errorType: error.constructor.name,
        stack: error.stack,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        } : null,
        request: error.request ? {
          method: error.config?.method,
          url: error.config?.url,
          headers: error.config?.headers,
          data: error.config?.data
        } : null
      });
      throw error;
    }
  },

  /**
   * Get all posts with optional filters
   * @param {Object} filters - Filter parameters
   * @param {string} [filters.sort=-createdAt] - Sort order
   * @param {number} [filters.limit=20] - Number of posts to return
   * @param {string} [filters.userId] - Filter by user ID
   * @param {string} [filters.tournamentId] - Filter by tournament ID
   * @returns {Promise<Array>} List of posts
   */
  async getPosts(filters = {}) {
    try {
      const response = await api.get('/posts', {
        params: {
          ...filters,
          sort: filters.sort || '-createdAt',
          limit: filters.limit || 20,
          populate: 'user,author,createdBy'
        }
      });
      
      // Process the response to ensure consistent post structure
      const responseData = response.data;
      const posts = Array.isArray(responseData) ? responseData : [];
      
      return posts.map(post => ({
        ...post,
        user: post.user || post.author || post.createdBy || {
          _id: 'unknown',
          username: 'Unknown User',
          profilePicture: ''
        },
        createdAt: post.createdAt || new Date().toISOString(),
        content: post.content || '',
        media: Array.isArray(post.media) ? post.media : []
      }));
    } catch (error) {
      console.error('[PostService] Error fetching posts:', {
        error: error.message,
        errorType: error.constructor.name,
        stack: error.stack,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : null
      });
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
  },

  /**
   * Like or unlike a post
   * @param {string} postId - Post ID to like/unlike
   * @param {boolean} isLiked - Whether the post is already liked
   * @returns {Promise<Object>} Updated post data
   */
  async likePost(postId, isLiked) {
    console.log(`[PostService] ${isLiked ? 'Unliking' : 'Liking'} post:`, {
      postId,
      timestamp: new Date().toISOString()
    });

    try {
      const endpoint = isLiked ? `/posts/unlike` : `/posts/like`;
      console.log('[PostService] Using endpoint:', endpoint);
      
      // Get the current user's ID from localStorage or auth context
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('[PostService] Retrieved user from localStorage:', {
        userId: user?._id,
        hasUser: !!user
      });
      
      if (!user || !user._id) {
        const error = new Error('User not authenticated');
        console.error('[PostService] Authentication error:', error);
        throw error;
      }
      
      // Prepare request data
      const requestData = { 
        postId,
        userId: user._id 
      };
      
      console.log('[PostService] Sending like/unlike request:', requestData);
      
      const response = await api.post(endpoint, requestData);
      
      console.log(`[PostService] Successfully ${isLiked ? 'unliked' : 'liked'} post:`, {
        postId,
        response: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  /**
   * Add a comment to a post
   * @param {string} postId - Post ID to comment on
   * @param {string} content - Comment content
   * @returns {Promise<Object>} Created comment data
   */
  async addComment(postId, content) {
    console.log('[PostService] Adding comment:', {
      postId,
      contentLength: content?.length || 0,
      timestamp: new Date().toISOString()
    });

    try {
      const endpoint = `/posts/${postId}/comments`;
      const requestData = { content };
      
      console.log('[PostService] Sending comment request:', {
        endpoint,
        contentPreview: content?.substring(0, 50) + (content?.length > 50 ? '...' : '')
      });
      
      const response = await api.post(endpoint, requestData);
      
      console.log('[PostService] Successfully added comment:', {
        postId,
        commentId: response.data?._id,
        timestamp: new Date().toISOString()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  /**
   * Get comments for a post
   * @param {string} postId - Post ID to get comments for
   * @returns {Promise<Array>} List of comments
   */
  async getComments(postId) {
    try {
      const response = await api.get(`/api/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }
};

export default postService;
