import React, { useState, useEffect, useCallback } from "react";
import {
  FiUser,
  FiUsers,
  FiDollarSign,
  FiEdit,
  FiShare2,
  FiLogOut,
  FiMessageSquare,
  FiMail,
  FiHeadphones,
  FiHelpCircle,
  FiRefreshCw,
  FiSettings
} from "react-icons/fi";
import { FaTrophy, FaGamepad, FaRupeeSign, FaCoins } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import defaultProfile from "../assets/default-profile.jpg";
import BackgroundBubbles from "../components/BackgroundBubbles";
import Account from "../components/Account";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import authService from "../services/authService";
import { revokeBlobUrl } from '../utils/profilePicture';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [activeSection, setActiveSection] = useState("profile");
  const [activeProfileAction, setActiveProfileAction] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [userStats, setUserStats] = useState({
    balance: 0,
    coins: 0,
    followers: 0,
    wins: 0,
    matches: 0
  });

  // Process profile picture URL
  useEffect(() => {
    if (!currentUser?._id) {
      setProfilePictureUrl('');
      return;
    }

    // Helper function to extract URL from potential object
    const getProfilePictureUrl = (profilePic) => {
      // If no profile picture, return empty string
      if (!profilePic) return '';
      
      // If it's already a valid URL, use it directly
      if (typeof profilePic === 'string') {
        // Handle case where it might be a base64 string
        if (profilePic.startsWith('data:image/')) {
          return profilePic;
        }
        // Handle Cloudinary URLs
        if (profilePic.includes('cloudinary.com')) {
          // Ensure we're using HTTPS for Cloudinary
          return profilePic.replace('http://', 'https://');
        }
        // Handle relative URLs
        if (profilePic.startsWith('/')) {
          return `${window.location.origin}${profilePic}`;
        }
        return profilePic;
      }
      
      // If it's an object, try to extract URL from common properties
      if (typeof profilePic === 'object') {
        return (
          profilePic.secure_url || // Cloudinary secure URL
          profilePic.url ||        // Cloudinary URL
          profilePic.publicUrl ||  // Other common property
          (Array.isArray(profilePic) && profilePic[0]?.url) ||
          ''
        );
      }
      
      return '';
    };

    const picUrl = getProfilePictureUrl(currentUser.profilePicture);
    console.log('Profile picture URL:', { 
      original: currentUser.profilePicture,
      processed: picUrl,
      isCloudinary: picUrl?.includes('cloudinary.com')
    });

    if (!picUrl) {
      setProfilePictureUrl('');
      return;
    }

    // Set the profile picture URL directly
    setProfilePictureUrl(picUrl);
  }, [currentUser?._id, currentUser?.profilePicture]);

  // Helper function to convert blob to base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Function to fetch fresh user data from server
  const refreshUserData = useCallback(async () => {
    if (!currentUser?._id) return;
    
    try {
      const response = await authService.getCurrentUserProfile();
      if (response) {
        // Update local storage with fresh data
        localStorage.setItem('user', JSON.stringify(response));
        
        // Update current user state
        setCurrentUser(prev => ({
          ...prev,
          ...response,
          // Preserve existing profile picture if not in response
          profilePicture: response.profilePicture || prev?.profilePicture
        }));
        
        // Update stats
        setUserStats({
          balance: response.balance || response.Balance || 0,
          coins: response.coins || 0,
          followers: response.stats?.followerCount || 0,
          wins: response.stats?.wins || 0,
          matches: response.stats?.matches || 0
        });
        return true;
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      if (error.response?.status === 401) {
        // Handle unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        toast.error('Session expired. Please log in again.');
      }
    }
    return false;
  }, [currentUser?._id, navigate]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // New state

  const { userId } = useParams();

  const fetchUserPosts = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const userData = await authService.getUserProfile(userId);
      setUserPosts(userData.posts || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      let profileData = null;
      if (userId) {
        // Fetch another user's profile
        profileData = await authService.getUserProfile(userId);
      } else {
        // Fetch current user's profile
        profileData = await authService.getCurrentUserProfile();
      }
      if (!profileData || !profileData._id) throw new Error('No user data available');
      setCurrentUser(profileData);
      setUserStats({
        balance: profileData.balance || profileData.Balance || 0,
        coins: profileData.coins || 0,
        followers: profileData.stats?.followerCount || 0,
        wins: profileData.stats?.wins || 0,
        matches: profileData.stats?.matches || 0
      });
      await fetchUserPosts(profileData._id);
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      if (error.message === 'No authentication token found' || 
          (error.response && error.response.status === 401)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        toast.error('Please log in to continue');
      } else if (!navigator.onLine) {
        if (!toast.isActive('offline-toast')) {
          toast.warning('No internet connection. Using cached data.', { toastId: 'offline-toast' });
        }
      } else if (error.message !== 'No user data available') {
        toast.error('Failed to load profile data. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId, navigate, fetchUserPosts]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleRefresh = useCallback(async () => {
    if (refreshing) return; // Prevent multiple simultaneous refreshes
    
    setRefreshing(true);
    const toastId = toast.loading('Refreshing profile...');
    
    try {
      const success = await refreshUserData();
      if (success) {
        toast.update(toastId, {
          render: 'Profile refreshed successfully',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });
      } else {
        throw new Error('Failed to refresh profile');
      }
    } catch (error) {
      console.error('Refresh error:', error);
      toast.update(toastId, {
        render: 'Failed to refresh profile. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refreshUserData]);

  const stats = [
    {
      icon: <FaRupeeSign className="text-green-500" />,
      label: "Balance",
      value: userStats.balance.toLocaleString()
    },
    {
      icon: <FaCoins className="text-yellow-500" />,
      label: "Coins",
      value: userStats.coins.toLocaleString()
    },
    {
      icon: <FaTrophy className="text-blue-500" />,
      label: "Wins",
      value: userStats.wins.toLocaleString()
    },
    {
      icon: <IoMdPerson className="text-purple-500" />,
      label: "Followers",
      value: userStats.followers.toLocaleString()
    },
  ];

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("wallet")) setActiveSection("wallet");
    else if (path.includes("tournamenthistory")) setActiveSection("tournament");
    else if (path.includes("users")) setActiveSection("users");
    else if (path.includes("account")) setActiveSection("account");
    else setActiveSection("profile");
  }, [location.pathname]);

  const navItems = [
    { id: "account", label: "Account", icon: <FiUser />, path: "/account" },
    { id: "tournament", label: "Tournament Log", icon: <FaTrophy />, path: "/tournamenthistory" },
    { id: "users", label: "Users", icon: <FiUsers />, path: "/users" },
    { id: "wallet", label: "Wallet", icon: <FaRupeeSign />, path: "/wallet" },
  ];

  const profileActions = [
    { icon: <FiEdit className="text-blue-600" />, text: "Edit Info", action: "edit" },
    { icon: <FiShare2 className="text-blue-600" />, text: "Referrals", action: "referrals" },
    { icon: <span className="text-blue-600 font-bold">KYC</span>, text: "KYC Status", action: "kyc" },
    { icon: <FiHeadphones className="text-blue-600" />, text: "Support", action: "support" },
    { icon: <FiLogOut className="text-red-500" />, text: "Log Out", action: "logout", isDanger: true },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to log out. Please try again.");
    }
  };

  const handleProfileAction = (action) => {
    setActiveProfileAction(action);
    switch (action) {
      case "edit":
        navigate("/account");
        break;
      case "referrals":
        navigate("/refer");
        break;
      case "kyc":
        navigate("/kyc");
        break;
      case "support":
        navigate("/supports");
        break;
      case "logout":
        setShowLogoutConfirm(true); // Open custom modal instead of window.confirm
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="min-h-screen w-full text-white overflow-x-hidden relative px-4 py-8"
      style={{
        background: "linear-gradient(to bottom, #0A2472 0%, #0D47A1 45%, #1565C0 100%)",
        paddingBottom: '100px'
      }}>
      <BackgroundBubbles />
      <div className="relative z-10 py-4 max-w-2xl mx-auto px-4">
        <div className="flex items-start justify-between px-4 mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative group w-20 h-20">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-dullBlue bg-gray-100 flex items-center justify-center">
                {profilePictureUrl ? (
                  <div className="w-full h-full relative">
                    <img
                      key={`${currentUser?._id || 'default'}-profile`}
                      src={profilePictureUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        console.log('Profile image loaded successfully');
                      }}
                      onError={(e) => {
                        console.error('Failed to load profile image, using default');
                        e.target.onerror = null;
                        setProfilePictureUrl('');
                      }}
                    />
                    {process.env.NODE_ENV === 'development' && (
                      <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-1 rounded-tl">
                        {profilePictureUrl.includes('cloudinary.com') ? 'cdn' : 
                         profilePictureUrl.startsWith('data:image/') ? 'data' : 'url'}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="text-dullBlue text-3xl" />
                  </div>
                )}
              </div>
            </div>
            <div className="text-white">
              <h2 className="text-xl font-semibold">
                {currentUser?.fullName || 'User Name'}
              </h2>
              <p className="text-sm text-dullBlue">
                @{currentUser?.username || 'username'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchUserData(true)}
              className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Refresh data"
              disabled={loading}
            >
              <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex justify-around mb-2 mt-4 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                navigate(item.path);
              }}
              className="flex flex-col items-center space-y-1"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all ${
                  activeSection === item.id
                    ? "bg-blue-400 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-sm transition-all ${
                  activeSection === item.id
                    ? "text-white font-semibold"
                    : "text-white/80 font-medium"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {activeSection === 'account' && (
          <div className="mb-6 mt-4">
            <Account />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4 mt-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl flex items-center space-x-3 shadow-sm"
            >
              <div className="w-10 h-10 bg-gray-100 border rounded-full flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg">
                  {loading ? '...' : stat.value || '0'}
                </div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 mb-20">
          {profileActions.map((item, index, array) => (
            <React.Fragment key={item.action}>
              <button
                onClick={() => handleProfileAction(item.action)}
                className={`w-full flex items-center p-4 rounded-xl transition-all group ${
                  item.isDanger ? "hover:bg-red-50" : "hover:bg-blue-50"
                }`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center mr-3 rounded-full transition-colors ${
                    item.isDanger
                      ? "bg-red-50 group-hover:bg-red-100"
                      : "bg-blue-50 group-hover:bg-blue-100"
                  }`}
                >
                  {item.icon}
                </div>
                <div
                  className={`flex-1 text-left text-sm sm:text-base font-medium ${
                    item.isDanger ? "text-red-600" : "text-gray-800"
                  }`}
                >
                  {item.text}
                </div>
                <div className="text-gray-400 group-hover:text-blue-600 text-lg">
                  &gt;
                </div>
              </button>
              {index < array.length - 1 && (
                <div key={`divider-${index}`} className="px-4 py-1">
                  <div className="w-full h-px bg-gray-200"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-2xl mx-auto">
          <Navbar />
        </div>
      </div>

      {/* ✅ Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ProfileScreen;
