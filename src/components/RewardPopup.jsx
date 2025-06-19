import React from 'react';
import PropTypes from 'prop-types';

const RewardPopup = ({ reward, onClose }) => {
  if (!reward) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-xs overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-blue-600 py-3 px-4">
          <h3 className="text-white font-bold text-lg text-center">Reward Won!</h3>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-700 mb-6">
            Congratulations! You Have Won <span className="font-bold">{reward}</span>
          </p>
          
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            autoFocus
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

RewardPopup.propTypes = {
  reward: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default RewardPopup;
