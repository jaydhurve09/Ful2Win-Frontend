import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import api from '../services/api';
import { toast } from 'react-toastify';
import Header from './Header';
import Navbar from './Navbar';
import BackgroundBubbles from './BackgroundBubbles';

const FollowerPage = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch current user's profile first to ensure we're authenticated
      const currentUser = await authService.getCurrentUserProfile();
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      // Fetch all users from the backend
      const response = await api.get('/users');
      
      // Filter out the current user
      const allUsers = response.data.filter(user => user._id !== currentUser._id);
      
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again later.');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Apply search filter
  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
      return;
    }

    const searchTerm = search.toLowerCase();
    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.username?.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  // Filter users based on search query
  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
      return;
    }

    const searchTerm = search.toLowerCase();
    const filtered = users.filter(user => 
      (user.name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.username?.toLowerCase().includes(searchTerm))
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const displayUsers = filteredUsers;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff] text-white pb-24 overflow-hidden">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

        <div className="pt-20 px-4 max-w-4xl mx-auto">
          {/* Back button + Heading */}
          <div className="flex items-center justify-center gap-3 mb-6 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 text-white text-3xl px-2"
            >
              &#8249;
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-100">
              Community Members
            </h1>
          </div>

          {/* Search */}
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by name, username, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-white/70"
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

          {/* User Cards */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : displayUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/5 rounded-xl p-6 max-w-md mx-auto">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {search ? 'No users found' : 'No active users'}
                </h3>
                <p className="text-white/70 mb-4">
                  {search 
                    ? 'Try a different search term'
                    : 'There are no other active users at the moment.'}
                  </p>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {displayUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-4 flex items-center space-x-4 hover:bg-white/20 cursor-pointer transition-colors duration-200"
                >
                  <img
                    src={user.profilePicture || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'U')}&background=0b3fae&color=fff`}
                    alt={user.name || user.username || 'User'}
                    className="w-12 h-12 rounded-full border-2 border-blue-400 object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'U')}&background=0b3fae&color=fff`;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {user.name || user.username || 'User'}
                      </h3>
                    </div>
                    <p className="text-sm text-white/60 truncate">
                      {user.username && `@${user.username}`}
                    </p>
                    {user.bio && (
                      <p className="text-sm text-white/70 mt-1 line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default FollowerPage;
