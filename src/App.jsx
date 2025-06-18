import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

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
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </>
  )
}

export default App
