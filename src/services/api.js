import axios from 'axios';

// Helper function to normalize URL (remove trailing slashes)
const normalizeUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

// Environment configuration
const ENV = {
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  apiBaseUrl: normalizeUrl(import.meta.env.VITE_API_BASE_URL || ''),
  apiUrl: normalizeUrl(import.meta.env.VITE_API_URL || '')
};

// Log environment for debugging
console.log('Environment Configuration:', {
  ...ENV,
  env: process.env.NODE_ENV,
  mode: import.meta.env.MODE,
  baseUrl: ENV.apiBaseUrl,
  apiUrl: ENV.apiUrl
});

// Create axios instance with base URL
const api = axios.create({
  baseURL: ENV.apiBaseUrl,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true, // Important for cookies if using them
});

// Request interceptor to add auth token to requests
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

// Response interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error handling 401:', error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Register user
const register = async (userData) => {
  try {
    console.log('Registering user with data:', userData);
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('Registration response:', response.data);
    
    if (response.data && response.data.success) {
      // Don't log in the user automatically, just return success
      return {
        success: true,
        message: 'Registration successful! Please login.',
        user: response.data
      };
    } else {
      throw new Error(response.data?.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    throw new Error(errorMessage);
  }
};

// Test backend connection
const testBackendConnection = async () => {
  const testUrl = `${import.meta.env.VITE_API_BASE_URL}/api/users/test-body`;
  console.log('Testing backend connection at:', testUrl);
  
  try {
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ test: 'connection' }),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log('Test response status:', response.status);
    const data = await response.json().catch(() => ({}));
    console.log('Test response data:', data);
    
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    console.error('Test connection error:', error);
    throw error;
  }
};

// Login user
const login = async (userData) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const loginUrl = `${baseUrl}/api/users/login`;
  
  console.log('=== Login Debug ===');
  console.log('Using base URL:', baseUrl);
  console.log('Full login URL:', loginUrl);
  console.log('Request method: POST');
  console.log('Request payload:', { 
    phoneNumber: userData.phoneNumber,
    password: userData.password ? '[HIDDEN]' : 'undefined' 
  });
  
  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        phoneNumber: userData.phoneNumber,
        password: userData.password
      }),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
    
    let responseData;
    try {
      responseData = await response.json();
      console.log('Response data:', responseData);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const textResponse = await response.text();
      console.error('Raw response:', textResponse);
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      const errorMessage = responseData.message || 
                         responseData.error || 
                         `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }
    
    if (!responseData.token) {
      throw new Error('No token received in response');
    }
    
    // Store the token and user data
    const { token, user } = responseData;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set default auth header for subsequent requests
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('Login successful for user:', user.phoneNumber);
    return { user, token };
    
  } catch (error) {
    console.error('=== Login Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    
    // More specific error handling
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    
    // Re-throw with a more user-friendly message if needed
    if (error.message.includes('401')) {
      throw new Error('Invalid phone number or password');
    }
    
    throw error;
  }
};

// Logout user
const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('user');
  }
};

// Get current user profile
const getCurrentUserProfile = async () => {
  try {
    console.log('Fetching current user profile');
    const response = await api.get('/me');
    
    console.log('Current user profile response:', response.data);
    
    // Extract user data from response
    const userData = response.data.data || response.data;
    
    if (!userData) {
      throw new Error('No user data received');
    }
    
    // Format user profile data
    const userProfile = {
      _id: userData._id,
      fullName: userData.fullName || '',
      phoneNumber: userData.phoneNumber || '',
      email: userData.email || '',
      dateOfBirth: userData.dateOfBirth || '',
      gender: userData.gender || '',
      country: userData.country || '',
      bio: userData.bio || '',
      profilePicture: userData.profilePicture || '',
      balance: userData.balance || 0,
      isVerified: userData.isVerified || false,
      isActive: userData.isActive !== false // Default to true if not specified
    };
    
    console.log('Processed user profile:', userProfile);
    return userProfile;
    
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // If there's an error but we have user data in localStorage, return that
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser && storedUser._id) {
      console.log('Using stored user data due to API error');
      return storedUser;
    }
    
    throw error;
  }
};

// Get user profile by ID (for viewing other users' profiles)
const getUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      throw new Error('Authentication required');
    }
    
    console.log('Fetching profile for user ID:', userId);
    const response = await axios.get(`${API_URL}/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('User profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getUserProfile:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Update user profile
const updateUserProfile = async (userId, userData, isFormData = false) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    console.log('Sending profile update request:', {
      userId,
      userData: isFormData ? '[FormData]' : userData,
      isFormData
    });

    // Set up default headers
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      withCredentials: true,
      timeout: 30000, // 30 seconds timeout
    };

    // Only set Content-Type for non-FormData requests
    if (!isFormData) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      // For FormData, let the browser set the Content-Type with boundary
      delete config.headers['Content-Type'];
    }

    // Log FormData content for debugging
    if (isFormData && userData instanceof FormData) {
      console.log('FormData entries:');
      for (let [key, value] of userData.entries()) {
        console.log(key, value);
      }
    }

    const response = await axios.put(
      `${API_URL}/profile/${userId}`,
      userData,
      config
    );

    console.log('Profile update response:', response.data);
    
    // Check if the response has the expected structure
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    // Return the entire response data
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    
    // Handle specific error cases
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Your session has expired. Please log in again.');
      }
      
      // Handle 413 Payload Too Large
      if (error.response.status === 413) {
        throw new Error('File size is too large. Please upload an image smaller than 2MB.');
      }
      
      // Handle validation errors
      if (error.response.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .map(err => typeof err === 'string' ? err : err.message)
          .filter(Boolean)
          .join('\n');
        throw new Error(errorMessages || 'Validation error occurred');
      }
      
      // Handle other API errors
      if (error.response.data?.message) {
        throw new Error(error.response.data.message);
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
    
    // Default error
    throw error.message || 'Failed to update profile. Please try again.';
  }
};

