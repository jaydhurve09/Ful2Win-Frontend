import api from './api';
import { processProfilePicture } from '../utils/imageUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      const response = await api.post('/users/register', userData);
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
      // Make sure credentials has required fields
      if (!credentials.phoneNumber || !credentials.password) {
        throw new Error('Phone number and password are required');
      }

      // Make the login request with the correct endpoint path
      const response = await api.post('/users/login', {
        phoneNumber: credentials.phoneNumber,
        password: credentials.password
      });

      toast.success(response.data.message || 'Login successful');

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
    
    if (response.data && response.data.success && response.data.data) {
      const userData = response.data.data;
      
      // Process the profile picture URL if it exists
      if (userData.profilePicture) {
        const processedUrl = processProfilePicture(userData.profilePicture);
        userData.profilePicture = processedUrl;
      } else {
        userData.profilePicture = '';
      }
      
      // Store the processed user data
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Failed to fetch user profile');
  } catch (error) {
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
    // Check for token first
    const token = localStorage.getItem('token');
    if (!token) {
      return { balance: 0, currency: 'INR' };
    }
    
    const response = await api.get('/users/me');
    const userData = response.data.data || response.data;
    const balance = userData.balance || 0;
    return { balance, currency: 'INR' };
  } catch (error) {

    // Clear auth data on 401
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
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
    // Get the token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    // Prepare headers
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    let dataToSend = userData;
    
    // Don't set Content-Type for FormData - let the browser set it with the correct boundary
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
      dataToSend = JSON.stringify(userData);
    }

    // Log request data (without logging file contents)
    if (isFormData && userData instanceof FormData) {
      const formDataObj = {};
      for (let [key, value] of userData.entries()) {
        formDataObj[key] = value instanceof File 
          ? `[File: ${value.name}, ${value.size} bytes, ${value.type}]` 
          : value;
      }
      
    } 
    // Make the API request
    const response = await api.put(
      `/users/profile/${userId}`,
      dataToSend,
      { 
        headers,
        // Important: Let the browser set the Content-Type with boundary for FormData
        transformRequest: isFormData ? [(data) => data] : undefined
      }
    );

    // Update local storage with the new user data
    if (response.data) {
      const updatedUser = response.data.user || response.data.data || response.data;
      if (updatedUser) {
        // Merge with existing user data to preserve any client-side only fields
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updatedUser }));
      }
      return response.data;
    }
    
    throw new Error('No data received from server');
  } catch (error) {
    console.error('Error updating user profile:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    // Handle specific error cases
    if (error.response) {
      // Unauthorized - clear auth data
      if (error.response.status === 401) {
        this.clearAuthData();
        throw new Error('Your session has expired. Please log in again.');
      }
      
      // Handle validation errors
      if (error.response.status === 400 || error.response.status === 422) {
        const errorMsg = error.response.data?.message || 'Validation failed';
        throw new Error(errorMsg);
      }
      
      // Handle file size errors
      if (error.response.status === 413) {
        throw new Error('File size is too large. Please upload a smaller file.');
      }
      
      // Handle file type errors
      if (error.response.status === 415) {
        throw new Error('Unsupported file type. Please upload a valid image (JPEG, PNG, etc.).');
      }
      
      // Handle server errors
      if (error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else if (error.message === 'Network Error') {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    
    // Default error
    throw error.message || 'Failed to update profile. Please try again.';
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
    const response = await api.delete(`/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}
};

export default authService;
