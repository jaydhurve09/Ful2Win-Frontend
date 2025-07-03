import React, { useState, useRef, useEffect } from 'react';
import { FiArrowLeft, FiSend, FiMessageSquare } from 'react-icons/fi';
import BackgroundBubbles from './BackgroundBubbles';
import axios from 'axios';
// Use Vite env for prod, fallback to localhost for dev
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true; // If backend uses cookies/JWT

// Attach JWT token from localStorage to all axios requests (if present)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Update key if your token is stored under a different name
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

const ChatScreen = ({ selectedFriend, setSelectedFriend }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages when selectedFriend changes
  useEffect(() => {
    if (!selectedFriend || !selectedFriend._id) return;
    setLoading(true);
    axios.get(`/api/messages/${selectedFriend._id}`)
      .then(res => {
        setMessages(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setMessages([]);
        setLoading(false);
        // Enhanced error logging for debugging
        if (err.response) {
          console.error('Chat fetch error:', err.response.status, err.response.data);
        } else {
          console.error('Chat fetch error:', err.message);
        }
      });
  }, [selectedFriend]);

  // Scroll to bottom on messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedFriend || !selectedFriend._id) return;
    setSending(true);
    try {
      const res = await axios.post('/api/messages', {
        recipient: selectedFriend._id,
        content: message.trim(),
      });
      setMessages(prev => [...prev, res.data]);
      setMessage('');
    } catch (err) {
      // Enhanced error logging for debugging
      if (err.response) {
        console.error('Send message error:', err.response.status, err.response.data);
      } else {
        console.error('Send message error:', err.message);
      }
    }
    setSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };


  return (
    <div className="relative w-full bg-blueGradient h-screen overflow-hidden text-white">
      <BackgroundBubbles />

      {selectedFriend ? (
        <div className="w-full h-full">

          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 h-[60px] bg-blueGradient bg-opacity-100 backdrop-blur-md z-20 flex items-center px-4">
            <button onClick={() => setSelectedFriend(null)} className="mr-4 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30">
              <FiArrowLeft size={20} />
            </button>
            <img
              src={
                selectedFriend.profilePicture ||
                selectedFriend.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedFriend.name || selectedFriend.username || 'U')}&background=0b3fae&color=fff`
              }
              alt={selectedFriend.name || selectedFriend.username || 'User'}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold">{selectedFriend.name || selectedFriend.username || 'User'}</h3>
              {/* Optionally show online status if available, or always show 'Online' */}
              {typeof selectedFriend.online !== 'undefined' ? (
                <p className={`text-sm ${selectedFriend.online ? 'text-green-300' : 'text-gray-300'}`}>
                  {selectedFriend.online ? 'Online' : 'Offline'}
                </p>
              ) : (
                <p className="text-sm text-green-300">Online</p>
              )}
            </div>
          </div>

          {/* Scrollable Messages */}
          <div
            className="absolute left-0 right-0 overflow-y-auto px-4 py-2"
            style={{ top: '60px', bottom: '72px' }}
          >
            {loading ? (
              <div className="text-center text-gray-300 mt-8">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">No messages yet. Say hi!</div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender === undefined || msg.sender === null
                  ? false
                  : (msg.sender._id || msg.sender) === (window?.currentUser?._id || localStorage.getItem('userId'));
                return (
                  <div key={msg._id || msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${isMe ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Footer */}
          <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-blueGradient bg-opacity-70 backdrop-blur-md z-20 px-4 flex items-center">
            <div className="flex items-center bg-white rounded-full p-2 shadow-md w-full max-w-3xl mx-auto">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-full text-black focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="ml-2 p-2 bg-blueGradient rounded-full hover:bg-blueGradient transition text-white"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Friend list screen
        <div className="flex flex-col w-full h-full overflow-y-auto px-4 pt-4 pb-20">
          <div className="mt-4 space-y-4 w-full max-w-3xl mx-auto">
            {friendsList.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between bg-white bg-opacity-10 rounded-xl p-3 pr-4 hover:bg-opacity-20 transition"
              >
                <div className="flex items-center">
                  <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full mr-3" />
                  <div>
                    <h3 className="font-semibold">{friend.name}</h3>
                    <p className={`text-sm ${friend.online ? 'text-green-300' : 'text-gray-300'}`}>
                      {friend.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleFriendClick(friend)}
                  className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition text-white"
                  title="Chat with friend"
                >
                  <FiMessageSquare size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
