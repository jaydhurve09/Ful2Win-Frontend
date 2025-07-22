import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';
import { toast } from 'react-toastify';
import api from '../services/api';
import authService from '../services/authService';
import ChatScreen from './ChatScreen';
import { FiHome, FiMessageSquare, FiAward } from 'react-icons/fi';
import { RiSwordLine } from 'react-icons/ri';
import Button from '../components/Button';

function FollowerPage() {
   const [activeTab, setActiveTab] = useState('followers');
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUserProfile();
      if (!currentUser) throw new Error('Not authenticated');

      // Use the same endpoint as Challenges page to get all users
      const response = await api.get('/challenges/users');
      const allUsers = Array.isArray(response.data?.users) ? response.data.users : [];
      
      // Filter out the current user and ensure we have valid user objects
      const others = allUsers.filter(user => 
        user && user._id && user._id !== currentUser._id
      );
      
      setUsers(others);
      setFilteredUsers(others);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Unable to load users. Please try again.');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const term = search.toLowerCase();
    if (!term) {
      setFilteredUsers(users);
      return;
    }
    setFilteredUsers(
      users.filter(
        (u) =>
          (u.name || '').toLowerCase().includes(term) ||
          (u.username || '').toLowerCase().includes(term) ||
          (u.email || '').toLowerCase().includes(term)
      )
    );
  }, [search, users]);

   const communityTabs = [
      { id: 'feed', label: 'Feed', icon: <FiHome className="mr-1" /> },
      { id: 'followers', label: 'Followers', icon: <FiMessageSquare className="mr-1" /> },
      { id: 'challenges', label: 'Challenges', icon: <RiSwordLine className="mr-1" /> },
      { id: 'leaderboard', label: 'Leaderboard', icon: <FiAward className="mr-1" /> },
    ];
    
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

  return (
    <>
      <div className="min-h-screen w-full bg-white text-gray-900 pb-24 overflow-hidden">
        <BackgroundBubbles />
        <div className="relative z-10 w-full">
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

          <div className="pt-10 px-2 sm:px-4 md:px-8  mb-2 w-full max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-black whitespace-nowrap truncate mb-4" style={{letterSpacing: '1px'}}>
                Community Members
              </h1>

            {/* Search */}
            <div className="flex justify-center mb-2">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, username, or email..."
                  className="w-full px-3 py-2 pl-8 rounded-lg bg-blue-50 text-gray-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[15px] sm:text-base"
                />
                <svg
                  className="absolute left-2 top-2.5 h-4 w-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Users List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-blue-50 rounded-xl p-4 max-w-md mx-auto">
                  <div className="text-5xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">
                    {search ? 'No users found' : 'No active users'}
                  </h3>
                  <p className="text-blue-500 mb-4">
                    {search
                      ? 'Try a different search term'
                      : 'There are no other active users right now.'}
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-white text-sm"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 p-1 rounded-xl">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChatUser(user);
                    }}
                    className="bg-gradient-to-r from-[#0b3fae] via-[#1555d1] to-[#2583ff] shadow-lg rounded-xl p-3 flex items-center gap-3 hover:scale-[1.03] hover:shadow-xl cursor-pointer transition-all duration-200 border border-white"
                    style={{ minWidth: 0 }}
                  >
                    <div className="relative">
                      <img
                        src={
                          user.profilePicture ||
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name || user.username || 'U'
                          )}&background=0b3fae&color=fff`
                        }
                        alt={user.name || user.username || 'User'}
                        className="w-10 h-10 rounded-full border-2 border-blue-300 object-cover flex-shrink-0 shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name || user.username || 'U'
                          )}&background=0b3fae&color=fff`;
                        }}
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="text-[15px] font-semibold text-gray-900 truncate">
                          {user.name || user.username || 'User'}
                        </h3>
                        {user.isOnline && (
                          <span className="text-[10px] text-green-600 bg-green-100 px-1 py-0.5 rounded-full ml-1">Online</span>
                        )}
                      </div>
                      {user.username && (
                        <p className="text-[12px] text-white truncate">
                          @{user.username}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChatUser(user);
                      }}
                      className="bg-blue-100 hover:bg-blue-300 text-blue-700 hover:text-blue-900 rounded-full p-1 shadow focus:outline-none flex items-center justify-center"
                      title="Message"
                    >
                      <FiMessageSquare size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Navbar />
      </div>

      {/* Chat Modal Overlay */}
      {selectedChatUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-2xl max-h-[90vh] bg-blue-900 rounded-xl shadow-2xl overflow-hidden">
            <ChatScreen
              selectedFriend={selectedChatUser}
              setSelectedFriend={setSelectedChatUser}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default FollowerPage;