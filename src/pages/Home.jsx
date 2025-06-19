import React from 'react';
import Header from '../MyComponents/Header';
import TrendingGames from '../MyComponents/TrendingGames';
import MultiplayerGames from '../MyComponents/MultiplayerGames';
import PopularGames from '../MyComponents/PopularGames';
import Navbar from '../MyComponents/Navbar';
import Banner from '../MyComponents/Banner';

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
