import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiArrowLeft, FiSend, FiClock } from 'react-icons/fi';
import BackgroundBubbles from './BackgroundBubbles';
import { io } from 'socket.io-client';
import api from '../services/api';
import chatService from '../services/chatService';

const ChatScreen = ({ selectedFriend, setSelectedFriend }) => {
  const [socketError, setSocketError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function getUserIdFromStorage() {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          if (user && user._id) userId = user._id;
        } catch (e) {}
      }
      return userId ? String(userId) : null;
    }
    setCurrentUserId(getUserIdFromStorage());
    function handleStorage() {
      setCurrentUserId(getUserIdFromStorage());
    }
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!currentUserId) return;
    
    const SOCKET_URL = new URL(api.defaults.baseURL).origin;
    console.log('Connecting to socket at:', SOCKET_URL);

    // Create socket connection if it doesn't exist
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Set up socket event listeners
      const socket = socketRef.current;

      const handleConnect = () => {
        console.log('Socket connected');
        setSocketError(false);
        // Join user's personal room
        socket.emit('join_user_room', currentUserId);
        console.log('Joined user room:', currentUserId);
      };

      const handleConnectError = (err) => {
        console.error('Socket connection error:', err);
        setSocketError(true);
        setError('Connection error. Reconnecting...');
      };

      const handleDisconnect = (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Reconnect if server disconnects
          socket.connect();
        }
      };

      const handleNewMessage = (msg) => {
        console.log('Received new message via socket:', msg);
        
        // Normalize message format
        const normalizedMsg = {
          ...msg,
          sender: msg.sender?._id || msg.sender || null,
          recipient: msg.recipient?._id || msg.recipient || null,
          createdAt: msg.createdAt || new Date().toISOString(),
          localId: msg._id ? `server-${msg._id}` : `local-${Date.now()}`,
          status: 'received'
        };
        
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(m => 
            (m._id && m._id === normalizedMsg._id) || 
            (m.localId === normalizedMsg.localId)
          );
          
          if (!exists) {
            const updated = [...prev, normalizedMsg]
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            console.log('Updated messages after new message:', updated);
            return updated;
          }
          return prev;
        });
        
        // Mark as read if it's a new message from the current conversation
        if (selectedFriend?._id && 
            String(normalizedMsg.sender) === String(selectedFriend._id) &&
            !normalizedMsg.readAt) {
          chatService.markAsRead([normalizedMsg._id]).catch(console.error);
        }
      };

      const handleTypingStatus = (data) => {
        if (data.from === selectedFriend?._id) {
          setIsTyping(true);
          // Clear any existing timeout
          if (typingTimeout) clearTimeout(typingTimeout);
          // Set timeout to hide typing indicator after 3 seconds
          const timeout = setTimeout(() => setIsTyping(false), 3000);
          setTypingTimeout(timeout);
        }
      };

      // Set up event listeners
      socket.on('connect', handleConnect);
      socket.on('connect_error', handleConnectError);
      socket.on('disconnect', handleDisconnect);
      socket.on('new_message', handleNewMessage);
      socket.on('typing', handleTypingStatus);
      socket.on('stop_typing', () => setIsTyping(false));
      
      // Log all socket events for debugging in development
      if (process.env.NODE_ENV === 'development') {
        const originalEmit = socket.emit;
        socket.emit = function() {
          console.log('Emitting event:', arguments[0], arguments[1]);
          return originalEmit.apply(socket, arguments);
        };
      }
    }

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection');
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
        socketRef.current.off('disconnect');
        socketRef.current.off('new_message');
        socketRef.current.off('typing');
        socketRef.current.off('stop_typing');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentUserId, selectedFriend?._id, typingTimeout]);

  // Load messages when selected friend changes
  const loadMessages = useCallback(async () => {
    if (!selectedFriend?._id || !currentUserId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const messages = await chatService.getConversation(
        currentUserId,
        selectedFriend._id
      );
      
      const processedMessages = messages.map(msg => ({
        ...msg,
        sender: msg.sender?._id || msg.sender || null,
        recipient: msg.recipient?._id || msg.recipient || null,
        createdAt: msg.createdAt || new Date().toISOString(),
        // Add a local ID for optimistic updates
        localId: msg._id ? `server-${msg._id}` : `local-${Date.now()}`
      }));
      
      // Sort by creation time
      processedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      setMessages(processedMessages);
      
      // Mark messages as read
      const unreadMessages = processedMessages
        .filter(msg => 
          !msg.read && 
          String(msg.sender) === String(selectedFriend._id)
        );
        
      if (unreadMessages.length > 0) {
        await chatService.markAsRead(
          unreadMessages.map(msg => msg._id).filter(Boolean)
        );
      }
      
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages. Please try again.');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFriend?._id, currentUserId]);
  
  // Initial load of messages
  useEffect(() => {
    loadMessages();
    
    // Set up socket room for this conversation
    if (socketRef.current?.connected && selectedFriend?._id) {
      socketRef.current.emit('join_conversation', {
        userId: currentUserId,
        friendId: selectedFriend._id
      });
    }
    
    // Clean up on unmount or when friend changes
    return () => {
      if (socketRef.current?.connected && selectedFriend?._id) {
        socketRef.current.emit('leave_conversation', {
          userId: currentUserId,
          friendId: selectedFriend._id
        });
      }
    };
  }, [loadMessages, selectedFriend?._id, currentUserId]);

  useEffect(() => {
    if (!selectedFriend || !selectedFriend._id || !currentUserId) return;
    setLoading(true);
    api.get(`/api/messages/conversation?user1=${currentUserId}&user2=${selectedFriend._id}`)
      .then(res => {
        const sorted = (res.data || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setMessages(sorted);
        setLoading(false);
        console.log('Fetched messages:', sorted);
      })
      .catch(() => {
        api.get(`/api/messages/${selectedFriend._id}`)
          .then(res2 => {
            const sorted2 = (res2.data || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setMessages(sorted2);
            setLoading(false);
          })
          .catch(() => {
            setMessages([]);
            setLoading(false);
          });
      });
    return () => setMessages([]);
  }, [selectedFriend, currentUserId]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!selectedFriend?._id || !currentUserId) return;
    
    // Clear any existing timeout
    if (typingTimeout) clearTimeout(typingTimeout);
    
    // Notify typing if we haven't already
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', {
        to: selectedFriend._id,
        from: currentUserId
      });
    }
    
    // Set a timeout to stop typing indicator
    const timeout = setTimeout(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('stop_typing', {
          to: selectedFriend._id,
          from: currentUserId
        });
      }
      setIsTyping(false);
    }, 2000); // 2 seconds of inactivity
    
    setTypingTimeout(timeout);
  }, [selectedFriend?._id, currentUserId, typingTimeout]);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);
  
  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !selectedFriend?._id || !currentUserId || sending) return;
    
    setSending(true);
    setError(null);
    
    // Create optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      localId: tempId,
      sender: currentUserId,
      recipient: selectedFriend._id,
      content: trimmedMessage,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      status: 'sending'
    };
    
    // Add to messages immediately for instant feedback
    setMessages(prev => [...prev, optimisticMessage]);
    setMessage('');
    
    try {
      // Send message to server
      const sentMessage = await chatService.sendMessage(
        selectedFriend._id,
        trimmedMessage
      );
      
      // Replace optimistic message with server response
      setMessages(prev => 
        prev.map(msg => 
          msg.localId === tempId 
            ? { 
                ...sentMessage, 
                localId: `server-${sentMessage._id}`,
                status: 'sent',
                isOptimistic: false
              } 
            : msg
        )
      );
      
      // Notify recipient via socket
      if (socketRef.current?.connected) {
        socketRef.current.emit('send_message', {
          ...sentMessage,
          recipient: selectedFriend._id
        });
      }
      
      // Auto-scroll to show the new message
      scrollToBottom();
      
    } catch (err) {
      console.error('Send message error:', err);
      // Update message status to failed
      setMessages(prev => 
        prev.map(msg => 
          msg.localId === tempId 
            ? { 
                ...msg, 
                status: 'failed',
                error: err.response?.data?.message || 'Failed to send message'
              } 
            : msg
        )
      );
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    // Only show typing indicator if there's text and we have a recipient
    if (newValue.trim() && selectedFriend?._id) {
      handleTyping();
    }
  };
  
  const handleRetrySend = async (localId) => {
    if (!localId) return;
    
    // Find the failed message
    const failedMsg = messages.find(msg => msg.localId === localId);
    if (!failedMsg) return;
    
    // Remove the failed message
    setMessages(prev => prev.filter(msg => msg.localId !== localId));
    
    // Set the message content and send it again
    setMessage(failedMsg.content);
    
    // Small delay to ensure state updates
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  console.log('ChatScreen render', {
    messages,
    currentUserId,
    selectedFriend,
  });

  return (
    <div className="relative w-full bg-blueGradient h-screen overflow-hidden text-white">
      <BackgroundBubbles />
      {selectedFriend ? (
        <div className="w-full h-full relative">
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
          <div className="absolute left-0 right-0 overflow-y-auto px-4 py-2" style={{ top: '60px', bottom: '72px', background: 'rgba(0,0,0,0.2)', zIndex: 10, minHeight: 200 }}>
            <div className="chat-messages min-h-[200px]" style={{ background: '#fff', color: '#000' }}>
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>No messages yet</p>
                  <p className="text-sm">Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const senderId = msg.sender?._id || msg.sender || '';
                  const isSent = String(senderId) === String(currentUserId);
                  const isOptimistic = msg.isOptimistic || msg.status === 'sending';
                  const isFailed = msg.status === 'failed';
                  
                  // Format timestamp
                  let formattedTime = 'Sending...';
                  try {
                    if (msg.createdAt) {
                      formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                    }
                  } catch (e) {
                    console.error('Error formatting time:', e);
                  }
                  
                  return (
                    <div 
                      key={msg.localId || msg._id || `msg-${Date.now()}`}
                      className={`my-2 flex ${isSent ? 'justify-end' : 'justify-start'} px-2`}
                    >
                      <div
                        className={`relative max-w-[70%] px-4 py-2 rounded-lg ${
                          isSent 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        } ${isOptimistic ? 'opacity-70' : ''} ${isFailed ? 'border border-red-400' : ''}`}
                        style={{
                          wordBreak: 'break-word',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          minWidth: '80px',
                        }}
                      >
                        <div className="text-sm">
                          {msg.content || '[No content]'}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          {isFailed && (
                            <button
                              onClick={() => handleRetrySend(msg.localId)}
                              className="text-xs text-red-400 hover:text-red-300"
                              title="Retry sending"
                            >
                              Tap to retry
                            </button>
                          )}
                          <span 
                            className={`text-xs ml-auto ${isSent ? 'text-blue-100' : 'text-gray-500'}`}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            {formattedTime}
                            {isOptimistic && !isFailed && (
                              <span className="ml-1">• Sending...</span>
                            )}
                            {isFailed && (
                              <span className="ml-1">• Failed</span>
                            )}
                          </span>
                        </div>
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
                ref={inputRef}
                type="text"
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-full text-black focus:outline-none"
                disabled={sending}
                aria-label="Type your message"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim() || sending}
                className={`ml-2 p-2 rounded-full transition-colors ${
                  message.trim() && !sending
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                {sending ? (
                  <FiClock size={20} className="animate-pulse" />
                ) : (
                  <FiSend size={20} />
                )}
              </button>
            </div>
            {isTyping && (
              <div className="absolute bottom-16 left-4 bg-white text-gray-700 text-xs px-2 py-1 rounded-full shadow-md">
                {selectedFriend?.name || 'User'} is typing...
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full overflow-y-auto px-4 pt-4 pb-20" style={{ background: '#fff', color: '#000' }}>
          <div className="mt-4 space-y-4 w-full max-w-3xl mx-auto">
            <p className="text-center text-black/70">No friend selected.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
