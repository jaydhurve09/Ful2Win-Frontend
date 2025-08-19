import React, { useEffect, useState , useRef} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { Ful2WinContext } from "../context/ful2winContext";
import Waiting from "./Waiting";
import Winner from "./Winner";
const API_BASE_URL = import.meta.env.MODE === 'development' 
? 'http://localhost:5000' 
:  `${import.meta.env.VITE_API_BACKEND_URL}/api`


const GameOn2 = () => {
  const { gameId, roomId } = useParams();
  const { allUsers,games,socket } = useContext(Ful2WinContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isWaiting , setIsWaiting] = useState(false);

  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  

  useEffect(() => {
   
    socket.on("game_over_response", (data) => {
      console.log("Game over event received:", data);
      setScoreData(data);
      setIsWaiting(false);
      setGameOver(true);
      
    });

  
  }, []);

    const fetchGameById = async () => {
      try {
       
        const foundGame = games.find((g) => g._id === gameId);

        if (foundGame) {
          setGame(foundGame);
        } else {
          setError("Game not found");
        }
      } catch (err) {
        setError("Failed to load game data");
        console.error(err);
      }
    };

    useEffect(() => {
      fetchGameById();
    }, [gameId]);

  const getUserInfo = async() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return {
        userId: user?._id,
        userName: user?.username,
      };
    } catch (e) {
      return { userId: null, userName: null };
    }
  };

  // ✅ Handle GAME_OVER event from the iframe (only if authorized)
// //   useEffect(() => {
    

// //     const handleMessage = async (event) => {
// //       const { type, score } = event.data;
// //       if (type === "GAME_OVER") {
// //         const { userId } = await getUserInfo();
        
// //         try {
// //           const scorePayload = {
// //                    score,
// //                    userId,
// //                    roomId,
// //                  };

// //                socket.emit("game_over", scorePayload);
// //                setIsWaiting(true);

// //         }
// //     catch (error) {
// //          console.error('Error in score submission:', {
// //            message: error.message,
// //            stack: error.stack,
// //            response: error.response?.data || 'No response data'
// //          });
// //          throw error;
// //     }
// //   }
// // }

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, [game, roomId]);

  // Show loading while checking authorization

  

  

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading game...
      </div>
    );
  }
  if (isWaiting) {
    return <Waiting gameId={gameId} />;
  }

  const iframeSrc = game.assets?.gameUrl?.baseUrl;

  return gameOver ? (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
      <Winner scoreData={scoreData} />
    </div>
  ) : (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <h1 className="text-xl font-bold mb-4">
        {game.displayName || game.name}
      </h1>

      <div className="w-full h-full">
        <iframe
          src={iframeSrc}
          title={game?.displayName || 'Game'}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock allow-orientation-lock"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad; fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => console.log('Iframe loaded successfully')}
          onError={(e) => {
            console.error('Iframe error:', e);
            setError(`Failed to load game. Please check if the game URL is correct.`);
          }}
          loading="eager"
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default GameOn2;
