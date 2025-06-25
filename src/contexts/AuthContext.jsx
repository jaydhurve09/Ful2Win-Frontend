import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/api';

// Helper function to get stored auth data
const getStoredAuthData = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null
    };
  } catch (error) {
    console.error('Error reading auth data from storage:', error);
    return { token: null, user: null };
  }
};

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: () => {},
  updateUser: () => {},
  checkAuthState: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper function to update auth state and storage
  const updateAuthState = useCallback((userData = null, authenticated = false) => {
    setUser(userData);
    setIsAuthenticated(authenticated);
    
    if (authenticated && userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  }, []);

  // Check and validate authentication state
  const checkAuthState = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { token, user: storedUser } = getStoredAuthData();
      
      if (!token) {
        updateAuthState(null, false);
        return false;
      }

      try {
        const userProfile = await authService.getCurrentUserProfile();
        if (userProfile) {
          updateAuthState(userProfile, true);
          return true;
        }
        throw new Error('Failed to fetch user profile');
      } catch (error) {
        console.error('Token validation failed:', error);
        authService.clearAuthData();
        updateAuthState(null, false);
        return false;
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setError(error);
      authService.clearAuthData();
      updateAuthState(null, false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateAuthState]);

  // Handle login
  const login = useCallback(async (userData) => {
    try {
      console.log('AuthContext: Starting login process');
      console.log('AuthContext: Login request data:', {
        phoneNumber: userData.phoneNumber,
        hasPassword: !!userData.password
      });
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await authService.login(userData);
        console.log('AuthContext: Login successful, processing response...');
        
        // The response format should be:
        // { data: { success: true, token: '...', data: { user data } } }
        if (response && response.data && response.data.success) {
          const { token, data: user } = response.data;
          
          if (!token || !user) {
            throw new Error('Missing token or user data in response');
          }
          
          console.log('AuthContext: Login successful for user:', {
            id: user._id,
            phoneNumber: user.phoneNumber
          });
          
          // Update auth state and storage
          updateAuthState(user, true);
          
          // Return success with user data
          return { success: true, user };
        }
        
        throw new Error('Invalid response format from server');
        
      } catch (apiError) {
        console.error('AuthContext: API Error during login:', {
          message: apiError.message,
          status: apiError.response?.status,
          data: apiError.response?.data
        });
        throw apiError; // Re-throw to be caught by the outer catch
      }
      
    } catch (err) {
      // Handle all errors
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Login failed. Please check your credentials and try again.';
      
      console.error('AuthContext: Login failed:', errorMessage);
      
      // Clear any partial auth data
      authService.clearAuthData();
      updateAuthState(null, false);
      
      // Set error for UI
      setError(errorMessage);
      
      // Re-throw with a user-friendly message
      throw new Error(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  }, [updateAuthState]);

  // Handle logout
  const logout = useCallback(async () => {
    try {
      console.log('AuthContext: Starting logout process');
      
      // Clear auth data first
      authService.clearAuthData();
      
      // Update the auth state immediately
      updateAuthState(null, false);
      
      // Make the API call to invalidate the token on the server
      try {
        console.log('AuthContext: Making logout API call');
        await authService.logout();
        console.log('AuthContext: Logout successful');
      } catch (apiError) {
        console.warn('AuthContext: Logout API call failed, but continuing with local cleanup', apiError);
        // Continue with the logout flow even if the API call fails
      }
      
      // Clear any remaining state
      setError(null);
      
      // Return success to indicate logout completed
      return { success: true };
      
    } catch (error) {
      console.error('AuthContext: Error during logout:', error);
      // Ensure we still clear auth data even if something unexpected happens
      authService.clearAuthData();
      updateAuthState(null, false);
      setError(error.message || 'Logout failed');
      throw error;
    } finally {
      setIsLoading(false);
      navigate('/login', { replace: true });
    }
  }, [updateAuthState, navigate]);

  // Update user data
  const updateUser = useCallback(async (userData) => {
    try {
      // If we have a complete user object (from backend), use it directly
      if (userData && userData._id) {
        const updatedUser = { ...userData };
        if (isAuthenticated) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        setUser(updatedUser);
        return updatedUser;
      }
      
      // For partial updates, merge with existing user data
      setUser(prev => {
        const updatedUser = { ...prev, ...userData };
        if (isAuthenticated) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return updatedUser;
      });
      
      return user;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }, [isAuthenticated, user]);

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        updateUser,
        checkAuthState,
      }}
    >
      {!isLoading ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
