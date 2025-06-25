import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuthState } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status
  const verifyAuth = useCallback(async () => {
    try {
      // If we're still loading, wait for auth state to be determined
      if (isLoading) return;

      const isAuthRoute = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
      
      // If user is not authenticated and trying to access protected route
      if (!isAuthenticated && !isAuthRoute) {
        navigate('/login', { 
          replace: true, 
          state: { 
            from: location,
            message: 'Please log in to access this page'
          } 
        });
      }
      // If user is authenticated but trying to access auth route
      else if (isAuthenticated && isAuthRoute) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      navigate('/login', { 
        replace: true,
        state: { 
          from: location,
          error: 'Session expired. Please log in again.'
        } 
      });
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  // Verify auth on mount and when dependencies change
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated and not on auth route, render nothing (will redirect in useEffect)
  if (!isAuthenticated && !['/login', '/signup', '/forgot-password'].includes(location.pathname)) {
    return null;
  }

  // If authenticated but on auth route, redirect to home
  if (isAuthenticated && ['/login', '/signup', '/forgot-password'].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  // Render the protected content
  return children || <Outlet />;
};

export default ProtectedRoute;
