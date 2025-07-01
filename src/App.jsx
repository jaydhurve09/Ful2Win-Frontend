import { useState } from 'react';
<<<<<<< HEAD
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
=======
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
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
<<<<<<< HEAD
=======
import CommunityLeaderboard from './components/CommunityLeaderboard';
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
import TournamentHistory from './components/TournamentHistory';
import FlappyBall from './games/FlappyBall';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PhoneVerification from './pages/PhoneVerification';
import ForgotPassword from './pages/ForgotPassword';
<<<<<<< HEAD
import { AuthProvider } from './contexts/AuthContext';
=======
import { AuthProvider, useAuth } from './contexts/AuthContext';
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
import ProtectedRoute from './components/ProtectedRoute';
import ColorSmash from './games/ColorSmash';
import Leaderboard from './components/Leaderboard';
import TournamentLobby from './components/TournamentLobby';
import GameTournaments from './pages/GameTournaments';
import ComingSoon from './components/ComingSoon';
import MatchMerge from './games/MatchMerge';
import EggCatcher from './games/EggCatcher';
import GravityHop from './games/GravityHop';
import GameWrapper from './components/GameWrapper';
import GameOn from './components/GameOn';
<<<<<<< HEAD

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ToastContainer 
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{
              zIndex: 10000,
            }}
            toastStyle={{
              background: '#fff',
              color: '#333',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '90%',
              margin: '0 auto 20px',
            }}
          />
=======
import StartScreen from './components/StartScreen';
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const { showSplash } = useAuth();
  
  // Show splash screen during initial load and after login
  if (showSplash) {
    return <StartScreen />;
  }
  
  return (
    <div>
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
              
          <ToastContainer 
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-phone" element={<PhoneVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
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
<<<<<<< HEAD
=======
              <Route path="/community/leaderboard" element={<CommunityLeaderboard />} />
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
              <Route path="/support" element={<SupportCenter />} />
              <Route path="/supports" element={<SupportCenter />} />
              <Route path="/ads" element={<Ads />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/classic-mode" element={<ClassicMode />} />
<<<<<<< HEAD
              <Route path="/game-lobby" element={<GameLobby />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/referrals" element={<ReferralPage />} />
              <Route path="/games/:gameId" element={<GameWrapper />} />
              <Route path="/chat" element={<ChatScreen />} />
              <Route path="/kyc" element={<KYCStatusPage />} />
              <Route path="/followers" element={<FollowerPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
=======
              <Route path="/game-lobby/:gameId" element={<GameLobby />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/refer" element={<ReferralPage />} />
              <Route path="/games/:gameId" element={<GameWrapper />} />
              <Route path="/chat" element={<ChatScreen />} />
              <Route path="/kyc" element={<KYCStatusPage />} />
              <Route path="/users" element={<FollowerPage />} />
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
              <Route path="/tournamenthistory" element={<TournamentHistory />} />
              <Route path="/leaderboard_singlegame/:gameName/:tournamentId" element={<Leaderboard />}/>
              <Route path="/tournament/:tournamentId" element={<TournamentLobby />} />
              <Route path="/tournament-lobby/:gameId" element={<TournamentLobby />} />
              <Route path="/gameOn/:gameId/:tournamentId" element={<GameOn />} />
              <Route path="/comingsoon" element={<ComingSoon />} />
<<<<<<< HEAD
=======
              <Route path="/startscreen" element={<StartScreen />} />
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
            </Route>
            
            {/* 404 - Not Found */}
            <Route path="*" element={<Navigate to="/" replace />} />
<<<<<<< HEAD
=======
          
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
<<<<<<< HEAD
=======
      </div>
>>>>>>> bced60bd76460f363b7b931c2d1ca19819f69d8b
  );
}

export default App;
