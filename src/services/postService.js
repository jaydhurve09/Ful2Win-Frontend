import api from './api';

const postService = {
  /**
   * Get all posts
   * @param {Object} [filters] - Optional filters for posts
   * @returns {Promise<Array>} Array of posts
   */
  async getPosts(filters = {}) {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/posts', {
        params: {
          ...filters,
          populate: 'user,author,createdBy'  // Ensure we get user data populated
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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
      const response = await api.put(`/posts/${postId}`, postData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
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
      const token = localStorage.getItem('token');
      const response = await api.delete(`/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
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
      const token = localStorage.getItem('token');
      const response = await api.post(
        `/api/posts/${postId}/report`,
        reportData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error reporting post:', error);
      throw error;
    }
  }
};

export default postService;
