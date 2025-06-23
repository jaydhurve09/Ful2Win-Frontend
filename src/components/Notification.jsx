import React, { useEffect, useState } from 'react';
import {
  FaGamepad,
  FaTrophy,
  FaUserFriends,
  FaTimesCircle,
} from 'react-icons/fa';

import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';

// Dummy fallback notifications
const dummyNotifications = [
  {
    id: 1,
    type: 'game',
    title: 'New Game Released!',
    message: 'Try "Mirror Clash" now available in Game Zone!',
    time: 'Just now',
  },
  {
    id: 2,
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You earned "Legend of Clash" in Battle Arena!',
    time: '10 mins ago',
  },
  {
    id: 3,
    type: 'followers',
    title: 'New Follower',
    message: 'Aryan started following you.',
    time: '30 mins ago',
  },
];

// Icon map
const iconMap = {
  game: <FaGamepad className="text-purple-300 w-5 h-5 mt-1" />,
  achievement: <FaTrophy className="text-yellow-300 w-5 h-5 mt-1" />,
  followers: <FaUserFriends className="text-blue-300 w-5 h-5 mt-1" />,
};

// Filter options
const filterOptions = ['all', 'game', 'achievement', 'followers'];

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/notifications`);
        if (!res.ok) throw new Error('Backend not responding');
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        
        setNotifications(dummyNotifications); // fallback to dummy
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const removeNotification = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
    } catch (err) {
      console.warn('Notification not deleted on backend:', err.message);
    } finally {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filter);

  return (
    <div className="relative min-h-screen bg-blueGradient text-white pb-24 overflow-hidden">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

        <div className="container mx-auto px-4 py-6 pt-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filterOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`capitalize px-4 py-1.5 text-sm rounded-full border font-medium transition-all duration-200 ${
                    filter === type
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>

            {/* Notification Cards */}
            {loading ? (
              <p className="text-center text-white/80 text-lg mt-20">
                Loading notifications...
              </p>
            ) : (
              <>
                {error && (
                  <p className="text-center text-yellow-300 text-sm mb-4">
                    {error}
                  </p>
                )}
                {filteredNotifications.length === 0 ? (
                  <p className="text-center text-white/80 text-lg mt-20">
                    No "{filter}" notifications found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredNotifications.map((note) => (
                      <div
                        key={note.id}
                        className="relative flex items-start gap-3 p-4 rounded-xl shadow-md backdrop-blur-md border border-white bg-white/10 text-white hover:scale-[1.01] transition-all group"
                      >
                        {iconMap[note.type]}
                        <div className="flex-1">
                          <h2 className="font-semibold text-base sm:text-lg">
                            {note.title}
                          </h2>
                          <p className="text-sm mt-1 leading-snug">
                            {expanded === note.id
                              ? note.message
                              : note.message.length > 100
                              ? `${note.message.slice(0, 100)}...`
                              : note.message}
                          </p>
                          {note.message.length > 100 && (
                            <button
                              onClick={() =>
                                setExpanded(
                                  expanded === note.id ? null : note.id
                                )
                              }
                              className="text-xs text-blue-200 hover:underline mt-1"
                            >
                              {expanded === note.id
                                ? 'Show less'
                                : 'Read more'}
                            </button>
                          )}
                          <p className="text-xs mt-1 text-blue-200">
                            {note.time}
                          </p>
                        </div>

                        <button
                          onClick={() => removeNotification(note.id)}
                          className="absolute top-2 right-2 text-white/70 hover:text-red-400"
                        >
                          <FaTimesCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Notification;

