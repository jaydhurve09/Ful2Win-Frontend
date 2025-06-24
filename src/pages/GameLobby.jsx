// src/pages/HomePage.jsx
import React, { useState } from "react";
import { FaWallet, FaTrophy, FaGamepad, FaUserCircle } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { MdNotifications } from "react-icons/md";
import logo from "../assets/logo.png";
import snakeImg from "../assets/snake-and-ladder.png";
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from "react-icons/ai";

import "./GameLobby.css";

export default function App() {
  const [entry, setEntry] = useState("rupees");
  const [selectedRoomAction, setSelectedRoomAction] = useState("");
  const [selectedPlayWith, setSelectedPlayWith] = useState('friend');
  const [selectedGameMode, setSelectedGameMode] = useState('classic'); 
  const [gameRating, setGameRating] = useState(4.2); // Example value
   const navigate = useNavigate();
  
  return (
    <div className="app">  
    
      <div className="opaque-overlay">
       
 <button 
          className="back-button"
          onClick={() => navigate("/")}  
          style={{
            position: 'absolute',
            top: '20px',
            left: '5px',
            background: 'none',
            border: 'none',
            color: 'black',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            zIndex: 10
          }}
        >
          <AiOutlineArrowLeft style={{ marginRight: "2px" }} />
        </button>

       
        <div className="game-header">
          <img
            src={snakeImg}
            alt="Snake and Ladders"
            className="game-icon"
          />
          <h2 className="game-title">Snake and Ladders</h2>
          {/* Rating section */}
<div className="game-rating">
  <span className="star">⭐</span>
  <span className="rating-value">{gameRating}</span>
</div>
        </div>
       <div className="options-box">
          {/* Game Modes Section */}
          <div className="section">
  <label className="section-label">Game Modes</label>

  <div className="game-modes-container">
    {/* Classic Mode */}
   <div 
        className="game-mode-card"
        onClick={() => navigate('/classicMode')} // Navigate to Classic Mode
        style={{ cursor: 'pointer' }} // Visual feedback
      >
        <div className="mode-content">
          <div className="mode-info">
            <h3>Classic Mode</h3>
            <p>Play with 2-4 players</p>
          </div>
          <div className="entry-buttons">
            <button 
              className="entry-btn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent click
                console.log("Entry fee selected");
              }}
            >
              ₹10-50
            </button>
          </div>
        </div>
      </div>

    {/* Tournament Mode */}
    <div className={`game-mode-card ${selectedGameMode === 'tournament' ? 'selected' : ''}`}>
      <div className="mode-content">
        <div className="mode-info">
          <h3>Tournament Mode </h3>
          <p>Compete for big prizes</p>
        </div>
        <div className="entry-buttons">
          <button className="entry-btn"> ₹20-100 </button>
         
        </div>
      </div>
    </div>

    {/* Private Room */}
    <div className="game-mode-card coming-soon">
      <div className="mode-content">
        <div className="mode-info">
          <h3>Private Room</h3>
          <p>Invite your friends</p>
        </div>
        <div className="coming-soon-tag">Coming Soon</div>
      </div>
    </div>
  </div>
</div>
          {/* Choose Entry */}
          <div className="section">
            <label className="section-label">Choose Entry</label>
            <div className="entry-choice">
              <label>
                <input
                  type="radio"
                  name="entry"
                  checked={entry === "rupees"}
                  onChange={() => setEntry("rupees")}
                />
                ₹ Rupees
              </label>
              <label>
                <input
                  type="radio"
                  name="entry"
                  checked={entry === "coin"}
                  onChange={() => setEntry("coin")}
                />
                Coin
              </label>
            </div>
          </div>

          {/* Room */}
          <div className="section">
            <label className="section-label">Room</label>
            <div className="room-buttons">
              <button
                className={`outline-btn ${selectedRoomAction === "join" ? "selected-btn" : ""}`}
                onClick={() => setSelectedRoomAction("join")}
              >
                Join Room
              </button>
              <button
                className={`outline-btn ${selectedRoomAction === "create" ? "selected-btn" : ""}`}
                onClick={() => setSelectedRoomAction("create")}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}