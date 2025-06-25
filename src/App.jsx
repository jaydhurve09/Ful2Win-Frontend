import { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import ProfileScreen from './pages/ProfileScreen';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Community from './pages/Community';
import Games from './pages/Games';
import Wallet from './pages/Wallet';
import Add from './pages/AddMoney';
import Withdraw from './pages/Withdraw';
import Ads from './components/Ads'; 
import HistoryPage from './components/HistoryPage';
import ClassicMode from './pages/classicMode';
import GameLobby from './pages/GameLobby';
import Challenges from './components/Challenges'; 
import Notification from './components/Notification';
import ReferralPage from './components/ReferralPage';
import ChatScreen from './components/ChatScreen';
import KYCStatusPage from './components/KYCStatusPage';
import Account from './components/Account';
import FollowerPage from './components/FollowerPage';
import SupportCenter from './pages/SupportCenter';
import LeaderboardPage from './components/LeaderboardPage';
import TournamentHistory from './components/TournamentHistory';
import FlappyBall from './components/FlappyBall';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ColorSmash from './components/ColorSmash';
import ComingSoon from './components/ComingSoon';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/profile/:id" element={<ProfileScreen />} />
              <Route path="/account" element={<Account />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/add" element={<Add />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/games" element={<Games />} />
              <Route path="/community" element={<Community />} />
              <Route path="/support" element={<SupportCenter />} />
              <Route path="/supports" element={<SupportCenter />} />
              <Route path="/ads" element={<Ads />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/classic-mode" element={<ClassicMode />} />
              <Route path="/game-lobby" element={<GameLobby />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/refer" element={<ReferralPage />} />
              <Route path="/flappyball" element={<FlappyBall />} />
              <Route path="/colorsmash" element={<ColorSmash />} />
              <Route path="/chat" element={<ChatScreen />} />
              <Route path="/kyc" element={<KYCStatusPage />} />
              <Route path="/followers" element={<FollowerPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/tournamenthistory" element={<TournamentHistory />} />
              <Route path="/comingsoon" element={<ComingSoon />} />
            </Route>
            
            {/* 404 - Not Found */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
