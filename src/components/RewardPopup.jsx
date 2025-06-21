import React from 'react';
import PropTypes from 'prop-types';

/**
 * RewardPopup Component
 * -----------------------------------------------------------------------------
 * A modal-style popup that shows the reward the user won after spinning the wheel.
 * - Appears centered with backdrop blur
 * - Uses TailwindCSS for styling
 * - Styled to match SpinWheelScreen
 */
const RewardPopup = ({ reward, onClose }) => {
  if (!reward) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-xs shadow-xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-3 px-4">
          <h3 className="text-white font-bold text-lg text-center">🎉 Reward Unlocked!</h3>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-gray-700 mb-4 text-base">
            Congratulations! You have won:
          </p>
          <p className="text-2xl font-bold text-green-600 mb-6">{reward}</p>

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
