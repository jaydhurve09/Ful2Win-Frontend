import {React} from 'react';
import { useEffect } from 'react';

const GravityHop = () => {
    useEffect(() => {
    const handleMessage = (event) => {
      // ✅ Check origin to prevent security issues
      if (event.origin !== "http://localhost:4000") return;

      const { type, score } = event.data;

      if (type === "GAME_OVER") {
        console.log("🎯 Final Score from Game:", score);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);
  
  return (
    <div className="game">
      <iframe
        src="http://localhost:4000"
        title="2048 Game"
        width="100%"
        height="100%"
        style={{ border: 'none' , position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 , height: '100vh', width: '100vw' }}
        ></iframe>
    </div>
  );
};

export default GravityHop;