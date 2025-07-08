import { createContext, useContext, useState } from 'react';


const Ful2WinContext = createContext();
const Ful2winContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);

  return (
    <Ful2WinContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, loading, setLoading, error, setError, balance, setBalance }}>
      {props.children}
    </Ful2WinContext.Provider>
  );
}

const useFul2WinContext = () => {
  return useContext(Ful2WinContext);
}

export { Ful2winContextProvider, useFul2WinContext };
export default Ful2winContextProvider;