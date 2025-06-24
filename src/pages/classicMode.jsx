import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaUserFriends, FaTrophy, FaClock } from "react-icons/fa";
import snakeLogo from "../assets/snake-and-ladder.png";
import "./ClassicMode.css";

const games = [
  {
    id: 1,
    players: 2,
    prize: 8,
    entry: 5, 
    playing: 34,
    time: "00m 30s",
  },
  {
    id: 2,
    players: 2,
    prize: 15,
    entry: 10,
    playing: 18,
    time: "01m 30s",
  },
  {
    id: 3,
    players: 2,
    prize: 23,
    entry: 15,
    playing: 11,
    time: "02m 00s",
  },
];

const   ClassicMode = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/game-lobby'); 
  };

  return (
    <div className="classic-mode-container" >
      <div className="classic-mode-overlay">
        <div className="classic-mode-content">
          {/* Header with back button */}
          <div className="classic-mode-header">
            <button className="back-button" onClick={handleBackClick}>
              <IoArrowBack className="back-icon" />
            </button>
            <h1 className="game-title">Snake & Ladder</h1>
            <div className="header-spacer"></div>
          </div>

          {/* Rest of your component remains the same */}
          <div className="logo-title-container">
            <div className="logo-wrapper">
              <div className="logo-background">
                <img src={snakeLogo} alt="Snake and Ladder" className="game-logo" />
              </div>
            </div>
            <h2 className="game-name">Snake & Ladder</h2>
            <p className="game-mode">Classic Mode</p>
          </div>

          <div className="balance-container">
            <span className="balance-label">Your Balance:</span>
            <span className="balance-amount">₹1246.00</span>
          </div>

          <div className="games-list">
            {games.map((game) => (
              <div key={game.id} className="game-card">
                <div className="game-card-header">
                  <div className="players-count">
                    <FaUserFriends className="icon" />
                    <span>{game.players} Players</span>
                  </div>
                  <div className="winner-info">
                    <FaTrophy className="icon" />
                    <span>1 Winner</span>
                  </div>
                </div>
                
                <div className="game-card-main">
                  <p className="prize-amount">Win ₹{game.prize}</p>
                  <button className="play-button">
                    Play ₹{game.entry}
                  </button>
                </div>

                <div className="game-card-footer">
                  <div className="playing-count">
                    <FaUserFriends className="icon small" />
                    <span>{game.playing} playing</span>
                  </div>
                  <div className="time-left">
                    <FaClock className="icon small" />
                    <span>{game.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicMode;