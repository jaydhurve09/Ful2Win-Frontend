import React from 'react';
import { RxCrossCircled } from "react-icons/rx";
import { FaUserPlus, FaCommentDots, FaTrophy, FaHistory, FaPaperPlane, FaCrown, FaMedal } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

const HowToPlay = ({ tournament, onClose }) => {
  // Show loading state
  if (tournament?.loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
        <div className="bg-[#1A1C22] p-6 rounded-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading tournament...</p>
        </div>
      </div>
    );
  }

  // Normalize user data to handle both old and new formats
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#1A1C22] rounded-2xl border border-white/10 shadow-2xl mt-16 mb-8">
        {/* Header with close button */}
        <div className="relative">
          <button 
            className="absolute top-4 right-4 bg-black/50 rounded-full p-1.5 text-white/80 hover:text-white transition-colors"
            onClick={onClose}
          >
            <RxCrossCircled size={24} />
          </button>
          
          {/* Avatar */}
          </div>
        </div>
      </div>
    
  );
};

export default HowToPlay;
