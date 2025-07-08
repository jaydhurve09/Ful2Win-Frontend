import api from './api';

// Environment configuration
const ENV = {
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  apiBaseUrl: process.env.REACT_APP_API_URL || '',
  apiUrl: import.meta.env.VITE_API_URL || ''
};

// Auth Service
const authService = {
  // Login user
  login: async (userData) => {
    try {
      console.log('Sending login request to /users/login');
      const response = await api.post('/users/login', {
        phone: userData.phoneNumber,
        password: userData.password
      });

      if (response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Set default auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token
        };
      }
      
      throw new Error(response.data?.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      // Clear auth data on error
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Get current user profile
  getCurrentUserProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, userData, isFormData = false) => {
    try {
      const config = {};
      
      // If it's a FormData request, set the correct headers
      if (isFormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        };
      }
      
      const response = await api.put(`/users/profile/${userId}`, userData, config);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
};

// Post Service
const postService = {
  // Create a new post
  createPost: async (postData) => {
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },

  // Get all posts
  getPosts: async (params = {}) => {
    try {
      const response = await api.get('/posts', { params });
      return response.data;
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  }
};

// Game Service
const gameService = {
  // Get game by ID
  getGame: async (gameId) => {
    try {
      const response = await api.get(`/games/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Get game error:', error);
      throw error;
    }
  },

  // Get all games
  getGames: async (params = {}) => {
    try {
      const response = await api.get('/games', { params });
      return response.data;
    } catch (error) {
      console.error('Get games error:', error);
      throw error;
    }
  },

  // Submit game score
  submitScore: async (gameId, scoreData) => {
    try {
      const response = await api.post(`/games/${gameId}/scores`, scoreData);
      return response.data;
    } catch (error) {
      console.error('Submit score error:', error);
      throw error;
    }
  }
};

export { authService, postService, gameService };
