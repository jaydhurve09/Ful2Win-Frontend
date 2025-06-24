import React, { useState, useRef, useEffect } from 'react';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import BackgroundBubbles from './BackgroundBubbles';

const friendsList = [
  { id: 1, name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', online: true },
  { id: 2, name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', online: true },
  { id: 3, name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', online: false },
  { id: 4, name: 'Emma Davis', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', online: false },
  { id: 5, name: 'David Smith', avatar: 'https://randomuser.me/api/portraits/men/21.jpg', online: true },
  { id: 6, name: 'Olivia Brown', avatar: 'https://randomuser.me/api/portraits/women/45.jpg', online: true },
  { id: 7, name: 'Chris Evans', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', online: false },
  { id: 8, name: 'Sophia Wilson', avatar: 'https://randomuser.me/api/portraits/women/30.jpg', online: false },
  { id: 9, name: 'Daniel Garcia', avatar: 'https://randomuser.me/api/portraits/men/43.jpg', online: true },
  { id: 10, name: 'Emily Martinez', avatar: 'https://randomuser.me/api/portraits/women/55.jpg', online: true },
];

const ChatScreen = ({ selectedFriend, setSelectedFriend }) => {
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
    if (!messages[friend.id]) {
      setMessages((prev) => ({ ...prev, [friend.id]: [] }));
    }
  };

  const sendMessage = () => {
    if (message.trim() === '' || !selectedFriend) return;
    setMessages((prev) => ({
      ...prev,
      [selectedFriend.id]: [...(prev[selectedFriend.id] || []), { id: Date.now(), text: message, sender: 'me' }],
    }));
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedFriend]);

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      <BackgroundBubbles />

      {selectedFriend ? (
        <div className="w-full h-full">

          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 h-[60px] bg-blue-800 bg-opacity-70 backdrop-blur-md z-20 flex items-center px-4">
            <button onClick={() => setSelectedFriend(null)} className="mr-4 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30">
              <FiArrowLeft size={20} />
            </button>
            <img src={selectedFriend.avatar} alt={selectedFriend.name} className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h3 className="font-semibold">{selectedFriend.name}</h3>
              <p className={`text-sm ${selectedFriend.online ? 'text-green-300' : 'text-gray-300'}`}>
                {selectedFriend.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          {/* Scrollable Messages */}
          <div
            className="absolute left-0 right-0 overflow-y-auto px-4 py-2"
            style={{ top: '60px', bottom: '72px' }}
          >
            {(messages[selectedFriend.id] || []).map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Footer */}
          <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-blue-800 bg-opacity-70 backdrop-blur-md z-20 px-4 flex items-center">
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
                className="ml-2 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition text-white"
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
                onClick={() => handleFriendClick(friend)}
                className="flex items-center bg-white bg-opacity-10 rounded-xl p-3 cursor-pointer hover:bg-opacity-20 transition"
              >
                <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full mr-3" />
                <div>
                  <h3 className="font-semibold">{friend.name}</h3>
                  <p className={`text-sm ${friend.online ? 'text-green-300' : 'text-gray-300'}`}>
                    {friend.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
