import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import TrendingGames from '../components/TrendingGames';
import MultiplayerGames from '../components/MultiplayerGames';
import PopularGames from '../components/PopularGames';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import SpinWheelScreen from '../components/SpinWheelScreen';
import BackgroundBubbles from '../components/BackgroundBubbles';
import BackgroundCircles from '../components/BackgroundCircles';
import SpinIcon from '../assets/SpinIcon.png';
import StartScreen from '../components/StartScreen';


const Home = () => {
  const [showMainContent, setShowMainContent] = useState(false);
  const { isAuthenticated } = useAuth();
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  
  useEffect(() => {
    // Show main content after a short delay to allow splash screen to show
    const timer = setTimeout(() => {
      setShowMainContent(true);
    }, 5000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    // Check session storage to show spin only once after login
    const alreadyShown = sessionStorage.getItem('spinShownAfterLogin');

    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setShowSpinWheel(true);
        sessionStorage.setItem('spinShownAfterLogin', 'true'); // Mark as shown for this session
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseSpin = () => {
    setShowSpinWheel(false);
  };
  if (!showMainContent) {
    return <StartScreen />;
  }

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-blueGradient">
      <BackgroundBubbles />
      <BackgroundCircles/>
      <div className="relative z-10">
        <Header />

        {/* Optional: Manual Spin Button */}
        <div className="hidden md:block absolute top-20 right-4 z-10">
          <button
            onClick={() => setShowSpinWheel(true)}
            className="p-2 focus:outline-none"
          >
            <img 
              src={SpinIcon} 
              alt="Spin Wheel" 
              className="w-16 h-16 hover:scale-110 transition-transform duration-200"
            />
          </button>
        </div>

        <div className="pt-16 md:pt-0">
          <Banner />
          <div className="container mx-auto px-4 py-2">
            <TrendingGames />
            <MultiplayerGames />
            <PopularGames />
          </div>
        </div>
      </div>

      <Navbar />

      {/* Spin Wheel Modal */}
      {showSpinWheel && (
        <SpinWheelScreen onClose={handleCloseSpin} isVisible={showSpinWheel} />
      )}
    </div>
  );
};

export default Home;
