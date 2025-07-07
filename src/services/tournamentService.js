import api from './api';

const tournamentService = {
  /**
   * Get all tournaments for a specific game
   * @param {string} gameId - The ID of the game
   * @returns {Promise<Array>} Array of tournament objects
   */
  async getTournamentsByGame(gameId) {
    try {
      const response = await api.get(`/tournaments/game/${gameId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  },

  /**
   * Get tournament details by ID
   * @param {string} tournamentId - The ID of the tournament
   * @returns {Promise<Object>} Tournament details
   */
  async getTournamentById(tournamentId) {
    try {
      const response = await api.get(`/tournaments/${tournamentId}`);
      return response.data.data || null;
    } catch (error) {
      console.error(`Error fetching tournament ${tournamentId}:`, error);
      throw error;
    }
  },

  /**
   * Join a tournament
   * @param {string} tournamentId - The ID of the tournament to join
   * @param {Object} options - Join options (e.g., entry fee payment method)
   * @returns {Promise<Object>} Join result
   */
  async joinTournament(tournamentId, options = {}) {
    try {
      const response = await api.post(`/tournaments/${tournamentId}/join`, options);
      return response.data.data || null;
    } catch (error) {
      console.error('Error joining tournament:', error);
      throw error;
    }
  },

  /**
   * Create a new tournament
   * @param {Object} tournamentData - Tournament creation data
   * @returns {Promise<Object>} Created tournament
   */
  async createTournament(tournamentData) {
    try {
      const response = await api.post('/tournaments', tournamentData);
      return response.data.data || null;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  },

  /**
   * Get leaderboard for a tournament
   * @param {string} tournamentId - The ID of the tournament
   * @returns {Promise<Array>} Leaderboard entries
   */
  async getTournamentLeaderboard(tournamentId) {
    try {
      const response = await api.get(`/tournaments/${tournamentId}/leaderboard`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching tournament leaderboard:', error);
      throw error;
    }
  },
  /**
   * Get tournaments the current user has participated in
   * @returns {Promise<Array>} Array of tournament history objects
   */
  async getMyTournamentHistory() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await api.get('/tournaments/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching user tournament history:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      throw error;
    }
  },

};

export default tournamentService;
