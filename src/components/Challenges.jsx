import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundCircles from '../components/BackgroundCircles';
import { NeonGradientCard } from '../components/ui-components/neon-gradient-card';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import ShineButton from './ui/ShineButton';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FiHome, FiMessageSquare, FiAward } from 'react-icons/fi';
import { RiSwordLine } from 'react-icons/ri';
import Button from '../components/Button';

const Challenges = () => {
  const [activeTab, setActiveTab] = useState('challenges');
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [friendName, setFriendName] = useState('');
  const [gameInput, setGameInput] = useState('');
  const [message, setMessage] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [incomingInvites, setIncomingInvites] = useState([]);
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [showGameSuggestions, setShowGameSuggestions] = useState(false);

  const navigate = useNavigate();

  // Fetch users and games on component mount
  useEffect(() => {
    fetchUsers();
    fetchGames();
    fetchChallenges();
  }, []);

  const communityTabs = [
    { id: 'feed', label: 'Feed', icon: <FiHome className="mr-1" /> },
    { id: 'followers', label: 'Followers', icon: <FiMessageSquare className="mr-1" /> },
    { id: 'challenges', label: 'Challenges', icon: <RiSwordLine className="mr-1" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FiAward className="mr-1" /> },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/challenges/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await api.get('/challenges/games');
      setGames(response.data.games || []);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast.error('Failed to load games');
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await api.get('/challenges');
      const allChallenges = response.data.challenges || [];
      
      const userData = JSON.parse(localStorage.getItem('user'));
      // Separate incoming and outgoing challenges
      const incoming = allChallenges.filter(challenge => 
        challenge.challenged._id === userData._id && 
        challenge.status === 'pending'
      );
      const outgoing = allChallenges.filter(challenge => 
        challenge.challenger._id === userData._id && 
        challenge.status === 'pending'
      );
      
      setIncomingInvites(incoming);
      console.log(incoming);
      setChallenges([...outgoing, ...allChallenges.filter(c => c.status !== 'pending')]);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges');
    }
  };

  const filteredUsers = friendName.length > 0
    ? users.filter(user =>
        user.fullName.toLowerCase().includes(friendName.toLowerCase()) &&
        user.fullName.toLowerCase() !== friendName.toLowerCase()
      )
    : [];

  const filteredGames = gameInput.length > 0
    ? games.filter(game =>
        game.displayName.toLowerCase().includes(gameInput.toLowerCase())
      )
    : games;

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!friendName || !gameInput) {
      toast.error('Please fill both friend name and game fields');
      return;
    }

    // Find the selected user and game
    const selectedUser = users.find(user => 
      user.fullName.toLowerCase() === friendName.toLowerCase()
    );
    const selectedGame = games.find(game => 
      game.displayName.toLowerCase() === gameInput.toLowerCase()
    );

    if (!selectedUser || !selectedGame) {
      toast.error('Please select valid user and game from the suggestions');
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.MODE === 'development' 
         ? 'http://localhost:5000/api' 
         :  `${import.meta.env.VITE_API_BACKEND_URL}/api`;

      const response = await fetch(`${API_BASE_URL}/challenges`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          challengedUserId: selectedUser._id,
        gameId: selectedGame._id,
        message: message
        })
      });

      setSubmitting(true);

      toast.success('Challenge sent successfully!');
      setFriendName('');
      setGameInput('');
      setMessage('');
      fetchChallenges(); // Refresh the challenges list
    } catch (error) {
      console.error('Error sending challenge:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send challenge';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelChallenge = async (challengeId) => {
    try {
      await api.put(`/challenges/${challengeId}/cancel`);
      toast.success('Challenge cancelled successfully');
      fetchChallenges();
    } catch (error) {
      console.error('Error cancelling challenge:', error);
      toast.error('Failed to cancel challenge');
    }
  };
  
  
  const handleTabChange = (tabId) => {
    if (tabId === 'challenges') {
      navigate('/challenges'); // Navigate to the dedicated challenges page
    } else if (tabId === 'leaderboard') {
      navigate('/community/leaderboard'); // Navigate to the leaderboard page
    } else if (tabId === 'followers') {
      window.location.href = '/users'; // Full page navigation to users page
      return;
    } else {
      setActiveTab(tabId);
    }
  };

  const handleAcceptInvite = async (challengeId , gameId) => {
    try {
      await api.put(`/challenges/${challengeId}/accept`);
      toast.success('Challenge accepted successfully');
      fetchChallenges();
      navigate(`/tournament-lobby/${gameId}`); // Redirect to game page after accepting
    } catch (error) {
      console.error('Error accepting challenge:', error);
      toast.error('Failed to accept challenge');
    }
  };

  const handleRejectInvite = async (challengeId) => {
    try {
      await api.put(`/challenges/${challengeId}/reject`);
      toast.success('Challenge rejected');
      fetchChallenges();
    } catch (error) {
      console.error('Error rejecting challenge:', error);
      toast.error('Failed to reject challenge');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'accepted': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'completed': return 'text-blue-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-royalBlueGradient">
      <BackgroundCircles />
      <div className="relative z-10">
        <Header />

        <div className="pt-20 md:pt-0 w-full flex justify-center">
                    <div className="w-full max-w-3xl px-2">
                      <div className="hidden md:flex gap-2 mb-2 overflow-x-auto py-1 justify-end pr-1">
                        {communityTabs.map((tab) => (
                          <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? 'primary' : 'gradient'}
                            onClick={() => handleTabChange(tab.id)}
                            className="rounded-full px-4 py-2 flex items-center whitespace-nowrap text-sm"
                          >
                            {React.cloneElement(tab.icon, { className: 'mr-1.5' })}
                            {tab.label}
                          </Button>
                        ))}
                      </div>
        
                      <div className="flex md:hidden w-full mb-2 py-1 px-1">
                        <div className="w-full flex justify-start space-x-1 pr-1">
                          {communityTabs.map((tab) => (
                            <Button
                              key={tab.id}
                              variant={activeTab === tab.id ? 'active' : 'gradient'}
                              onClick={() => handleTabChange(tab.id)}
                              className={`w-full rounded-full shadow-lg shadow-gray-700 ${activeTab === tab.id ? 'px-3 py-1.5' : 'p-2.5'} flex items-center justify-center`}
                              title={tab.label}
                            >
                              {React.cloneElement(tab.icon, { 
                                className: `text-sm ${activeTab === tab.id ? 'mr-1' : ''}` 
                              })}
                              {activeTab === tab.id && (
                                <span className="text-xs ml-0.5">{tab.label}</span>
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
        
  

        <div className="px-6 max-w-2xl mx-auto mt-5 space-y-6">
          {/* Challenge Form */}
          <NeonGradientCard className="max-w-sm items-center justify-center text-center p-4 opacity-90">
            <div className="text-black">
              <div
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="flex justify-between cursor-pointer"
              >
                <h2 className="text-lg font-bold text-blue-800">Challenge a Friend</h2>
                <span>{isFormOpen ? '▲' : '▼'}</span>
              </div>

              <form
                onSubmit={handleInviteSubmit}
                className={`mt-4 transition-all duration-300 ease-in-out ${isFormOpen
                    ? 'max-h-[1000px] opacity-100 scale-100'
                    : 'max-h-0 opacity-0 scale-95 pointer-events-none'
                  }`}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter friend's name"
                    value={friendName}
                    onChange={(e) => {
                      setFriendName(e.target.value);
                      setShowUserSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowUserSuggestions(friendName.length > 0)}
                    className="w-full p-2 border rounded-lg"
                  />
                  {showUserSuggestions && filteredUsers.length > 0 && (
                    <ul className="absolute w-full bg-white border rounded mt-1 z-10 text-sm max-h-40 overflow-y-auto">
                      {filteredUsers.map((user, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setFriendName(user.fullName);
                            setShowUserSuggestions(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-200 cursor-pointer flex items-center"
                        >
                          <img
                            src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}`}
                            alt={user.fullName}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          {user.fullName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="relative mt-3">
                  <input
                    type="text"
                    placeholder="Enter game name"
                    value={gameInput}
                    onChange={(e) => {
                      setGameInput(e.target.value);
                      setShowGameSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowGameSuggestions(gameInput.length > 0)}
                    className="w-full p-2 border rounded-lg"
                  />
                  {showGameSuggestions && filteredGames.length > 0 && (
                    <ul className="absolute w-full bg-white border rounded mt-1 z-10 text-sm max-h-40 overflow-y-auto">
                      {filteredGames.map((game, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setGameInput(game.displayName);
                            setShowGameSuggestions(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-200 cursor-pointer flex items-center"
                        >
                          <img
                            src={game.thumbnail || 'https://via.placeholder.com/30x30'}
                            alt={game.displayName}
                            className="w-6 h-6 rounded mr-2"
                          />
                          {game.displayName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <textarea
                  placeholder="Optional message (max 200 characters)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={200}
                  className="w-full p-2 border rounded-lg mt-3 resize-none"
                  rows="3"
                />

                <ShineButton
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2 mt-4 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send Challenge'
                  )}
                </ShineButton>
              </form>
            </div>
          </NeonGradientCard>

          {/* Incoming Invites */}
          {incomingInvites.length > 0 && (
            <div className="glass-effect bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-white/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 to-red-200/20 rounded-2xl opacity-30"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-4 text-red-700 flex items-center">
                  <span className="relative inline-flex mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  Incoming Invites
                </h2>
                <div className="space-y-3">
                  {incomingInvites.map((invite) => (
                    <div 
                      key={invite._id} 
                      className="glass-card group relative p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <img
                              src={invite.challenger.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(invite.challenger.fullName)}`}
                              alt={invite.challenger.fullName}
                              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                            />
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{invite.challenger.fullName}</p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
                              {invite.game.displayName}
                            </p>
                            {invite.message && (
                              <p className="text-sm text-gray-700 mt-1.5 px-3 py-2 bg-white/50 rounded-lg border-l-2 border-red-400">
                                "{invite.message}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          <button
                            onClick={() => handleAcceptInvite(invite._id, invite.game._id)}
                            className="glass-button bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-green-200/50 transition-all duration-200 flex items-center justify-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectInvite(invite._id)}
                            className="glass-button bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-red-200/50 transition-all duration-200 flex items-center justify-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Reject
                          </button>
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <style jsx>{`
                .glass-effect {
                  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                  backdrop-filter: blur(8px);
                  -webkit-backdrop-filter: blur(8px);
                }
                .glass-card {
                  transition: all 0.3s ease;
                }
                .glass-card:hover {
                  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.95),
                              inset 0 -1px 1px rgba(0, 0, 0, 0.15),
                              0 0 30px 2px rgba(220, 220, 220, 0.7);
                }
                .glass-button {
                  position: relative;
                  overflow: hidden;
                  transition: all 0.3s ease;
                }
                .glass-button::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                  transform: translateX(-100%);
                  transition: transform 0.6s ease;
                }
                .glass-button:hover::after {
                  transform: translateX(100%);
                }
              `}</style>
            </div>
          )}

          {/* Ongoing Challenges */}
          {challenges.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="text-black">
                <h2 className="text-lg font-semibold mb-3 text-blue-700">All Challenges</h2>
                {challenges.map((challenge) => (
                  <div key={challenge._id} className="flex justify-between items-center mb-3 p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <img
                        src={challenge.challenger.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(challenge.challenger.fullName)}`}
                        alt={challenge.challenger.fullName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">
                          {challenge.challenger.fullName} → {challenge.challenged.fullName}
                        </p>
                        <p className="text-sm text-gray-600">{challenge.game.displayName}</p>
                        <p className={`text-xs ${getStatusColor(challenge.status)}`}>
                          {getStatusText(challenge.status)}
                        </p>
                        {challenge.message && (
                          <p className="text-xs text-gray-500 mt-1">"{challenge.message}"</p>
                        )}
                      </div>
                    </div>
                    {challenge.status === 'pending' && challenge.challenger._id === localStorage.getItem('userId') && (
                      <button
                        onClick={() => handleCancelChallenge(challenge._id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="text-black text-center">
                <FaSpinner className="animate-spin mx-auto mb-2" size={24} />
                <p>Loading challenges...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && challenges.length === 0 && incomingInvites.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="text-black text-center">
                <p className="text-gray-500">No challenges yet. Send a challenge to get started!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Challenges;
