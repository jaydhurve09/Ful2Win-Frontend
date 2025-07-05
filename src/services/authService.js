import api from './api';
import { processProfilePicture } from '../utils/imageUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const authService = {
  async checkUsername(username) {
    try {
      const response = await api.get(`/auth/check-username/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error checking username:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(credentials) {
    try {
      if (!credentials.phoneNumber || !credentials.password) {
        throw new Error('Phone number and password are required');
      }

      // Patch: send only { phone, password } to backend
const loginPayload = credentials.phoneNumber
  ? { phone: Number(credentials.phoneNumber), password: credentials.password }
  : { phone: Number(credentials.phone), password: credentials.password };
const response = await api.post('/login', loginPayload, {
  headers: { 'Content-Type': 'application/json' }
});
      toast.success(response.data.message || 'Login successful');

      if (response.data) {
        let userData = response.data;
        let token = response.data.token;

        if (response.data.data) {
          userData = response.data.data;
          token = response.data.token || response.data.data.token;
        }

        if (token) {
          localStorage.setItem('token', token);

          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            return {
              data: {
                success: true,
                token,
                data: userData
              }
            };
          }
        }
      }

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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getCurrentUserProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get('/me', {
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
      if (error.response && error.response.status === 401) {
        this.clearAuthData();
      }
      throw error;
    }
  },

  getWalletBalance: async () => {
    try {
      const response = await api.get('/me');
      const userData = response.data.data || response.data;
      const balance = userData.balance || 0;
      return { balance, currency: 'INR' };
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return { balance: 0, currency: 'INR' };
    }
  },

  async getUserProfile(userId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get(`/profile/${userId}`, {
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
      if (error.response && error.response.status === 401) {
        this.clearAuthData();
      }
      throw error;
    }
  },

  async spinWheelWin(coins) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await api.post( `${BACKEND_URL}/api/wallet/spin-reward` || 'http://localhost:5000/api/wallet/spin-reward', { amount: coins }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error registering spin wheel win:', error);
      throw error;
    }
  },

  async updateUserProfile(userId, userData, isFormData = false) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const headers = { 'Authorization': `Bearer ${token}` };
      let dataToSend = userData;

      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
        dataToSend = JSON.stringify(userData);
      }

      const response = await api.put(
        `/users/profile/${userId}`,
        dataToSend,
        { headers }
      );

      if (response.data) {
        const updatedUser = response.data.user || response.data.data || response.data;
        if (updatedUser) {
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

      if (error.response) {
        if (error.response.status === 401) {
          this.clearAuthData();
          throw new Error('Your session has expired. Please log in again.');
        }
        if (error.response.status === 400 || error.response.status === 422) {
          throw new Error(error.response.data?.message || 'Validation failed');
        }
        if (error.response.status === 413) {
          throw new Error('File size is too large. Please upload a smaller file.');
        }
        if (error.response.status === 415) {
          throw new Error('Unsupported file type. Please upload a valid image (JPEG, PNG, etc.).');
        }
        if (error.response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }

      throw error.message || 'Failed to update profile. Please try again.';
    }
  },

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
