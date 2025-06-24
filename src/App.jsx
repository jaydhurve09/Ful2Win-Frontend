import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import ProfileScreen from './pages/ProfileScreen'
import SupportCenter from './pages/SupportCenter';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Community from './pages/Community';
import Games from './pages/Games';
import Wallet from './pages/Wallet';
import Add from './pages/AddMoney';
import Withdraw from './pages/Withdraw';
import Ads from './components/Ads';
import HistoryPage from './components/HistoryPage';
import ClassicMode from './pages/ClassicMode'
import GameLobby from './pages/GameLobby'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      {/* <div className="bg-red-500 text-white p-4">Tailwind Works!</div> */}
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/games" element={<Games />} />
            <Route path="/profile" element={<ProfileScreen/>} />
            <Route path="/support" element={<SupportCenter />} />
            <Route path="/community" element={<Community />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/add" element={<Add />} /> 
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/profile/:id" element={<ProfileScreen/>} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/history" element={<HistoryPage />} />
             <Route path="/ClassicMode" element={<ClassicMode/>} />
            <Route path="/game-lobby" element={<GameLobby />} /> 
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </>
  )
}

export default App
