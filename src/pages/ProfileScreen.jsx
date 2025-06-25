import React, { useState, useEffect } from "react";
import { FiUser, FiUsers, FiDollarSign, FiEdit, FiShare2, FiLogOut, FiMessageSquare, FiMail, FiHeadphones, FiHelpCircle } from "react-icons/fi";
import { FaTrophy, FaGamepad, FaRupeeSign } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import defaultProfile from "../assets/default-profile.jpg";
import BackgroundBubbles from "../components/BackgroundBubbles";
import Account from "../components/Account";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [activeSection, setActiveSection] = useState("profile");
  const [activeProfileAction, setActiveProfileAction] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { userId } = useParams();

  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("wallet")) setActiveSection("wallet");
    else if (path.includes("tournamenthistory")) setActiveSection("tournament");
    else if (path.includes("followers")) setActiveSection("followers");
    else if (path.includes("account")) setActiveSection("account");
    else setActiveSection("profile");
  }, [location.pathname]);

  const navItems = [
    { id: "account", label: "Account", icon: <FiUser />, path: "/account" },
    { id: "tournament", label: "Tournament Log", icon: <FaTrophy />, path: "/tournamenthistory" },
    { id: "followers", label: "Followers", icon: <FiUsers />, path: "/followers" },
    { id: "wallet", label: "Wallet", icon: <FaRupeeSign />, path: "/wallet" },
  ];

  const stats = [
    { icon: <FaTrophy className="text-yellow-500" />, label: "Wins", value: 120 },
    { icon: <FiDollarSign className="text-blue-500" />, label: "Coins", value: 5000 },
    { icon: <FaGamepad className="text-purple-500" />, label: "Matches", value: 1234 },
    { icon: <IoMdPerson className="text-green-500" />, label: "Followers", value: 89 },
  ];

  const profileActions = [
    {
      icon: <FiMail className="text-blue-600" />,
      text: "Email",
      action: "email",
    },
    {
      icon: <FiEdit className="text-blue-600" />,
      text: "Edit Info",
      action: "edit",
    },
    {
      icon: <FiShare2 className="text-blue-600" />,
      text: "Referrals",
      action: "referrals",
    },
    {
      icon: <span className="text-blue-600 font-bold">KYC</span>,
      text: "KYC Status",
      action: "kyc",
    },
    {
      icon: <FiHeadphones className="text-blue-600" />,
      text: "Support",
      action: "support",
    },
    {
      icon: <FiLogOut className="text-red-500" />,
      text: "Log Out",
      action: "logout",
      isDanger: true,
    },
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
      case "email":
        alert("Email section coming soon!");
        break;
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
        if (window.confirm("Are you sure you want to log out?")) {
          handleLogout();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="min-h-screen w-full text-white overflow-x-hidden relative px-4 py-8"
      style={{
        background:
          "linear-gradient(to bottom, #0A2472 0%, #0D47A1 45%, #1565C0 100%)",
      }}
    >
      <BackgroundBubbles />

      <div className="relative z-10 py-4 max-w-2xl mx-auto px-4">
        {/* Profile Picture */}
        <div className="w-20 h-20 mx-auto mt-4 mb-1 rounded-full bg-yellow-300 flex items-center justify-center overflow-hidden">
          <img
            src={currentUser?.profilePicture || defaultProfile}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultProfile;
            }}
          />
        </div>

        {/* Nav Icons */}
        <div className="flex justify-around mb-2 mt-4 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (item.id === 'profile') {
                  navigate('/account');
                } else {
                  navigate(item.path);
                }
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

        {/* Account Section - Only show when account is explicitly selected */}
        {activeSection === 'account' && (
          <div className="mb-6 mt-4">
            <Account />
          </div>
        )}

        {/* Other Sections */}
        {/* {activeSection !== 'account' && (
          <div className="bg-white rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {activeSection === 'wallet' && 'Wallet'}
              {activeSection === 'tournament' && 'Tournament History'}
              {activeSection === 'followers' && 'Followers'}
            </h2>
            <p className="text-gray-600">
              {activeSection === 'wallet' && 'Wallet content will be displayed here.'}
              {activeSection === 'tournament' && 'Your tournament history will appear here.'}
              {activeSection === 'followers' && 'Your followers will be shown here.'}
            </p>
          </div>
        )} */}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 mt-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gray-100 border rounded-full flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl p-4">
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
                <div className="px-4 py-1">
                  <div className="w-full h-px bg-gray-200"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-2xl mx-auto">
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
