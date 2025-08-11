import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { Ful2WinContext } from "../context/ful2winContext";
import { RxCrossCircled } from "react-icons/rx";
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.MODE === 'development' 
? 'http://localhost:5000' 
:  `${import.meta.env.VITE_API_BACKEND_URL}/api`

console.log('API Base URL:', API_BASE_URL); // Debug log
const FindMatch = ({ tournament, onClose }) => {
  const { allUsers } = useContext(Ful2WinContext);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(1); // 1 = full progress
  const [opponent, setOpponent] = useState(null);
  const [opponentUsername, setOpponentUsername] = useState('User');
  const [timeUp, setTimeUp] = useState(false);
  const [found, setFound] = useState(false);
  const [autoPlayCountdown, setAutoPlayCountdown] = useState(0);
  const [roomId, setRoomId] = useState(null);
  const roomIdRef = useRef(null);
  const timerRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const socketRef = useRef(null);

 const joinMatch = () => {
  socketRef.current.emit('join_match', {
    userId: JSON.parse(localStorage.getItem('user')).id,
    gameId: tournament.gameId,
    entryFee: tournament.entryFee
  });
};

  const handleStart = () => {
    setProgress(1); // Reset to full
    setTimeUp(false);
    let start = Date.now();
    const duration = 20; // 20 seconds

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const newProgress = Math.max(0, 1 - elapsed / duration);
      setProgress(newProgress);

      if (elapsed >= duration) {
        clearInterval(timerRef.current);
        setProgress(0);
        setTimeUp(true);
        socketRef.current.emit('not_found', {
          userId: JSON.parse(localStorage.getItem('user')).id,
          gameId: tournament.gameId,
          entryFee: tournament.entryFee
        });
        toast.error("⏰ Time's up! Opponent not found.");
      }
    }, 50); // update every 50ms for smoothness
  };
const playHandler = () => {
  // Clear auto-play timer if user clicks manually
  if (autoPlayTimerRef.current) {
    clearTimeout(autoPlayTimerRef.current);
    clearInterval(autoPlayTimerRef.current);
    console.log('Auto-play timer cancelled - user clicked manually');
  }
  setAutoPlayCountdown(0);
  
  socketRef.current.emit('register', {
    userId: JSON.parse(localStorage.getItem('user')).id,
    gameId: tournament.gameId,
    roomId: roomIdRef.current,
    entryFee: tournament.entryFee
  });

//  navigate(`/gameOn2/${tournament.gameId}/${tournament.roomId}`);
};

 const opponentData = (opponentId) => {
    console.log('Opponent Data called with ID:', opponentId);
    console.log('All Users:', allUsers);
    console.log('All Users length:', allUsers?.length);
    
    if (!allUsers || allUsers.length === 0) {
      console.log('allUsers is empty or not loaded');
      setOpponentUsername('Opponent');
      return;
    }
    
    // Try to find by both id and _id
    const opponentUser = allUsers.find(user => 
      user.id === opponentId || 
      user._id === opponentId || 
      user.id === String(opponentId) || 
      user._id === String(opponentId)
    );
    
    console.log('Found opponent user:', roomId);
    
    if (opponentUser) {
      const opponentProfile = opponentUser.profilePicture || null;
      const opponentUsername = opponentUser.username || 'Opponent';
      
      setOpponent(opponentProfile);
      setOpponentUsername(opponentUsername);
      console.log('Set opponent profile:', opponentProfile, 'username:', opponentUsername);
      
      // Stop timer when user profile is successfully loaded
      if (timerRef.current) {
        clearInterval(timerRef.current);
        console.log('Timer stopped - user profile loaded');
        setFound(true);
      }
      setProgress(0);
      setTimeUp(false); 
      
      // Start 5-second auto-play countdown
      setAutoPlayCountdown(5);
      let countdown = 5;
      
      // Update countdown every second
      const countdownInterval = setInterval(() => {
        countdown -= 1;
        setAutoPlayCountdown(countdown);
        console.log(`Auto-play in ${countdown} seconds...`);
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          console.log('Auto-play triggered');
          playHandler();
        }
      }, 1000);
      
      // Store the interval reference so it can be cancelled
      autoPlayTimerRef.current = countdownInterval;

    } else {
      console.log('No opponent found with ID:', opponentId);
      setOpponentUsername('Opponent');
    }
 };

  useEffect(() => {
    socketRef.current = io(API_BASE_URL);
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });
    socketRef.current.on('match_found', (match) => {
      console.log('Match found:', match);
      console.log('Calling opponentData with:', match.opponent);
      console.log('Room ID from match:', match.roomId);
      
      if (match.roomId) {
        setRoomId(match.roomId);
        roomIdRef.current = match.roomId;
        console.log('Room ID set to:', match.roomId);
      } else {
        console.error('No roomId in match data!');
      }
      
      opponentData(match.opponent);
      
      // Timer will be stopped in opponentData function when user profile is loaded
    });
    socketRef.current.on('register_success', (data) => {
      console.log('Registration successful', data);
      const gameRoomId = data?.roomId || roomIdRef.current;
      console.log('Using roomId for navigation:', gameRoomId);
      navigate(`/gameOn2/${tournament.gameId}/${gameRoomId}`);
    });

    return () => {
      clearInterval(timerRef.current);
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [allUsers]);
const userProfile = JSON.parse(localStorage.getItem('user')).profilePicture;
const username = JSON.parse(localStorage.getItem('user')).username;

