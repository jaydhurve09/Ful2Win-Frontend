// IMPORTANT: All post-related API calls must use '/posts' (not '/users/posts').
// Authorization and Content-Type headers are managed globally by the axios instance in api.js.
// Do NOT set these headers manually in this file.
console.info('postService.js loaded - version 2025-07-07T15:01:42+05:30');
import api from './api';

const postService = {
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
