import './App.css';
import Home from './pages/Home';
import ProfileScreen from './pages/ProfileScreen';
import Wallet from './pages/Wallet';
import ErrorBoundary from './MyComponents/ErrorBoundary';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
