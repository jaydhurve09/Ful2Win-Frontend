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
  baseURL: ENV.apiBaseUrl, // Using apiBaseUrl which doesn't include /api/users
  timeout: 30000, // Increased to 30 seconds for production
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Resolve only if status code is less than 500
  }
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

// Register user with retry logic
const register = async (userData, retries = 2) => {
  const makeRequest = async (attempt) => {
    try {
      console.log(`[Auth] Register attempt ${attempt + 1}/${retries + 1}`, {
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        timestamp: new Date().toISOString()
      });
      
      console.log('[Auth] Sending registration request to:', api.defaults.baseURL + '/register');
      console.log('[Auth] Request headers:', {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      });
      
      const startTime = Date.now();
      const response = await api.post('/register', userData, {
        timeout: 15000, // 15 seconds timeout for registration
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const endTime = Date.now();
      console.log(`[Auth] Registration response received in ${endTime - startTime}ms`, {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Registration successful! Please login.',
          user: response.data.user
        };
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('[Auth] Registration error:', {
        name: error.name,
        message: error.message,
        code: error.code,
        isAxiosError: error.isAxiosError,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          timeout: error.config?.timeout,
          withCredentials: error.config?.withCredentials,
          headers: error.config?.headers
        },
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        } : undefined,
        request: error.request ? {
          readyState: error.request.readyState,
          status: error.request.status,
          responseText: error.request.responseText?.substring(0, 500) // Limit response text length
        } : undefined,
        stack: error.stack
      });
      
      // If this was the last attempt, rethrow the error
      if (attempt >= retries) {
        let errorMessage = 'Registration failed. Please try again later.';
        let errorDetails = {};
        
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please check your internet connection and try again.';
          errorDetails = { code: 'timeout', timeout: error.config?.timeout };
        } else if (error.response) {
          // Server responded with an error status
          errorMessage = error.response.data?.message || error.message;
          errorDetails = {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          };
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          errorDetails = { noResponse: true };
        }
        
        console.error('[Auth] Final registration error:', { errorMessage, ...errorDetails });
        
        throw new Error(errorMessage);
      }
      
      // Wait before retrying (exponential backoff)
      const delayMs = 1000 * Math.pow(2, attempt);
      console.log(`Retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      // Recursively retry
      return makeRequest(attempt + 1);
    }
  };
  
  return makeRequest(0);
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
  console.log('[Auth] Login attempt started', {
    timestamp: new Date().toISOString(),
    hasPhoneNumber: !!userData.phoneNumber,
    hasEmail: !!userData.email
  });
  
  try {
    const requestData = {
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      password: userData.password
    };
    
    console.log('[Auth] Sending login request to:', api.defaults.baseURL + '/login');
    console.log('[Auth] Request headers:', {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    const startTime = Date.now();
    const response = await api.post('/login', requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      withCredentials: true
    });
    
    const endTime = Date.now();
    console.log(`[Auth] Login response received in ${endTime - startTime}ms`, {
      status: response.status,
      statusText: response.statusText,
      hasToken: !!response.data?.token,
      hasUser: !!response.data?.user,
      timestamp: new Date().toISOString()
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
    
    // Always use the full path since baseURL doesn't include /api/users
    const endpoint = '/api/users/me';
    console.log('API Base URL:', ENV.apiBaseUrl);
    console.log('Using endpoint:', endpoint);
    
    const response = await api.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    console.log('Current user profile response status:', response.status);
    console.log('Response data:', response.data);
    
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
   * Check if a username is available
   * @param {string} username - Username to check
   * @returns {Promise<{available: boolean}>} Whether the username is available
   */
  async checkUsername(username) {
    try {
      const response = await api.get(`/api/users/check-username?username=${encodeURIComponent(username)}`);
      return response.data;
    } catch (error) {
      console.error('Error checking username availability:', error);
      throw error;
    }
  },

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
    console.log('[Auth] Login attempt started', {
      timestamp: new Date().toISOString(),
      hasPhoneNumber: !!userData.phoneNumber,
      hasEmail: !!userData.email
    });
    
    try {
      const requestData = {
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        password: userData.password
      };
      
      const loginUrl = '/api/users/login';
      console.log('[Auth] Sending login request to:', api.defaults.baseURL + loginUrl);
      console.log('[Auth] Request headers:', {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      });
      
      const startTime = Date.now();
      const response = await api.post(loginUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        withCredentials: true
      });
      
      const endTime = Date.now();
      console.log(`[Auth] Login response received in ${endTime - startTime}ms`, {
        status: response.status,
        statusText: response.statusText,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user,
        timestamp: new Date().toISOString()
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
        const response = await api.post('/logout');
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
  updateUserProfile: async function(userId, userData, isFormData = false) {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Token found' : 'No token found');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const apiUrl = `/api/users/profile/${userId}`;
      
      // Log the FormData contents if it's a FormData object
      if (isFormData && userData instanceof FormData) {
        console.log('FormData contents:');
        for (let pair of userData.entries()) {
          console.log(pair[0] + ': ', pair[1] instanceof File ? 
            `File: ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})` : 
            pair[1]);
        }
      }

      console.log('Sending request with config:', {
        url: apiUrl,
        method: 'PUT',
        hasData: !!userData,
        isFormData: isFormData
      });

      // Make the API request
      const response = await axios.put(
        `${ENV.apiBaseUrl}${apiUrl}`,
        userData,
        {
          headers: {
            'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
          timeout: 60000 // 60 seconds timeout for file uploads
        }
      );
      
      // If the response is successful and contains data
      if (response.data) {
        // Update local storage if this is the current user
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser && currentUser._id === userId) {
          const updatedUser = { ...currentUser, ...response.data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response.data;
      } else if (response.status === 401) {
        // Token expired or invalid - clear auth data and redirect to login
        authService.clearAuthData();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      } else {
        throw new Error(response.data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      
      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      
      // Default error
      throw error.message || 'Failed to update profile. Please try again.';
    }
  },

  /**
   * Request a password reset OTP
   * @param {Object} data - Should contain phoneNumber
   * @returns {Promise<Object>} Response from the server
   */
  forgotPassword: async function(data) {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error.response?.data?.message || 'Failed to send reset OTP';
    }
  },

  /**
   * Reset password with OTP
   * @param {Object} data - Should contain phoneNumber, otp, and newPassword
   * @returns {Promise<Object>} Response from the server
   */
  resetPassword: async function(data) {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error.response?.data?.message || 'Failed to reset password';
    }
  },
  
  /**
   * Get user's wallet balance
   * @returns {Promise<{balance: number}>} User's wallet balance
   */
  getWalletBalance: async function() {
    try {
      // Use the main user profile endpoint which includes the balance
      const response = await api.get('/api/users/me');
      const userData = response.data.data || response.data;
      
      // The balance might be in the root or in a nested property
      const balance = userData.balance || 0;
      console.log('Wallet balance response:', { userData, balance }); // Debug log
      
      return { balance };
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      
      // If we get a 403, try to get the balance from the user data in local storage
      if (error.response?.status === 403) {
        console.log('Falling back to local storage for balance');
        const user = JSON.parse(localStorage.getItem('user'));
        return { 
          balance: user?.balance || 0 
        };
      }
      
      return { balance: 0 };
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
    const response = await api.get(`/api/users/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile for user ${userId}:`, error);
    if (error.response?.status === 404) {
      // If profile not found, try to get the current user's profile instead
      try {
        const currentUser = await authService.getCurrentUserProfile();
        if (currentUser?._id === userId) {
          return currentUser;
        }
      } catch (e) {
        console.error('Error fetching current user profile as fallback:', e);
      }
    }
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
updateUserProfile: async function(userId, userData, isFormData = false) {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Token found' : 'No token found');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const apiUrl = `/api/users/profile/${userId}`;
    
    // Log the FormData contents if it's a FormData object
    if (isFormData && userData instanceof FormData) {
      console.log('FormData contents:');
      for (let pair of userData.entries()) {
        console.log(pair[0] + ': ', pair[1] instanceof File ? 
          `File: ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})` : 
          pair[1]);
      }
    }

    console.log('Sending request with config:', {
      url: apiUrl,
      method: 'PUT',
      hasData: !!userData,
      isFormData: isFormData
    });

    // Make the API request
    const response = await axios.put(
      `${ENV.apiBaseUrl}${apiUrl}`,
      userData,
      {
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
        timeout: 60000 // 60 seconds timeout for file uploads
      }
    );
    
    // If the response is successful and contains data
    if (response.data) {
      // Update local storage if this is the current user
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser && currentUser._id === userId) {
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return response.data;
    } else if (response.status === 401) {
      // Token expired or invalid - clear auth data and redirect to login
      authService.clearAuthData();
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    } else {
      throw new Error(response.data?.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle network errors
    if (error.message === 'Network Error') {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    
    // Default error
    throw error.message || 'Failed to update profile. Please try again.';
  }
},

/**
 * Request a password reset OTP
 * @param {Object} data - Should contain phoneNumber
 * @returns {Promise<Object>} Response from the server
 */
forgotPassword: async function(data) {
  try {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error.response?.data?.message || 'Failed to send reset OTP';
  }
},

/**
 * Reset password with OTP
 * @param {Object} data - Should contain phoneNumber, otp, and newPassword
 * @returns {Promise<Object>} Response from the server
 */
resetPassword: async function(data) {
  try {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error.response?.data?.message || 'Failed to reset password';
  }
},

/**
 * Get user's wallet balance
 * @returns {Promise<{balance: number}>} User's wallet balance
 */
getWalletBalance: async function() {
  try {
    const response = await api.get('/api/users/me');
    const userData = response.data.data || response.data;
    console.log('Wallet balance response:', userData);
    return { balance: userData.balance || 0 };
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    // Fallback to local storage if 403 error
    if (error.response?.status === 403) {
      const user = JSON.parse(localStorage.getItem('user'));
      return { balance: user?.balance || 0 };
    }
    return { balance: 0 };
  }
},

/**
 * Create a new post
 * @param {Object} postData - Post data including content and optional media
 * @returns {Promise<Object>} Created post data
 */
createPost: async function(postData) {
  try {
    const response = await api.post('/api/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error.response?.data?.message || 'Failed to create post';
  }
},

/**
 * Get all posts for the community feed
 * @param {Object} params - Query parameters (page, limit, etc.)
 * @returns {Promise<Array>} Array of posts
 */
getCommunityPosts: async function(params = {}) {
  try {
    const response = await api.get('/api/posts', { params });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching community posts:', error);
    throw error.response?.data?.message || 'Failed to fetch community posts';
  }
}

};

export default authService;
