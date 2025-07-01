import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuthState } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const isAuthRoute = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  // Check authentication status on mount
  useEffect(() => {
    let isMounted = true;
    
    const verifyAuth = async () => {
      try {
        // Skip verification if it's a public route
        if (isAuthRoute) {
          if (isMounted) setIsVerifying(false);
          return;
        }

        // If we're not authenticated, try to refresh the token
        if (!isAuthenticated) {
          const isStillAuthed = await checkAuthState();
          if (!isStillAuthed && !isAuthRoute) {
            console.log('User not authenticated, redirecting to login');
            return;
          }
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        toast.error('Session expired. Please log in again.');
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    };

    verifyAuth();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isAuthRoute, checkAuthState]);

  // Show loading state while verifying
  if (isVerifying || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated and not on an auth route, redirect to login
  if (!isAuthenticated && !isAuthRoute && !isLoading) {
    console.log('Redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but trying to access auth route, redirect to home
  if (isAuthenticated && isAuthRoute) {
    return <Navigate to="/" replace />;
  }

  // If we have children, render them, otherwise render the outlet
  return children || <Outlet />;
};

export default ProtectedRoute;
