import axios from 'axios';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
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
    return status < 500; // Resolve all status codes less than 500
  }
});

// Request interceptor to add auth token and headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Don't override headers if they're already set
    if (!config.headers) {
      config.headers = {};
    }
    
    // Only set Authorization header if token exists and it's not explicitly set
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For FormData uploads, let the browser set the Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
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
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth service object
const authService = {
  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials { email/phoneNumber, password }
   * @returns {Promise<Object>} User data and token
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getCurrentUserProfile() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile with file upload support
   * @param {string} userId - User ID
   * @param {Object|FormData} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  /**
   * Upload a new profile picture
   * @param {string} userId - User ID
   * @param {FormData} formData - FormData containing the file
   * @returns {Promise<Object>} Response with updated user data
   */
  uploadProfilePicture: async (userId, formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Log FormData contents for debugging
      console.log('=== Uploading Profile Picture ===');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      // Make the request to upload the profile picture
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}/picture`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Let the browser set the Content-Type with boundary for FormData
        },
        body: formData,
        credentials: 'include'
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Error uploading profile picture:', responseData);
        throw new Error(responseData.message || 'Failed to upload profile picture');
      }

      // Update local storage with new user data
      if (responseData.user) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
      }

      return responseData;
    } catch (error) {
      console.error('Error in uploadProfilePicture:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  updateUserProfile: async (userId, userData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Log the request details
      console.log('Sending request to:', `${API_BASE_URL}/api/users/profile/${userId}`);
      console.log('Request method: PUT');
      
      // Handle both FormData and plain objects
      const requestBody = userData instanceof FormData ? userData : new URLSearchParams();
      
      // If it's not FormData, convert the object to URLSearchParams
      if (!(userData instanceof FormData)) {
        Object.entries(userData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            requestBody.append(key, value);
          }
        });
      }
      
      // Log request body for debugging
      console.log('=== Request Body ===');
      if (requestBody instanceof FormData) {
        for (let [key, value] of requestBody.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
          } else {
            console.log(`${key}:`, value);
          }
        }
      } else {
        console.log(requestBody.toString());
      }
      
      // Set appropriate headers based on the request body type
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      // Only set Content-Type for non-FormData requests
      if (!(requestBody instanceof FormData)) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
      
      // Make the fetch request
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`, {
        method: 'PUT',
        headers: headers,
        body: requestBody,
        credentials: 'include'
      });
      
      console.log('Received response status:', response.status);
      
      // Parse response as JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        console.error('Error response from server:', responseData);
        throw new Error(responseData.message || 'Failed to update profile');
      }
      
      console.log('Update profile response:', responseData);
      
      // Update local storage if user data is returned
      if (responseData?.user) {
        console.log('[Profile] Updating local storage with user data');
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...responseData.user };
        
        // Ensure profilePicture is properly set
        if (responseData.user.profilePicture) {
          updatedUser.profilePicture = responseData.user.profilePicture;
        }
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Local storage updated with profile picture:', updatedUser.profilePicture ? 'Yes' : 'No');
      }
      
      return responseData;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      
      // Handle specific error cases
      if (error.response) {
        if (error.response.status === 401) {
          this.logout();
          throw new Error('Your session has expired. Please log in again.');
        }
        
        if (error.response.status === 413) {
          throw new Error('File size is too large. Please upload an image smaller than 5MB.');
        }
        
        if (error.response.status === 415) {
          throw new Error('Unsupported file type. Please upload a valid image (JPEG, PNG, etc.).');
        }
      }
      
      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      
      // Handle timeout
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Request timed out. Please try again.');
      }
      
      throw error;
    }
  }
};

// Export the authService as a named export and the api as the default export
export { authService };
export default api;
