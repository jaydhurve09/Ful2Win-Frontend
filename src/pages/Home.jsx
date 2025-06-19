import React from 'react';
import Header from '../components/Header';
import TrendingGames from '../components/TrendingGames';
import MultiplayerGames from '../components/MultiplayerGames';
import PopularGames from '../components/PopularGames';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
// import BackgroundCircles from '../components/BackgroundCircles';
import BackgroundBubbles from '../components/BackgroundBubbles';

const Home = () => {
  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-blueGradient">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />
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
    </div>
  );
};

export default Home;
