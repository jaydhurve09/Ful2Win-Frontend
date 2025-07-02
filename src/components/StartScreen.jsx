import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackgroundBubbles from './BackgroundBubbles';
import { useAuth } from '../contexts/AuthContext';

const StartScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the splash screen immediately
    setIsVisible(true);
    
    // Auto-navigate after 2 seconds
    const timer = setTimeout(() => {
      // Fade out
      setIsVisible(false);
      
      // After fade out completes, navigate to the appropriate route
      setTimeout(() => {
        // If coming from login/signup, go to home
        if (location.state?.from === 'auth') {
          navigate('/');
        } 
        // If not authenticated, go to login
        else if (!isAuthenticated) {
          navigate('/login');
        }
        // Otherwise, stay on current route
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, location.state]);

  return (
    <div className={`min-h-screen w-full bg-blueGradient flex flex-col items-center justify-center relative overflow-hidden transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <BackgroundBubbles />
      <img 
        src="/logo.png" 
        alt="Ful2Win Logo" 
        className='w-64 md:w-80 h-auto animate-pulse'
      />
    </div>
  );
};

export default StartScreen;