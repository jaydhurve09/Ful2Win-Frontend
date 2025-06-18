import React from 'react';
import Header from '../components/Header';
import TrendingGames from '../components/TrendingGames';
import MultiplayerGames from '../components/MultiplayerGames';
import PopularGames from '../components/PopularGames';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';

const Home = () => {
  return (
    <div className="bg-bgColor text-white min-h-screen pb-24">
      <div className="bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent">
        <Header />
        <div className="pt-16 md:pt-0">
          <Banner />
          <div className="container mx-auto px-4 py-8">
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
