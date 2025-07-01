import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCopy, FaWhatsapp, FaTelegramPlane, FaFacebook, FaTwitter, FaEnvelope, FaCoins, FaCheck, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

import Navbar from './Navbar';
import BackgroundBubbles from './BackgroundBubbles';
import BackgroundCircles from './BackgroundCircles';

const ReferralPage = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState({
    referralCode: '',
    stats: { totalReferrals: 0, activeReferrals: 0, earnedCoins: 0 }
  });

  // Fetch referral data from backend
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setLoading(true);
        
        // Fetch referral code and stats in parallel
        const [codeResponse, statsResponse] = await Promise.all([
          api.get('/referrals/my-code'),
          api.get('/referrals/my-referrals')
        ]);

        setReferralData({
          referralCode: codeResponse.data.referralCode || 'BOOST' + Math.floor(1000 + Math.random() * 9000),
          stats: {
            totalReferrals: statsResponse.data.totalReferrals || 0,
            activeReferrals: statsResponse.data.activeReferrals || 0,
            earnedCoins: statsResponse.data.earnedCoins || 0
          }
        });
      } catch (error) {
        console.error('Error fetching referral data:', error);
        toast.error('Failed to load referral data. Using demo data.');
        // Fallback to demo data
        setReferralData({
          referralCode: 'BOOST' + Math.floor(1000 + Math.random() * 9000),
          stats: { totalReferrals: 12, activeReferrals: 8, earnedCoins: 500 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const shareUrl = `${window.location.origin}/signup?ref=${referralData.referralCode}`;
  const shareMessage = `Join me on Ful2Win! Use my referral code ${referralData.referralCode} to get bonus coins when you sign up!`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    let url = '';
    
    switch(platform) {
      case 'whatsapp': 
        url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`; 
        break;
      case 'telegram': 
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`; 
        break;
      case 'facebook': 
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`; 
        break;
      case 'twitter': 
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`; 
        break;
      case 'email': 
        url = `mailto:?subject=Join%20me%20on%20Ful2Win&body=${encodeURIComponent(shareMessage + '\n\n' + shareUrl)}`; 
        break;
      default: 
        return;
    }
    
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff] text-white flex items-center justify-center">
        <BackgroundBubbles />
        <BackgroundCircles />
        <div className="relative z-10 text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-blue-200">Loading your referral data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-white overflow-x-hidden relative px-4 py-8"
      style={{
        background: "linear-gradient(to bottom, #0A2472 0%, #0D47A1 45%, #1565C0 100%)",
        paddingBottom: '100px' // Add padding to account for fixed navbar
      }}>
      <BackgroundBubbles />
      <div className="relative z-10 py-4 max-w-2xl mx-auto px-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors mr-3"
          >
            <FaArrowLeft className="text-white text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-white">Refer & Earn</h1>
        </div>
        
        <div className="p-4 max-w-2xl mx-auto mb-20">
          {/* Share & Earn Section */}
          <div className="bg-gradient-to-br from-[#0A2472] to-[#1565C0] rounded-2xl p-6 mb-6 border border-blue-400/30 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-300">Share & Earn</h2>
            
            {/* Referral Code */}
            <div className="bg-[#0A2472]/70 rounded-xl p-6 mb-6 border border-blue-400/30 shadow-inner">
              <div className="text-sm font-medium text-blue-300 mb-2 text-center">Your Referral Code</div>
              <div className="flex items-center justify-between bg-[#0A2472]/90 p-3 rounded-lg border border-blue-400/30 shadow-md">
                <div className="text-xl font-mono text-blue-100">{referralData.referralCode}</div>
                <button
                  onClick={() => handleCopy(referralData.referralCode)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md shadow-blue-500/20"
                >
                  {copied ? (
                    <span className="flex items-center">
                      <FaCheck className="mr-1" /> Copied!
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaCopy className="mr-1" /> Copy Code
                    </span>
                  )}
                </button>
              </div>
              
              <div className="mt-4 text-sm text-blue-200 text-center">
                Share this code with friends and earn coins when they join!
              </div>
              
              {/* Share Buttons */}
              <div className="flex justify-center gap-4 mt-5">
                {[
                  { platform: 'whatsapp', icon: <FaWhatsapp size={22} />, color: 'bg-green-500 hover:bg-green-600' },
                  { platform: 'telegram', icon: <FaTelegramPlane size={22} />, color: 'bg-blue-500 hover:bg-blue-600' },
                  { platform: 'facebook', icon: <FaFacebook size={22} />, color: 'bg-blue-700 hover:bg-blue-800' },
                  { platform: 'twitter', icon: <FaTwitter size={22} />, color: 'bg-sky-500 hover:bg-sky-600' },
                  { platform: 'email', icon: <FaEnvelope size={22} />, color: 'bg-gray-600 hover:bg-gray-700' }
                ].map(({ platform, icon, color }) => (
                  <button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    className={`${color} p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg`}
                    title={`Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#000B18]/60 p-4 rounded-xl text-center border border-blue-400/10 shadow-md hover:shadow-blue-500/10 transition-all duration-300">
                <div className="text-2xl font-bold text-blue-400">{referralData.stats.totalReferrals}</div>
                <div className="text-xs text-blue-200 mt-1">Total</div>
              </div>
              <div className="bg-[#000B18]/60 p-4 rounded-xl text-center border border-green-400/10 shadow-md hover:shadow-green-500/10 transition-all duration-300">
                <div className="text-2xl font-bold text-green-400">{referralData.stats.activeReferrals}</div>
                <div className="text-xs text-green-200 mt-1">Active</div>
              </div>
              <div className="bg-[#000B18]/60 p-4 rounded-xl text-center border border-yellow-400/10 shadow-md hover:shadow-yellow-500/10 transition-all duration-300">
                <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center">
                  <FaCoins className="mr-1.5" /> {referralData.stats.earnedCoins}
                </div>
                <div className="text-xs text-yellow-200 mt-1">Coins</div>
              </div>
            </div>
            
            {/* Referral Link */}
            <div className="mt-6">
              <div className="text-sm font-medium text-blue-300 mb-2">Your Referral Link</div>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-4 py-2.5 bg-[#000B18]/80 text-white rounded-l-lg text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  onClick={() => handleCopy(shareUrl)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-r-lg text-sm font-medium transition-all duration-300 flex items-center"
                >
                  {copied ? (
                    <>
                      <FaCheck className="mr-1.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <FaCopy className="mr-1.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-br from-[#0A2472]/80 to-[#1565C0]/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-300">How It Works</h2>
            <div className="space-y-4">
              {[
                { num: 1, title: "Share Your Code", desc: "Share your unique referral code with friends" },
                { num: 2, title: "They Sign Up", desc: "Friends sign up using your code" },
                { num: 3, title: "Earn Rewards", desc: "Get coins when they complete their first deposit" }
              ].map((step) => (
                <div key={step.num} className="flex items-start group">
                  <div className="bg-blue-500/20 text-blue-300 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 transition-all duration-300 group-hover:bg-blue-500/30">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-100">{step.title}</h3>
                    <p className="text-sm text-blue-200/80">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default ReferralPage;