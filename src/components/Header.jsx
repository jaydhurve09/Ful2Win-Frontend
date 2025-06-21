import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameLogo from './GameLogo';
import { IoPerson } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { IoMdWallet } from "react-icons/io";
import logo from '../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden mb-4 md:block mx-4 md:mx-20 pt-2">
        <div className="flex justify-between items-center">
          <GameLogo />
          <div className="flex items-center gap-2 p-2">
            {/* Wallet (clickable) */}
            <div
              onClick={() => navigate('/wallet')}
              className="flex items-center justify-center mx-auto py-[2px] px-1 gap-2 rounded-2xl text-black bg-dullBlue cursor-pointer hover:opacity-90 transition"
            >
              <IoMdWallet className="text-3xl bg-active rounded-full p-1" />
              <span className="mr-4 text-lg">₹28.71</span>
            </div>

            <button className="text-xl"><FaBell /></button>
            <button className="bg-yellow-500 p-2 rounded-full ml-2 text-black"><IoPerson /></button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-blueGradient z-40 rounded-b-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logo} alt="Ludo Logo" className="h-10 w-auto object-contain" />

          <div className="flex items-center space-x-3">
            {/* Wallet (clickable) */}
            <div
              onClick={() => navigate('/wallet')}
              className="flex items-center bg-dullBlue px-3 py-1.5 rounded-full cursor-pointer hover:opacity-90 transition"
            >
              <IoMdWallet className="bg-active rounded-full p-1 text-lg mr-1.5" />
              <span className="text-black font-medium text-sm">₹28.71</span>
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
