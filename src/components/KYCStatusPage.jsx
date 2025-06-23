import React, { useState } from 'react';
import Navbar from './Navbar';
import BackgroundBubbles from './BackgroundBubbles';
import BackgroundCircles from './BackgroundCircles';

const STATUS = {
  NOT_SUBMITTED: {
    icon: '🕵',
    text: 'Not Submitted',
    desc: 'Start your KYC to unlock rewards!',
    cardClass: 'status-not-submitted',
  },
  PENDING: {
    icon: '⏳',
    text: 'Pending Verification',
    desc: 'KYC under review. Please wait up to 24 hours.',
    cardClass: 'status-pending',
  },
  VERIFIED: {
    icon: '✅',
    text: 'Verified',
    desc: "You're verified! Withdrawals are now unlocked.",
    cardClass: 'status-verified',
  },
  REJECTED: {
    icon: '❌',
    text: 'Rejected',
    desc: 'There was an issue with your KYC.',
    cardClass: 'status-rejected',
  },
};

const mockUser = {
  name: 'Amit S.',
  pan: 'ABCDE**1F',
  submitted: '2024-06-01',
  verified: '2024-06-02',
  rejectionReason: 'Document blurred',
};

const Popup = ({ title, message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white rounded-xl p-6 relative w-[90%] max-w-md" onClick={(e) => e.stopPropagation()}>
      <button className="absolute top-2 right-3 text-gray-600 text-xl font-bold" onClick={onClose}>×</button>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-700">{message}</p>
    </div>
  </div>
);

const KYCStatusPage = () => {
  const [status, setStatus] = useState('NOT_SUBMITTED');
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', message: '' });

  const handleSubmit = () => setStatus('PENDING');
  const handleResubmit = () => setStatus('PENDING');
  const handleBack = () => {
    if (status !== 'NOT_SUBMITTED') {
      setStatus('NOT_SUBMITTED');
    } else {
      window.history.back();
    }
  };

  const handleStepClick = (title, message) => {
    setPopupContent({ title, message });
    setShowPopup(true);
  };

  const statusObj = STATUS[status];

  return (
    <div className="min-h-screen w-full text-white overflow-hidden relative" style={{
      background: 'linear-gradient(to bottom, #0A2472 0%, #0D47A1 45%, #1565C0 100%)'
    }}>
      <BackgroundCircles />
      <BackgroundBubbles />

      <div className="relative z-10 px-4 pt-16 pb-24">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleBack} className="text-white text-2xl font-bold">←</button>
          <h1 className="text-xl font-semibold text-center w-full -ml-6">KYC Status</h1>
        </div>

        <div className={`rounded-xl p-6 text-center bg-white text-gray-800 shadow-lg mb-6 ${statusObj.cardClass}`}>
          <div className="text-4xl mb-2">{statusObj.icon}</div>
          <div className="text-lg font-semibold">{statusObj.text}</div>
          <div className="text-sm text-gray-600 mt-1">{statusObj.desc}</div>
        </div>

        {status === 'NOT_SUBMITTED' && (
          <div className="text-center space-y-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg" onClick={handleSubmit}>
              Submit KYC
            </button>
            <ul className="space-y-3 text-left">
              <li>
                <button onClick={() => handleStepClick('Upload ID', 'Upload a clear image of your ID.')}
                  className="w-full bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
                  Upload ID
                </button>
              </li>
              <li>
                <button onClick={() => handleStepClick('Take Selfie', 'Take a clear selfie in good light.')}
                  className="w-full bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
                  Take Selfie
                </button>
              </li>
              <li>
                <button onClick={() => handleStepClick('Enter PAN', 'Enter your PAN details accurately.')}
                  className="w-full bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
                  Enter PAN
                </button>
              </li>
            </ul>
          </div>
        )}

        {status === 'PENDING' && (
          <div className="text-center mt-6">
            <div className="animate-spin border-4 border-blue-200 border-t-blue-600 rounded-full w-12 h-12 mx-auto mb-3"></div>
            <p>KYC under review. Please wait up to 24 hours.</p>
          </div>
        )}

        {status === 'VERIFIED' && (
          <div className="text-center mt-6 text-green-600">
            <div className="text-3xl">✅</div>
            <p className="font-semibold mt-2">You're Verified! Withdrawals are unlocked.</p>
          </div>
        )}

        {status === 'REJECTED' && (
          <div className="text-center mt-6 text-red-600">
            <div className="text-3xl">❌</div>
            <p className="font-semibold mt-2">KYC Rejected: {mockUser.rejectionReason}</p>
            <button onClick={handleResubmit} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg">
              Resubmit KYC
            </button>
          </div>
        )}

        {(status === 'VERIFIED' || status === 'REJECTED' || status === 'PENDING') && (
          <div className="mt-6 bg-white text-gray-800 rounded-lg p-4 shadow-sm">
            <div><b>Name:</b> {mockUser.name}</div>
            <div><b>PAN:</b> {mockUser.pan}</div>
            <div><b>Submitted:</b> {mockUser.submitted}</div>
            {status === 'VERIFIED' && <div><b>Verified:</b> {mockUser.verified}</div>}
          </div>
        )}
      </div>

      <footer className="text-center text-sm text-white/90 py-4 z-10 relative">
        Need help? <span className="underline">Contact Support</span>
      </footer>

      {showPopup && (
        <Popup title={popupContent.title} message={popupContent.message} onClose={() => setShowPopup(false)} />
      )}

      <div className="fixed bottom-0 left-0 right-0 z-20">
        <Navbar />
      </div>
    </div>
  );
};

export default KYCStatusPage;
