import React, { useState, useEffect } from 'react';
import {
  FaArrowLeft,
  FaClipboard,
  FaWhatsapp,
  FaTelegramPlane,
  FaGift,
  FaUserFriends,
  FaCheckCircle,
  FaRupeeSign,
  FaSpinner,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaCoins,
  FaSearch
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackgroundBubbles from '../components/BackgroundBubbles';
import BackgroundCircles from '../components/BackgroundCircles';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const ReferralPage = () => {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('referral');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
    totalEarnings: 0
  });
  const navigate = useNavigate();

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaUserCheck className="mr-1" /> Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaUserClock className="mr-1" /> Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaCoins className="mr-1" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FaUserTimes className="mr-1" /> Inactive
          </span>
        );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const headers = { Authorization: `Bearer ${token}` };
        
        try {
          // First get the referral code
          const referralResponse = await axios.get('/api/referrals/my-code', { headers });
          if (referralResponse.data.success) {
            setReferralCode(referralResponse.data.referralCode);
          }
          
          // Then get the referrals and stats in one request
          const referralsResponse = await axios.get('/api/referrals/my-referrals', { headers });
          
          if (referralsResponse.data.success) {
            // Set the referrals list
            setReferrals(referralsResponse.data.referrals || []);
            
            // Set the stats from the same response
            setStats({
              total: referralsResponse.data.totalReferrals || 0,
              active: referralsResponse.data.activeReferrals || 0,
              pending: referralsResponse.data.pendingReferrals || 0,
              completed: referralsResponse.data.completedReferrals || 0,
              totalEarnings: referralsResponse.data.totalEarnings || 0
            });
          }
        } catch (error) {
          console.error('Error fetching referral data:', error);
          toast.error('Failed to load referral data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferralData();
  }, [navigate]);

  const handleCopy = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied to clipboard!');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = (platform) => {
    if (!referralCode) return;
    
    const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`;
    const text = `Join Ful2Win and earn rewards! Use my code: ${referralCode} - ${shareUrl}`;
    
    let url = '';
    if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    } else if (platform === 'telegram') {
      url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    }
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || referral.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative min-h-screen bg-blueGradient text-white pb-24 overflow-hidden">
      <BackgroundBubbles />
      <BackgroundCircles />
      <div className="relative z-10">
        <Header />

        <div className="container mx-auto px-4 pt-20">
          {/* Top Bar with Back Button and Title */}
          <div className="flex items-center justify-center gap-3 mb-6 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 text-white text-3xl px-2"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold">Refer & Earn</h1>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-gray-500 text-sm font-medium mb-1">Total Referrals</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-gray-500 text-sm font-medium mb-1">Active</div>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-gray-500 text-sm font-medium mb-1">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-gray-500 text-sm font-medium mb-1">Total Earnings</div>
              <div className="text-2xl font-bold text-blue-600 flex items-center">
                <FaRupeeSign className="mr-1" size={18} />
                {stats.totalEarnings.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'referral' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('referral')}
              >
                Your Referral Code
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'tracking' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('tracking')}
              >
                Referral Tracking
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'referral' ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Referral Code</h2>
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <code className="text-2xl font-mono font-bold text-blue-600">
                        {referralCode || 'Loading...'}
                      </code>
                      <p className="text-sm text-gray-600 mt-1">Share this code with your friends</p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={!referralCode}
                    >
                      <FaClipboard />
                      <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Share via</h3>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FaWhatsapp className="text-xl" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleShare('telegram')}
                        className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaTelegramPlane className="text-xl" />
                        <span>Telegram</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">How it works</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <FaUserFriends className="text-blue-600" />
                      </div>
                      <h4 className="font-medium">Share your code</h4>
                      <p className="text-sm text-gray-600">Share your referral code with friends</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                        <FaGift className="text-yellow-600" />
                      </div>
                      <h4 className="font-medium">They sign up</h4>
                      <p className="text-sm text-gray-600">Your friends sign up using your code</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <FaRupeeSign className="text-green-600" />
                      </div>
                      <h4 className="font-medium">Earn rewards</h4>
                      <p className="text-sm text-gray-600">Get ₹200 when they make their first deposit</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Referral Tracking</h2>
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSearch className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search referrals..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <select
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '0.75em auto',
                          paddingRight: '2.5rem',
                        }}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
                  </div>
                ) : filteredReferrals.length === 0 ? (
                  <div className="text-center py-12">
                    <FaUserFriends className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No referrals found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filter'
                        : 'Share your referral code to invite friends!'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined On
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reward
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredReferrals.map((referral) => (
                          <tr key={referral._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <FaUserFriends className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {referral.user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {referral.user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(referral.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(referral.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {referral.rewardAmount > 0 ? (
                                <span className="text-green-600 flex items-center">
                                  <FaRupeeSign className="mr-1" size={12} />
                                  {referral.rewardAmount.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default ReferralPage;
