import { createContext,useEffect,useState } from 'react';

const API_BASE_URL = import.meta.env.MODE === 'development' 
? 'http://localhost:5000/api' 
:  `${import.meta.env.VITE_API_BACKEND_URL}/api`

console.log('API Base URL:', API_BASE_URL); // Debug log

export const Ful2WinContext = createContext();
const Ful2WinContextProvider = (props) => {
  const [games, setGames] = useState([]);
  const [tournaments, setTournaments] = useState([]);

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






useEffect(() => {
    fetchGames();
    fetchTournaments();
  }, []);

  const value = {
    games,
    setGames,
    tournaments,
    setTournaments
  };

  return (
    <Ful2WinContext.Provider value={ value }>
      {props.children}
    </Ful2WinContext.Provider>
  );
}

export default Ful2WinContextProvider;