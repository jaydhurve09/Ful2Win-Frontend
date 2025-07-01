import axios from 'axios';

// Environment configuration
const ENV = {
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  apiUrl: import.meta.env.VITE_API_URL || ''
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: ENV.isProduction ? '' : ENV.apiBaseUrl, // Use relative URLs in production
  timeout: 30000, // 30 seconds
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Resolve only if status code is less than 500
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
const authService = {
  // Login user
  login: async (userData) => {
    try {
      console.log('Sending login request to /api/users/login');
      const response = await api.post('/api/users/login', {
        phoneNumber: userData.phoneNumber,
        email: userData.email,
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
      const response = await api.post('/api/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/api/users/logout');
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
      const response = await api.get('/api/users/me');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/api/users/profile/${userId}`, userData);
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
      const response = await api.post('/api/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },

  // Get all posts
  getPosts: async (params = {}) => {
    try {
      const response = await api.get('/api/posts', { params });
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
      const response = await api.get(`/api/games/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Get game error:', error);
      throw error;
    }
  },

  // Get all games
  getGames: async (params = {}) => {
    try {
      const response = await api.get('/api/games', { params });
      return response.data;
    } catch (error) {
      console.error('Get games error:', error);
      throw error;
    }
  },

  // Submit game score
  submitScore: async (gameId, scoreData) => {
    try {
      const response = await api.post(`/api/games/${gameId}/scores`, scoreData);
      return response.data;
    } catch (error) {
      console.error('Submit score error:', error);
      throw error;
    }
  }
};

export { authService, postService, gameService };
