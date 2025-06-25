import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users'; // Update this with your backend URL

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
    console.log('Attempting login with data:', userData);
    const response = await axios.post(`${API_URL}/login`, userData, {
      withCredentials: true
    });
    
    console.log('Login API Response:', response.data);
    
    if (response.data && response.data.success && response.data.data) {
      const { data } = response.data;
      console.log('Login successful, user data:', data);
      
      // Store the token if available (might be in httpOnly cookie)
      const token = response.data.token || response.headers['authorization']?.split(' ')[1];
      
      if (token) {
        localStorage.setItem('token', token);
        
        // Store user data
        const user = {
          _id: data._id,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          balance: data.balance,
          // Add any other fields you need
        };
        
        localStorage.setItem('userId', user._id);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('User data stored in localStorage:', user);
      } else {
        console.warn('No token received in login response');
      }
      
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
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
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      throw new Error('Authentication required');
    }
    
    console.log('Fetching current user profile');
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('Current user profile response:', response.data);
    
    // Handle both response formats: { success, data } and direct user object
    let userData = response.data;
    
    if (userData && typeof userData === 'object') {
      // If response has a data property, use that
      if (userData.data) {
        userData = userData.data;
      }
      
      // Ensure we have required fields
      const userProfile = {
        _id: userData._id || '',
        fullName: userData.fullName || userData.name || '',
        phoneNumber: userData.phoneNumber || userData.phone || '',
        email: userData.email || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || '',
        country: userData.country || '',
        bio: userData.bio || '',
        profilePicture: userData.profilePicture || userData.avatar || '',
        balance: userData.balance || userData.walletBalance || 0
      };
      
      console.log('Processed user profile:', userProfile);
      
      // Update localStorage with the processed data
      localStorage.setItem('user', JSON.stringify(userProfile));
      
      return userProfile;
    }
    
    throw new Error('Invalid user data received from server');
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
    
    // Update local storage with new user data if available
    if (response.data && response.data.user) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...response.data.user
      }));
    }

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

const authService = {
  register,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
};

export default authService;