const profilePicture = userProfile==""? <span className="first">{username.charAt(0).toUpperCase()}</span> : userProfile; // Fallback if no profile picture
  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center mt-10 p-6 bg-transparent backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full h-[96%] max-w-md rounded-2xl border p-2 border-white/10 shadow-2xl mt-16 mb-8 bg-white/10 backdrop-blur-md">
        {/* Header with close button */}
        <div className="relative">
          <button
            className="absolute top-4 right-4 bg-black/50 rounded-full p-1.5 text-white/80 hover:text-white transition-colors"
            onClick={() => onClose(false)}
          >
            <RxCrossCircled size={24} />
          </button>

          <div className="flex items-center justify-start p-4">
            <p className="text-lg font-semibold text-white">Classic-Mode</p>
          </div>

          <div className="p-4 flex flex-col items-center mt-10">
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Circular Progress Bar around the image */}

              <img
                src={tournament?.imageUrl || "/placeholder.jpg"}
                alt={tournament?.name}
                className="w-16 h-16 rounded-xl bg-white/10 border-2 border-white/20 object-cover relative z-10"
              />
            </div>

            <h1 className="text-4xl mb-2 text-white text-center capitalize mt-4">
              {tournament.name}-Match
            </h1>
            <p className="text-gray-200 ml-5 mt-1 mb-1">
              Play And Win Real Cash
            </p>
          </div>

          {/* Player Images */}
          <div className="flex flex-col items-center mt-4">
            <div className="p-4 flex flex-row rounded-full items-center gap-16 justify-between mt-6 mb-6">
              <div className="relative rounded-full overflow-hidden h-32 w-32 flex items-center justify-center">
                {/* Circular Progress Bar */}
                <svg
                  className="absolute top-0 left-0 z-20 pointer-events-none"
                  width="128"
                  height="128"
                >
                  <circle
                    cx="64"
                    cy="64"
                    r="60" // Adjusted radius
                    stroke="#ffffff"
                    strokeWidth="6"
                    fill="none"
                    opacity="0.2"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="red"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={(1 - progress) * 2 * Math.PI * 60}
                    style={{ transition: "stroke-dashoffset 0.05s linear" }}
                  />
                </svg>

                {/* Player Image */}
                {(!userProfile || userProfile === "") ? (
                  <span className="w-28 h-28 flex items-center justify-center rounded-full bg-green-600 text-white text-5xl font-bold relative z-30 select-none">
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </span>
                ) : (
                  <img
                    src={userProfile}
                    alt={tournament?.name}
                    className="w-28 h-28 object-cover rounded-full relative z-30"
                  />
                )}
              </div>

              <div className="rounded-full overflow-hidden h-30 w-30">
              
                {(!opponent || opponent === "") ? (
                   <span className="w-28 h-28 flex items-center justify-center rounded-full bg-green-600 text-white text-5xl font-bold relative z-30 select-none">
                    {opponentUsername ? opponentUsername.charAt(0).toUpperCase() : "U"}
                  </span>
               
                ) : (
                  <img
                    src={opponent || "/placeholder.jpg"}
                    alt={opponentUsername}
                    className="w-28 h-28 object-cover rounded-md"
                  />
                )}
              </div>
            </div>

            {/* Start Match Button */}
            <div className="p-4 flex flex-col items-center">
              {found ? (
                <button
                  onClick={() => {
                    playHandler();
                  }}
                  className="w-auto bg-gradient-to-r from-green-600 to-green-700 hover:bg-green-500 text-white text-xl p-4 pl-9 pr-9 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {autoPlayCountdown > 0 ? `Play (Auto in ${autoPlayCountdown}s)` : 'Play'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleStart();
                    joinMatch();
                  }}
                  className="w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-yellow-500 text-white text-xl p-4 pl-9 pr-9 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Find Match
                </button>
              ) }

              {/* Time's Up Message */}
              {timeUp && (
                <p className="mt-4 text-red-500 text-lg font-bold">
                  ⏰ Time’s Up!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMatch;