// Helper function to get authentication headers
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  register: async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await api.post('/api/users/register', userData);
      
      console.log('Registration response:', response.data);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          message: 'Registration successful! Please login.',
          user: response.data.data
        };
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to register. Please try again.'
      );
    }
  },
  
  // Existing authService methods...
  /**
   * Login user with phone number and password
   * @param {Object} userData - User credentials
   * @returns {Promise<{user: Object, token: string}>} User data and JWT token
   */
  login: async (userData) => {
    try {
      const requestData = {
        phoneNumber: userData.phoneNumber,
        password: userData.password
      };

      console.log('API: Sending login request with:', { 
        ...requestData,
        password: '[HIDDEN]' // Never log actual password
      });
      
      console.log('Sending to URL:', '/api/users/login');
      const response = await api.post('/api/users/login', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true // Important for cookies
      });
      
      console.log('API: Login response status:', response.status);
      console.log('API: Login response headers:', response.headers);
      console.log('API: Login response data:', response.data);
      
      if (response.data && response.data.success) {
        // Ensure we have both token and user data
        if (!response.data.token || !response.data.data) {
          console.error('API: Missing token or user data in response');
          throw new Error('Incomplete authentication data received');
        }
        
        const { token, data: user } = response.data;
        
        // Store token and user data in localStorage
        localStorage.setItem('token', token);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Set the auth token for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log('Login successful, token stored:', { 
          hasToken: !!token,
          hasUser: !!user,
          tokenLength: token ? token.length : 0 
        });
        
        return {
          ...response,
          data: {
            ...response.data,
            success: true
          }
        };
      }
      
      throw new Error(response.data?.message || 'Authentication failed');
      
    } catch (error) {
      console.error('API: Login error details:', {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      // Format the error to include the server's error message if available
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      const formattedError = new Error(errorMessage);
      formattedError.response = error.response;
      throw formattedError;
    }
  },

  /**
   * Logout user and clear all auth data
   * @returns {Promise<Object>} Logout response
   */
  logout: async function() {
    try {
      console.log('AuthService: Starting logout process');
      
      // Clear auth data first to ensure it happens even if the API call fails
      this.clearAuthData();
      
      // Make the API call to invalidate the token on the server
      try {
        console.log('AuthService: Making logout API call');
        const response = await api.post('/api/users/logout');
        console.log('AuthService: Logout successful');
        return response.data;
      } catch (apiError) {
        console.warn('AuthService: Logout API call failed, but continuing with local cleanup', {
          error: apiError.message,
          status: apiError.response?.status
        });
        // We still want to resolve the promise since we've cleared local data
        return { success: true, message: 'Logged out locally (server logout failed)' };
      }
    } catch (error) {
      console.error('AuthService: Unexpected error during logout:', error);
      // Ensure we still clear auth data even if something unexpected happens
      this.clearAuthData();
      // Re-throw the error to be handled by the caller
      throw error;
    }
  },
  
  /**
   * Clear all authentication data from storage and memory
   */
  clearAuthData: function() {
    console.log('AuthService: Clearing authentication data');
    
    // Remove token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear sessionStorage as well if used
    sessionStorage.clear();
    
    // Remove token from axios default headers
    delete api.defaults.headers.common['Authorization'];
    
    // Clear any cookies that might be set
    document.cookie.split(';').forEach(c => {
      document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    });
    
    console.log('AuthService: Authentication data cleared');
  },
  
  /**
   * Get current user's profile data
   * @returns {Promise<Object>} User profile data
   */
  getCurrentUserProfile: async () => {
    try {
      const response = await api.get('/api/users/me');
      return response.data;
    } catch (error) {
      // If unauthorized, clear auth data
      if (error.response?.status === 401) {
        this.clearAuthData();
      }
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile data
   */
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object|FormData} userData - Updated user data (can be FormData for file uploads)
   * @param {boolean} [isFormData=false] - Whether the data is FormData (for file uploads)
   * @returns {Promise<Object>} Updated user data
   */
  updateUserProfile: async (userId, userData, isFormData = false) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Token found' : 'No token found');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Set up request config
      const config = {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      };

      // For FormData, let the browser set the Content-Type with boundary
      if (!isFormData) {
        config.headers['Content-Type'] = 'application/json';
      } else {
        // Remove Content-Type header to let the browser set it with the correct boundary
        delete config.headers['Content-Type'];
      }

      const apiUrl = `/api/users/profile/${userId}`;
      
      // Log the FormData contents if it's a FormData object
      if (isFormData && userData instanceof FormData) {
        console.log('FormData contents:');
        for (let pair of userData.entries()) {
          console.log(pair[0] + ': ', pair[1]);
        }
      }

      console.log('Sending request with config:', {
        url: apiUrl,
        method: 'PUT',
        headers: config.headers,
        hasData: !!userData,
        isFormData: isFormData
      });

      // Make the API request with the correct content type
      const response = await axios({
        method: 'put',
        url: `${ENV.apiBaseUrl}${apiUrl}`,
        data: userData,
        headers: {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      
      // If the response is successful and contains data
      if (response.data) {
        // Update local storage if this is the current user
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser?._id === userId) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        
        return response.data;
      }
      
      throw new Error('Invalid response from server');
      
    } catch (error) {
      console.error('Error updating user profile:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Your session has expired. Please log in again.');
      }
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .map(err => typeof err === 'string' ? err : err.message)
          .filter(Boolean)
          .join('\n');
        throw new Error(errorMessages || 'Validation error occurred');
      }
      
      // Handle other API errors
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      
      // Default error
      throw error.message || 'Failed to update profile. Please try again.';
    }
  }
};

export default authService;
