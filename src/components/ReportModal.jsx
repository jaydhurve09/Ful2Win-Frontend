import React, { useState } from 'react';
import { toast } from 'react-toastify';
import postService from '../services/postService';

const ReportModal = ({ isOpen, onClose, postId, reportedUserId }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }

    try {
      setIsSubmitting(true);
      await postService.reportPost(postId, { reason, reportedUserId });
      toast.success('Report submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Report Post</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="reportReason" className="block text-sm font-medium mb-2">
              Reason for reporting
            </label>
            <textarea
              id="reportReason"
              name="reportReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Please provide details about your report..."
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
