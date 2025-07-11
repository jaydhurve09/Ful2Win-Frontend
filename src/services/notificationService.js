import api from './api';

/**
 * Send a custom notification to specific users
 * @param {string[]} userIds - Array of user IDs to notify
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} [type='custom'] - Notification type
 * @param {object} [data={}] - Additional data for the notification
 * @returns {Promise<object>} Response from the server
 */
export const sendCustomNotification = async (userIds, title, message, type = 'custom', data = {}) => {
  try {
    const response = await api.post('/notifications/send-custom', {
      userIds,
      title,
      message,
      type,
      data
    });
    return response.data;
  } catch (error) {
    console.error('Error sending custom notification:', error);
    throw error;
  }
};

/**
 * Broadcast a notification to all users
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} [type='announcement'] - Notification type
 * @param {object} [data={}] - Additional data for the notification
 * @returns {Promise<object>} Response from the server
 */
export const broadcastNotification = async (title, message, type = 'announcement', data = {}) => {
  try {
    const response = await api.post('/notifications/broadcast', {
      title,
      message,
      type,
      data
    });
    return response.data;
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    throw error;
  }
};

/**
 * Create a notification component for the admin panel
 * @returns {JSX.Element} A component with forms to send custom notifications
 */
export const NotificationSender = () => {
  const [recipientType, setRecipientType] = useState('specific');
  const [userIds, setUserIds] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('announcement');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    setResult(null);

    try {
      let response;
      
      if (recipientType === 'specific') {
        const ids = userIds.split(',').map(id => id.trim()).filter(Boolean);
        if (ids.length === 0) {
          throw new Error('Please enter at least one user ID');
        }
        response = await sendCustomNotification(ids, title, message, type);
      } else {
        response = await broadcastNotification(title, message, type);
      }
      
      setResult({
        success: true,
        message: response.message || 'Notification sent successfully',
        count: response.count
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send notification');
      console.error('Notification error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Send Custom Notification</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Recipient Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                checked={recipientType === 'specific'}
                onChange={() => setRecipientType('specific')}
              />
              <span className="ml-2 text-gray-300">Specific Users</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                checked={recipientType === 'all'}
                onChange={() => setRecipientType('all')}
              />
              <span className="ml-2 text-gray-300">All Users</span>
            </label>
          </div>
        </div>

        {recipientType === 'specific' && (
          <div>
            <label className="block text-gray-300 mb-2">User IDs (comma-separated)</label>
            <input
              type="text"
              value={userIds}
              onChange={(e) => setUserIds(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 60d21b4667d0d8992e610c85, 60d21b4667d0d8992e610c86"
            />
          </div>
        )}

        <div>
          <label className="block text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Notification title"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="Notification message"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="announcement">Announcement</option>
            <option value="alert">Alert</option>
            <option value="update">Update</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSending}
            className={`px-6 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSending
                ? 'bg-blue-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSending ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-600 text-white rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-600 text-white rounded">
          {result.message}
          {result.count !== undefined && ` (${result.count} users notified)`}
        </div>
      )}
    </div>
  );
};

export default {
  sendCustomNotification,
  broadcastNotification,
  NotificationSender
};
