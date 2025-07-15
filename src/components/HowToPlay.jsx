import React from 'react';
import { RxCrossCircled } from "react-icons/rx";
import { FaUserPlus, FaCommentDots, FaTrophy, FaHistory, FaPaperPlane, FaCrown, FaMedal } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

const HowToPlay = ({ rules, onClose }) => {

  // Show loading state

  // Normalize user data to handle both old and new formats
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center mt-10 p-6 bg-transparent backdrop-blur-xl overflow-y-auto">
        
      <div className="relative w-full  max-w-md  rounded-2xl border p-2 border-white/10 shadow-2xl mt-16 mb-8">

        {/* Header with close button */}
        <div className="relative">
          <button 
            className="absolute top-4 right-4 bg-black/50 rounded-full p-1.5 text-white/80 hover:text-white transition-colors"
            onClick={() => onClose(false)}
          >
            <RxCrossCircled size={24} />
          </button>
          <div>
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
            <p className='text-lg font-semibold text-'>How to Play</p>
            </div>
            <div className="p-4">
              <h1 className='text-lg font-semibold mb-2 text-white' >Objective</h1>
            <p className='text-gray-200 ml-5 mt-1 mb-1'>{rules.objective}</p>
            <hr className='border-red-500' />
            </div>
            <div>
                <h1 className='text-lg font-semibold mb-2 text-white'>Rules</h1>
                <div className='ml-5 text-gray-300 text-md'>
                  {rules?.howToPlay?.map((rule, index) => (
                    <div key={index} className='text-gray-200'>
                      <p ><span>{index + 1}. </span>{rule}</p>
                      <hr className='border-gray-500' />
                    </div>
                  ))}
                </div>
            </div>
           </div>
          
          </div>
        </div>
      </div>
    
  );
};

export default HowToPlay;
