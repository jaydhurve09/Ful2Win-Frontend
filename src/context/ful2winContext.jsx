
import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.MODE === 'development' 
? 'http://localhost:5000/api' 
:  `${import.meta.env.VITE_API_BACKEND_URL}/api`


const Socket_BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api'
  : `${import.meta.env.VITE_API_BACKEND_URL}`;

// Singleton socket instance
let socketInstance = null;
function getSocket() {
  if (!socketInstance) {
    socketInstance = io(Socket_BASE_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });
  }
  return socketInstance;
}

console.log('API Base URL:', API_BASE_URL); // Debug log
console.log('Socket Base URL:', Socket_BASE_URL); // Debug log

export const Ful2WinContext = createContext();

const Ful2WinContextProvider = (props) => {
  const [games, setGames] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const socket = getSocket();

  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/games`);
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      setGames(data.data);
      //console.log('Fetched games:', data.data); // Debug log

    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };
  const fetchTournaments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments`);
      if (!response.ok) {
        throw new Error('Failed to fetch tournaments');
      }
      const data = await response.json();
      setTournaments(data.data);
      
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      setAllUsers(data.data);
      // Debug log
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };







  useEffect(() => {
    fetchGames();
    fetchTournaments();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    function handleConnect() {
      console.log('Socket connected:', socket.id);
    }
    function handleDisconnect() {
      console.log('Socket disconnected');
    }
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      // Do not disconnect the singleton socket here unless you want to close it for the whole app
      // socket.disconnect();
      console.log('Socket listeners cleaned up');
    };
  }, [socket]);


  const value = {
    games,
    setGames,
    tournaments,
    setTournaments,
    allUsers,
    setAllUsers,
    socket
  };

  return (
    <Ful2WinContext.Provider value={ value }>
      {props.children}
    </Ful2WinContext.Provider>
  );
}

export default Ful2WinContextProvider;