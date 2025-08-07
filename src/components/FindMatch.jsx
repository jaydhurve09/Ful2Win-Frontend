import React, { useEffect, useRef, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";

const FindMatch = ({ tournament, onClose }) => {
  const [progress, setProgress] = useState(1); // 1 = full progress
  const [timeUp, setTimeUp] = useState(false);
  const timerRef = useRef(null);

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
        console.log("⏰ Time's up!");
      }
    }, 50); // update every 50ms for smoothness
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current); // Cleanup on unmount
  }, []);
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
                <img
                  src={tournament?.imageUrl || "/placeholder.jpg"}
                  alt={tournament?.name}
                  className="w-28 h-28 object-cover rounded-md"
                />
              </div>
            </div>

            {/* Start Match Button */}
            <div className="p-4 flex flex-col items-center">
              <button
                onClick={handleStart}
                className="w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-yellow-500 text-white text-xl p-4 pl-9 pr-9 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2"
              >
                Find Match
              </button>

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
