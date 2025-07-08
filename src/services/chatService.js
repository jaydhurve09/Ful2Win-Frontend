import api from './api';

const chatService = {
  /**
   * Get conversation between two users
   * @param {string} currentUserId - Current user's ID
   * @param {string} otherUserId - Other user's ID
   * @returns {Promise<Array>} List of messages
   */
  async getConversation(currentUserId, otherUserId) {
    try {
      const response = await api.get(
        `/api/messages/conversation?user1=${currentUserId}&user2=${otherUserId}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  /**
   * Send a message
   * @param {string} recipientId - Recipient's user ID
   * @param {string} content - Message content
   * @returns {Promise<Object>} Sent message data
   */
  async sendMessage(recipientId, content) {
    try {
      const response = await api.post('/api/messages', {
        recipient: recipientId,
        content: content.trim()
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Mark messages as read
   * @param {string} messageIds - Array of message IDs to mark as read
   * @returns {Promise<Object>} Response data
   */
  async markAsRead(messageIds) {
    try {
      const response = await api.patch('/api/messages/read', { messageIds });
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  /**
   * Get unread message count
   * @returns {Promise<number>} Count of unread messages
   */
  async getUnreadCount() {
    try {
      const response = await api.get('/api/messages/unread-count');
      return response.data.count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  /**
   * Get recent conversations
   * @param {number} limit - Maximum number of conversations to return
   * @returns {Promise<Array>} List of recent conversations
   */
  async getRecentConversations(limit = 10) {
    try {
      const response = await api.get(`/api/messages/conversations?limit=${limit}`);
      return response.data || [];
    } catch (error) {
      console.error('Error getting recent conversations:', error);
      return [];
    }
  }
};

export default chatService;
