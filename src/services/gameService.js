import api from './api';

const gameService = {
  /**
   * Get all available games
   * @returns {Promise<Array>} Array of game objects
   */
  async getAllGames() {
    try {
      const response = await api.get('/games');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  },

  /**
   * Get a single game by ID
   * @param {string} gameId - The ID of the game to fetch
   * @returns {Promise<Object>} Game object
   */
  async getGameById(gameId) {
    try {
      const response = await api.get(`/games/${gameId}`);
      return response.data.data || null;
    } catch (error) {
      console.error(`Error fetching game ${gameId}:`, error);
      throw error;
    }
  },

  /**
   * Start a new game session
   * @param {string} gameId - The ID of the game to start
   * @param {Object} options - Game options (difficulty, mode, etc.)
   * @returns {Promise<Object>} Game session data
   */
  async startGame(gameId, options = {}) {
    try {
      const response = await api.post(`/games/${gameId}/start`, options);
      return response.data.data || null;
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  },

  /**
   * Submit game results
   * @param {string} sessionId - The game session ID
   * @param {Object} results - Game results (score, moves, time, etc.)
   * @returns {Promise<Object>} Result submission response
   */
  async submitGameResults(sessionId, results) {
    try {
      const response = await api.post(`/game-sessions/${sessionId}/complete`, results);
      return response.data.data || null;
    } catch (error) {
      console.error('Error submitting game results:', error);
      throw error;
    }
  },

  /**
   * Get leaderboard for a game
   * @param {string} gameId - The ID of the game
   * @param {Object} options - Query options (limit, offset, timeRange)
   * @returns {Promise<Array>} Leaderboard entries
   */
  async getLeaderboard(gameId, options = {}) {
    try {
      const response = await api.get(`/games/${gameId}/leaderboard`, { params: options });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }
};

export default gameService;
