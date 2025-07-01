import React, { useState, useEffect } from 'react';
import { 
  FaCopy, FaWhatsapp, FaTelegramPlane, FaUserFriends, FaCheck,
  FaRupeeSign, FaShareAlt, FaLink, FaGift, FaHistory,
  FaUserCheck, FaUserClock, FaCoins, FaQuestionCircle, FaSpinner
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Navbar from './Navbar';
import BackgroundBubbles from './BackgroundBubbles';
import BackgroundCircles from './BackgroundCircles';

const ReferralPage = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState({
    referralCode: '',
    stats: {
      totalReferrals: 0,
      activeReferrals: 0,
      pendingReferrals: 0,
      earnedCoins: 0
    },
    referrals: []
  });

  const navigate = useNavigate();

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    setCopied(true);
    toast.success('Referral code copied!', { position: 'bottom-center', autoClose: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle sharing via different platforms
  const handleShare = (platform = '') => {
    const shareText = `🚀 Join me on Ful2Win! Use my code ${referralData.referralCode} to get bonus coins!`;
    const shareUrl = `${window.location.origin}/signup?ref=${referralData.referralCode}`;

    if (navigator.share && !platform) {
      navigator.share({ title: 'Join Ful2Win', text: shareText, url: shareUrl }).catch(console.error);
      return;
    }

    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'copy':
      default:
        navigator.clipboard.writeText(shareUrl);
        toast.info('Link copied!', { position: 'bottom-center', autoClose: 2000 });
        return;
    }
    if (url) window.open(url, '_blank');
  };

  // Fetch referral data
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('Auth Token:', token ? 'Token exists' : 'No token found');
        
        if (!token) {
          toast.error('Please login to view referral data', { position: 'bottom-center' });
          navigate('/login');
          return;
        }
        
        try {
          // Test the API endpoint first
          console.log('Testing API endpoint...');
          const testResponse = await axios.get('/api/referrals/test-route');
          console.log('Test route response:', testResponse.data);
          
          // Fetch referral code and referrals in parallel
          console.log('Fetching referral data...');
          const [referralCodeRes, referralsRes] = await Promise.all([
            axios.get('/api/referrals/my-code', {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              withCredentials: true
            }).catch(err => {
              console.error('Error in my-code request:', err);
              throw err;
            }),
            axios.get('/api/referrals/my-referrals', {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              withCredentials: true
            }).catch(err => {
              console.error('Error in my-referrals request:', err);
              throw err;
            })
          ]);
          
          console.log('Referral Code Response:', referralCodeRes?.data);
          console.log('Referrals Response:', referralsRes?.data);
          
          if (!referralCodeRes?.data || !referralsRes?.data) {
            throw new Error('Invalid response format from server');
          }
          
          setReferralData({
            referralCode: referralCodeRes.data.referralCode || '',
            stats: {
              totalReferrals: referralsRes.data.stats?.totalReferrals || 0,
              activeReferrals: referralsRes.data.stats?.activeReferrals || 0,
              pendingReferrals: referralsRes.data.stats?.pendingReferrals || 0,
              earnedCoins: referralsRes.data.stats?.earnedCoins || 0
            },
            referrals: Array.isArray(referralsRes.data.referrals) ? referralsRes.data.referrals : []
          });
          
          console.log('Referral data loaded successfully');
          
        } catch (err) {
          console.error('API Error Details:', {
            message: err.message,
            response: err.response ? {
              status: err.response.status,
              statusText: err.response.statusText,
              data: err.response.data
            } : 'No response',
            request: err.request ? 'Request was made but no response' : 'No request was made',
            config: {
              url: err.config?.url,
              method: err.config?.method,
              headers: err.config?.headers
            }
          });
          
          if (err.response?.status === 401) {
            toast.error('Session expired. Please login again.', { position: 'bottom-center' });
            navigate('/login');
          } else {
            throw err;
          }
        }
      } catch (err) {
        console.error('Error in fetchReferralData:', err);
        toast.error('Failed to load referral data. Please try again later.', { 
          position: 'bottom-center',
          autoClose: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-blue-900 text-white flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-blueGradient">
      <BackgroundBubbles />
      <BackgroundCircles />
      <div className="relative z-10 pb-24">
        <Header title="Refer & Earn" showBackButton={true} />
        
        <div className="p-4 max-w-2xl mx-auto mb-20">
          {/* Referral Code Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-2">Your Referral Code</h2>
            <p className="text-white/80 mb-4">Share your code and earn rewards!</p>
            
            <div className="flex items-center justify-between bg-white/20 rounded-xl p-4 mb-4">
              <code className="text-2xl font-mono font-bold">{referralData.referralCode || 'Loading...'}</code>
              <button 
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                disabled={!referralData.referralCode}
              >
                {copied ? <FaCheck /> : <FaCopy />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{referralData.stats.totalReferrals}</div>
                <div className="text-sm text-white/80">Total</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{referralData.stats.activeReferrals}</div>
                <div className="text-sm text-white/80">Active</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleShare('whatsapp')}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-xl flex-1 flex items-center justify-center gap-2 transition-colors"
              >
                <FaWhatsapp size={20} /> WhatsApp
              </button>
              <button 
                onClick={() => handleShare('telegram')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl flex-1 flex items-center justify-center gap-2 transition-colors"
              >
                <FaTelegramPlane size={20} /> Telegram
              </button>
            </div>
          </div>
          
          {/* Referral List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Referrals</h2>
              <div className="text-white/80">
                <FaUserFriends className="inline mr-1" />
                {referralData.referrals.length} total
              </div>
            </div>
            
            {referralData.referrals.length > 0 ? (
              <div className="space-y-3">
                {referralData.referrals.map((ref) => (
                  <div key={ref.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {ref.user?.fullName || `User ${ref.user?.phoneNumber?.slice(-4) || ''}`}
                      </div>
                      <div className="text-sm text-white/60">
                        Joined {new Date(ref.joinedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ref.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {ref.status === 'active' ? 'Active' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                <FaUserFriends className="mx-auto text-4xl mb-3 opacity-30" />
                <p>No referrals yet</p>
                <p className="text-sm mt-1">Share your code to earn rewards!</p>
              </div>
            )}
          </div>
          
          {/* How it works */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-3">How it works</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600/30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div>
                  <h4 className="font-medium">Share your referral code</h4>
                  <p className="text-sm text-white/80">Share with friends via WhatsApp, Telegram, or any other platform</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600/30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div>
                  <h4 className="font-medium">They sign up with your code</h4>
                  <p className="text-sm text-white/80">Your friend signs up using your referral code</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600/30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <div>
                  <h4 className="font-medium">Earn rewards</h4>
                  <p className="text-sm text-white/80">Get coins when they make their first deposit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default ReferralPage;
