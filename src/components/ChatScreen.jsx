import React, { useState, useRef, useEffect } from 'react';
import { FiArrowLeft, FiSend, FiMessageSquare } from 'react-icons/fi';
import BackgroundBubbles from './BackgroundBubbles';
import axios from 'axios';
import { io } from 'socket.io-client';

// Use Vite env for prod, fallback to localhost for dev
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const updateUserId = () => setCurrentUserId(localStorage.getItem('userId'));
    updateUserId();
    window.addEventListener('storage', updateUserId);
    return () => window.removeEventListener('storage', updateUserId);
  }, [selectedFriend]);

  useEffect(() => {
    if (!currentUserId) return;
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    });
    socket.emit('join', currentUserId);
    socket.on('newMessage', (msg) => {
      const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
      const recipientId = typeof msg.recipient === 'object' ? msg.recipient._id : msg.recipient;

      if (
        (String(senderId) === String(currentUserId) && String(recipientId) === String(selectedFriend._id)) ||
        (String(senderId) === String(selectedFriend._id) && String(recipientId) === String(currentUserId))
      ) {
        setMessages(prev => {
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    });
    return () => socket.disconnect();
  }, [currentUserId, selectedFriend]);

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
        console.error('Chat fetch error:', err.response?.data || err.message);
      });
  }, [selectedFriend]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedFriend?._id) return;
    setSending(true);
    try {
      const res = await axios.post('/api/messages', {
        recipient: selectedFriend._id,
        content: message.trim(),
      });
      setMessages(prev => [...prev, res.data]);
      setMessage('');
    } catch (err) {
      console.error('Send message error:', err.response?.data || err.message);
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
          {/* Header */}
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
              <p className={`text-sm ${selectedFriend.online ? 'text-green-300' : 'text-gray-300'}`}>
                {selectedFriend.online !== undefined ? (selectedFriend.online ? 'Online' : 'Offline') : 'Online'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="absolute left-0 right-0 overflow-y-auto px-4 py-2" style={{ top: '60px', bottom: '72px' }}>
            <div className="chat-messages">
              {loading ? (
                <div className="loading">Loading...</div>
              ) : messages.length === 0 ? (
                <div className="no-messages">No messages yet.</div>
              ) : (
                messages
                  .filter(msg => {
                    const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                    const recipientId = typeof msg.recipient === 'object' ? msg.recipient._id : msg.recipient;
                    return (
                      String(senderId) === String(currentUserId) ||
                      String(recipientId) === String(currentUserId)
                    );
                  })
                  .map((msg) => {
                    const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                    const isSent = String(senderId) === String(currentUserId);
                    return (
                      <div key={msg._id} className="my-2 flex" style={{ justifyContent: isSent ? 'flex-end' : 'flex-start' }}>
                        <div
                          style={{
                            background: isSent ? '#25d366' : '#2a2f32',
                            color: isSent ? '#fff' : '#e9edef',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            maxWidth: '70%',
                            minWidth: '40px',
                            fontSize: '1rem',
                            wordBreak: 'break-word',
                            boxShadow: isSent ? '0 1px 2px rgba(0,0,0,0.07)' : '0 1px 2px rgba(0,0,0,0.04)',
                            position: 'relative',
                            textAlign: 'left',
                          }}
                        >
                          <span>{msg.content}</span>
                          <span
                            style={{
                              fontSize: '0.75em',
                              color: isSent ? '#e9edef' : '#b3b7bb',
                              position: 'absolute',
                              right: 8,
                              bottom: 4,
                              opacity: 0.7,
                            }}
                          >
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Footer */}
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
        <div className="flex flex-col w-full h-full overflow-y-auto px-4 pt-4 pb-20">
          <div className="mt-4 space-y-4 w-full max-w-3xl mx-auto">
            {/* Friend list can go here if needed */}
            <p className="text-center text-white/70">No friend selected.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
