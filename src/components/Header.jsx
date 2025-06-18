import React from 'react';
import GameLogo from './GameLogo';
import { IoPerson, IoChevronBack } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { IoMdWallet } from "react-icons/io";
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden mb-4 md:block mx-4 md:mx-20 pt-2">
        <div className="flex justify-between items-center">
          <GameLogo />
          <div className="flex items-center gap-2 p-2">
            <div className="flex items-center justify-center mx-auto py-[2px] px-1 gap-2 rounded-2xl text-black bg-dullBlue">
              <IoMdWallet className="text-3xl bg-active rounded-full p-1"/>
              <span className="mr-4 text-lg">₹28.71</span>
            </div>
            <button className="text-xl"><FaBell /></button>
            <button className="bg-yellow-500 p-2 rounded-full ml-2 text-black"><IoPerson /></button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-darkBlueGradient z-40 rounded-b-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={logo}
              alt="Ludo Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-[#1e2e5c] px-3 py-1.5 rounded-full">
              <IoMdWallet className="text-yellow-400 text-lg mr-1.5" />
              <span className="text-white font-medium text-sm">₹28.71</span>
            </div>
            <button className="text-white text-xl hover:opacity-80 transition-opacity">
              <FaBell />
            </button>
            <button className="bg-yellow-500 p-1.5 rounded-full text-black hover:opacity-90 transition-opacity">
              <IoPerson className="text-lg" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
