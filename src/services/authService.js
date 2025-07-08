import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = import.meta.env.VITE_API_BACKEND_URL;

const api = axios.create({
  baseURL: 'http://localhost:5000/api' || `${apiBaseUrl}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

      const loginPayload = {
        phone: Number(credentials.phoneNumber),
        password: credentials.password
      };

      const response = await api.post('/users/login', loginPayload);
      toast.success(response.data.message || 'Login successful');

      const { data } = response;
      if (data && data.token && data.data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));

        return {
          data: {
            success: true,
            token: data.token,
            data: data.data
          }
        };
      }

      console.error('Unexpected login response format:', data);
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
      if (!token) throw new Error('No authentication token found');

      const response = await api.get('/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const userData = response.data.data || response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 401) {
        this.clearAuthData();
      }
      throw error;
    }
  },

  async getWalletBalance() {
    try {
      const response = await api.get('/users/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const userData = response.data.data || response.data;
      return { balance: userData.balance || 0, currency: 'INR' };
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return { balance: 0, currency: 'INR' };
    }
  },

  async getUserProfile(userId) {
    const token = localStorage.getItem('token');
    if (!token) {
      // No token, user is not logged in
      return { error: 'You must be logged in to view this profile.' };
    }
    try {
      const response = await api.get(`/users/profile/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.data || response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Forbidden: user does not have permission
        return { error: 'You do not have permission to view this profile.' };
      }
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 401) {
        this.clearAuthData();
      }
      throw error;
    }
  },

  async spinWheelWin(coins) {
    try {
      const response = await api.post('/wallet/spin-reward', 
        { amount: coins },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error registering spin wheel win:', error);
      throw error;
    }
  },

  async updateUserProfile(userId, userData, isFormData = false) {
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };
      if (!isFormData) headers['Content-Type'] = 'application/json';

      const dataToSend = isFormData ? userData : JSON.stringify(userData);

      const response = await api.put(`/users/profile/${userId}`, dataToSend, { headers });

      if (response.data) {
        const updatedUser = response.data.user || response.data.data || response.data;
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updatedUser }));
        return response.data;
      }

      throw new Error('No data received from server');
    } catch (error) {
      console.error('Error updating user profile:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      if (error.response?.status === 401) {
        this.clearAuthData();
        throw new Error('Session expired. Please log in again.');
      }

      throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
    }
  },

  async updatePost(postId, postData) {
    try {
      const response = await api.put(`/posts/${postId}`, postData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
};

export default authService;
