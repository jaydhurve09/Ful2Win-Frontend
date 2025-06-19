import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import ProfileScreen from './pages/ProfileScreen'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import CommunityFeed from './pages/CommunityFeed'

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
            <Route path="/profile" element={<ProfileScreen/>} />
            <Route path='/community' element={<CommunityFeed/>} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </>
  )
}

export default App
