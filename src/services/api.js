import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.log('Unauthorized access - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  try {
    console.log('Attempting login with data:', {
      phoneNumber: userData.phoneNumber,
      hasPassword: !!userData.password
    });
    
    const response = await api.post('/users/login', userData);
    console.log('Login API Response:', response.data);
    
    const responseData = response.data;
    
    if (responseData.success && responseData.token) {
      console.log('Login successful');
      
      // Store the token
      localStorage.setItem('token', responseData.token);
      
      // Fetch complete user profile
      const userProfile = await getCurrentUserProfile();
      
      if (userProfile) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userProfile));
        console.log('User data stored in localStorage:', userProfile);
        return userProfile;
      }
      
      throw new Error('Failed to fetch user profile after login');
    } else {
      throw new Error(responseData.message || 'Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Provide more specific error messages
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.response) {
      // Server responded with a status code outside 2xx
      if (error.response.status === 401) {
        errorMessage = 'Invalid phone number or password. Please try again.';
      } else if (error.response.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid request. Please check your input.';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'No response from server. Please check your connection.';
    }
    
    const loginError = new Error(errorMessage);
    loginError.response = error.response;
    throw loginError;
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
    const response = await api.get('/users/me');
    
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
  register: (userData) => api.post('/users/register', userData).then(res => res.data),
  login: (userData) => api.post('/users/login', userData).then(res => res.data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post('/users/logout');
  },
  getCurrentUserProfile,
  getUserProfile: (userId) => api.get(`/users/profile/${userId}`).then(res => res.data),
  updateUserProfile: (userId, userData) => api.put(`/users/profile/${userId}`, userData).then(res => res.data),
  testToken: () => api.get('/users/test-token').then(res => res.data),
  getAuthHeader
};

export default authService;
