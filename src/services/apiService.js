import axios from 'axios';

// API Configuration
const api = axios.create({
  baseURL: 'https://api.fulboost.fun/api',
  timeout: 30000, // 30 seconds
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  transformRequest: [
    function (data, headers) {
      // Ensure we're sending proper JSON
      if (data) {
        return JSON.stringify(data);
      }
      return data;
    }
  ],
  transformResponse: [
    (data) => {
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    }
  ],
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Resolve only if status code is less than 500
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

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
      console.log('Sending login request to /users/login');
      const loginData = {
        phoneNumber: userData.phoneNumber, // Changed from phone to phoneNumber to match backend
        password: userData.password
      };
      
      console.log('Login request data:', loginData);
      const response = await api.post('/users/login', loginData, {
        headers: {
          'Content-Type': 'application/json'
        }
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
  // Create a new post - simplified for text and image uploads
  createPost: async (postData) => {
    try {
      let formData = new FormData();
      
      // Handle both text content and file uploads
      if (postData.content) {
        formData.append('content', postData.content);
      }
      
      // Handle file upload if present
      if (postData.image) {
        formData.append('image', postData.image);
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/v1/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData.message || 'Failed to create post');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },

  // Get all posts
  getPosts: async (params = {}) => {
    try {
      const response = await api.get('/api/posts', { 
        params: {
          ...params,
          sort: params.sort || '-createdAt',
          limit: params.limit || 20,
          populate: 'user,author,createdBy'
        },
        // Ensure the baseURL is not overridden
        baseURL: ''
      });
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
      console.log(`Fetching game with ID: ${gameId}`);
      const response = await api.get(`/games/${gameId}`);
      console.log('Game response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get game error:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response',
        config: error.config ? {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers
        } : 'No config'
      });
      throw error;
    }
  },

  // Get all games
  getGames: async (params = {}) => {
    try {
      console.log('Fetching games with params:', params);
      const response = await api.get('/games', { params });
      console.log('Games response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get games error:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response',
        config: error.config ? {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers
        } : 'No config',
        stack: error.stack
      });
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
