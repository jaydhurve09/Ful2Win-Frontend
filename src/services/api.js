import axios from 'axios';

// Get the base URL from environment variables or use the production URL as fallback
const API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL 
  ? `${import.meta.env.VITE_API_BACKEND_URL}/api`
  : (import.meta.env.MODE === 'development' 
      ? 'http://localhost:5000/api' 
      : 'https://api.fulboost.fun/api');

console.log('API Base URL:', API_BASE_URL); // Debug log

// Environment configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  // Prevent axios from adding cache-control headers
  transformRequest: [(data, headers) => {
    if (headers && headers.common) {
      delete headers.common['Cache-Control'];
      delete headers.common['Pragma'];
    }
    return data;
  }],
  validateStatus: function (status) {
    return status < 500; // Resolve all status codes less than 500
  }
});

// Request interceptor to add auth token and headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (!config.headers) {
      config.headers = {};
    }
    
    // Remove any cache-control headers that might have been added
    if (config.headers) {
      delete config.headers['Cache-Control'];
      delete config.headers['cache-control'];
      delete config.headers['Pragma'];
      delete config.headers['pragma'];
    }
    
    // Always set the Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For FormData uploads, let the browser set the Content-Type with boundary
    if (config.data instanceof FormData) {
      // Don't set Content-Type header, let the browser set it with the correct boundary
      if (config.headers && config.headers['Content-Type'] === undefined) {
        // If Content-Type is explicitly set to undefined, remove it
        delete config.headers['Content-Type'];
      } else if (config.headers) {
        // Otherwise, let the browser set it
        delete config.headers['Content-Type'];
      }
      
      // Also clear any axios default Content-Type headers
      if (config.headers && config.headers.common) {
        delete config.headers.common['Content-Type'];
      }
      if (config.headers && config.headers.post) {
        delete config.headers.post['Content-Type'];
      }
      if (config.headers && config.headers.put) {
        delete config.headers.put['Content-Type'];
      }
      if (config.headers && config.headers.patch) {
        delete config.headers.patch['Content-Type'];
      }
    } else if (config.headers && !config.headers['Content-Type']) {
      // Only set Content-Type for non-FormData requests if not already set
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
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
      const response = await api.get('/me');
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

      // Make the request to upload the profile picture
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}/picture`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
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

      // Initialize request options
      let requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      };
      
      // Handle FormData (for file uploads)
      if (userData instanceof FormData) {
        // Don't set Content-Type header - let the browser set it with the correct boundary
        // Removing Content-Type header to let the browser set it with the correct boundary
        const { 'Content-Type': _, ...headersWithoutContentType } = requestOptions.headers;
        requestOptions.headers = headersWithoutContentType;
        
        requestOptions.body = userData;
      }
      // Handle plain objects (for regular form data)
      else if (typeof userData === 'object') {
        // Filter out empty strings and undefined values
        const cleanData = Object.fromEntries(
          Object.entries(userData).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
        );
        
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.body = JSON.stringify(cleanData);
      }
      
      // Make the API request
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`, requestOptions);
      
      // Parse the response data
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error response from server:', data);
        
        // If we have a 400 error but the picture was actually updated
        if (response.status === 400 && data.code === 'UPLOAD_ERROR' && data.user) {
          return {
            success: true,
            message: 'Profile updated successfully',
            user: data.user
          };
        }
        
        // Handle Cloudinary API key error specifically
        if (data.error && data.error.includes('Cloudinary') && data.error.includes('api_key')) {
          // Return a success response with the original data to continue the profile update
          return { 
            success: true, 
            message: 'Profile updated, but there was an issue with the profile picture service',
            user: data.user || null
          };
        }
        
        // For other errors, check if we still have user data
        if (data.user) {
          return {
            success: true,
            message: data.message || 'Profile updated with warnings',
            user: data.user
          };
        }
        
        throw new Error(data.message || 'Failed to update profile');
      }
      
      // If we're updating the profile with a picture, make sure to update the user data
      if (userData instanceof FormData) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Get the updated user data from the response
        const updatedUser = data.user || user;
        
        // Update local storage
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return data;
    } catch (error) {
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
