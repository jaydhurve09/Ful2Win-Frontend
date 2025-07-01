import React, { useState } from 'react';
import {
  FaArrowLeft,
  FaClipboard,
  FaWhatsapp,
  FaTelegramPlane,
  FaGift,
  FaUserFriends,
  FaCheckCircle,
  FaRupeeSign,
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import BackgroundBubbles from '../components/BackgroundBubbles';
import BackgroundCircles from '../components/BackgroundCircles';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const referralCode = 'FUL2WIN123';
const earningsHistory = [
  { id: 1, name: 'User #4213', status: 'Signed Up', amount: 50 },
  { id: 2, name: 'User #7821', status: 'Not Yet Joined', amount: 0 },
  { id: 3, name: 'User #1098', status: 'Signed Up', amount: 50 },
];

const ReferralPage = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = (platform) => {
    const text = `Join Ful2Win and earn rewards! Use my code: ${referralCode}`;
    let url = '';
    if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    } else if (platform === 'telegram') {
      url = `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
    }
    window.open(url, '_blank');
  };

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
              &#8249;
            </button>
            <h1 className="text-3xl font-bold text-center">Refer & Earn</h1>
          </div>

          <p className="text-sm text-white/80 text-center -mt-3">
            Invite friends and earn up to ₹50 per signup!
          </p>

          {/* Referral Code Card */}
          <div className="bg-white mt-6 rounded-xl shadow-md p-4 flex flex-col items-center">
            <div className="flex items-center mb-2">
              <span className="text-lg font-bold tracking-widest text-blue-700 bg-blue-100 rounded px-4 py-1">
                {referralCode}
              </span>
              <button className="ml-2 p-2 bg-blue-50 rounded-full" onClick={handleCopy}>
                <FaClipboard className="text-blue-600" />
              </button>
              <button className="ml-2 p-2 bg-green-50 rounded-full" onClick={() => handleShare('whatsapp')}>
                <FaWhatsapp className="text-green-500" />
              </button>
              <button className="ml-2 p-2 bg-blue-50 rounded-full" onClick={() => handleShare('telegram')}>
                <FaTelegramPlane className="text-blue-400" />
              </button>
            </div>
            {copied && <span className="text-green-600 text-sm font-medium">Copied!</span>}
          </div>

          {/* Steps */}
          <div className="mt-8 flex items-center justify-between max-w-xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-full shadow-md">
                <FaUserFriends className="text-blue-600 w-6 h-6" />
              </div>
              <span className="text-sm mt-1">Invite</span>
            </div>
            <FaCheckCircle className="text-green-400 w-5 h-5 animate-bounce" />
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-full shadow-md">
                <FaClipboard className="text-blue-400 w-6 h-6" />
              </div>
              <span className="text-sm mt-1">Signup</span>
            </div>
            <FaCheckCircle className="text-green-400 w-5 h-5 animate-bounce animation-delay-1000" />
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-full shadow-md">
                <FaRupeeSign className="text-yellow-500 w-6 h-6" />
              </div>
              <span className="text-sm mt-1">Earn</span>
            </div>
          </div>

          {/* Earnings */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Referral Earnings</h2>
            <div className="space-y-3">
              {earningsHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white text-black rounded-lg p-3 flex justify-between items-center shadow-md"
                >
                  <div>
                    <div className="font-bold text-blue-700 text-sm">{entry.name}</div>
                    <div
                      className={`text-xs font-medium mt-1 ${
                        entry.status === 'Signed Up' ? 'text-green-500' : 'text-gray-500'
                      }`}
                    >
                      {entry.status}
                    </div>
                  </div>
                  <div>
                    {entry.amount > 0 ? (
                      <span className="text-green-600 font-bold flex items-center text-sm">
                        +₹{entry.amount} <FaGift className="ml-1 text-pink-400" />
                      </span>
                    ) : (
                      <span className="text-gray-400 font-bold text-sm">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <button className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-95 transition">
              Invite Now
            </button>
            <p className="text-sm mt-2 text-white/80">
              Each friend you invite gets you closer to bigger rewards!
            </p>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default ReferralPage;
