import api from './api';

const authService = {
  /**
   * Check if a username is available
   * @param {string} username - Username to check
   * @returns {Promise<{available: boolean}>} Whether the username is available
   */
  async checkUsername(username) {
    try {
      const response = await api.get(`/auth/check-username/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error checking username:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials
   * @returns {Promise<{user: Object, token: string}>} User data and JWT token
   */
  async login(credentials) {
    try {
      console.log('Sending login request with credentials:', credentials);
      
      // Make sure credentials has required fields
      if (!credentials.phoneNumber || !credentials.password) {
        throw new Error('Phone number and password are required');
      }

      // Make the login request with the correct endpoint path
      const response = await api.post('/users/login', {
        phoneNumber: credentials.phoneNumber,
        password: credentials.password
      });
      
      console.log('Login response:', response);
      
      // Format the response to match what AuthContext expects
      if (response.data) {
        let userData = response.data;
        let token = response.data.token;
        
        // Handle different response formats from the backend
        if (response.data.data) {
          userData = response.data.data;
          token = response.data.token || response.data.data.token;
        }
        
        if (token) {
          // Save token to localStorage
          localStorage.setItem('token', token);
          
          // Save user data to localStorage
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Return the expected format for AuthContext
            return {
              data: {
                success: true,
                token: token,
                data: userData
              }
            };
          }
        }
      }
      
      // If we get here, the response format wasn't as expected
      console.error('Unexpected login response format:', response.data);
      throw new Error('Invalid response format from server');
      
    } catch (error) {
      console.error('Login error details:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      let errorMessage = 'Login failed';
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.statusText || 'Login failed';
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message || 'Login failed';
      }
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Logout user and clear auth data
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optionally call backend logout endpoint if available
    // return api.post('/auth/logout');
  },

  /**
   * Clear all authentication data from storage
   */
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user's profile data
   * @returns {Promise<Object>} User profile data
   */
  async getCurrentUserProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.get('/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data) {
        const userData = response.data.data || response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      throw new Error('Failed to fetch user profile');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Clear invalid auth data
      if (error.response && error.response.status === 401) {
        this.clearAuthData();
      }
      throw error;
    }
  },

  /**
   * Get user's wallet balance
   * @returns {Promise<{balance: number, currency: string}>} Wallet balance
   */
  getWalletBalance: async () => {
    try {
      const response = await api.get('/users/me');
      const userData = response.data.data || response.data;
      const balance = userData.balance || 0;
      return { balance, currency: 'INR' };
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      // Return default values in case of error
      return { balance: 0, currency: 'INR' };
    }
  },

  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile(userId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.get(`/users/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data) {
        return response.data.data || response.data;
      }
      throw new Error('Failed to fetch user profile');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Clear invalid auth data
      if (error.response && error.response.status === 401) {
        this.clearAuthData();
      }
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserProfile(userId, userData, isFormData = false) {
    try {
      const config = {
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      const response = await api.put(`/users/profile/${userId}`, userData, config);
      
      if (response.data) {
        // Only update local storage if we have user data
        const userData = response.data.user || response.data.data || response.data;
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      if (error.response && error.response.status === 401) {
        this.clearAuthData();
      }
      throw error;
    }
  }
};

export default authService;
