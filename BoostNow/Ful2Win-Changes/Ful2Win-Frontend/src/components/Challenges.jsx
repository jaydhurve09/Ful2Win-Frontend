import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';
import { useNavigate } from 'react-router-dom';

const Challenges = () => {
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [friendName, setFriendName] = useState('');
  const [gameInput, setGameInput] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [incomingInvites, setIncomingInvites] = useState([]);

  const navigate = useNavigate();

  const allFriends = [
    'Kevin Marshall',
    'Ritika Sharma',
    'Aayush Patel',
    'Rohan Mehta',
    'Kiran Jain',
    'Anjali Rao',
    'Akshay Kulkarni',
  ];

  const allGames = ['Ludo', 'Rummy', 'Carrom', 'Chess', 'Snake & Ladder', 'Poker', 'UNO'];
  const mostPlayed = ['Ludo', 'Rummy', 'Chess'];

  const filteredFriends = friendName.length > 0
    ? allFriends.filter(
        (name) =>
          name.toLowerCase().includes(friendName.toLowerCase()) &&
          name.toLowerCase() !== friendName.toLowerCase()
      )
    : [];

  const filteredGames = gameInput.length > 0
    ? allGames.filter((game) =>
        game.toLowerCase().includes(gameInput.toLowerCase())
      )
    : allGames;

  useEffect(() => {
    // Mocking incoming invites and ongoing challenges
    setIncomingInvites([
      { id: 100, name: 'Ritika Sharma', game: 'Rummy', status: 'Pending' },
    ]);

    setChallenges([
      { id: 1, name: 'Kevin Marshall', game: 'Ludo', status: 'Pending' },
      { id: 2, name: 'Aayush Patel', game: 'Chess', status: 'Accepted' },
    ]);
  }, []);

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!friendName || !gameInput) return alert('Fill both fields');

    const newChallenge = {
      id: Date.now(),
      name: friendName,
      game: gameInput,
      status: 'Pending',
    };

    setChallenges((prev) => [...prev, newChallenge]);
    setFriendName('');
    setGameInput('');
  };

  const handleCancelChallenge = (id) => {
    setChallenges((prev) => prev.filter((ch) => ch.id !== id));
  };

  const handleAcceptInvite = (id) => {
    setIncomingInvites((prev) => prev.filter((invite) => invite.id !== id));
    setChallenges((prev) => [
      ...prev,
      { ...incomingInvites.find((inv) => inv.id === id), status: 'Accepted' },
    ]);
  };

  const handleRejectInvite = (id) => {
    setIncomingInvites((prev) => prev.filter((invite) => invite.id !== id));
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-white bg-blueGradient">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

        {/* Back Button styled like Support Page */}
        <div className="pt-16 px-4 max-w-2xl mx-auto flex items-center mb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:text-blue-500 text-lg font-semibold flex items-center"
          >
            <span className="text-2xl mr-1">&lt;</span>
          </button>
        </div>

        <div className="px-4 max-w-2xl mx-auto space-y-6">
          {/* Challenge Form */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-black">
              <div
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="flex justify-between cursor-pointer"
              >
                <h2 className="text-lg font-bold text-blue-800">Challenge a Friend</h2>
                <span>{isFormOpen ? '▲' : '▼'}</span>
              </div>

              <form
                onSubmit={handleInviteSubmit}
                className={`mt-4 transition-all duration-300 ease-in-out ${
                  isFormOpen
                    ? 'max-h-[1000px] opacity-100 scale-100'
                    : 'max-h-0 opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter friend's name"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  {filteredFriends.length > 0 && (
                    <ul className="absolute w-full bg-white border rounded mt-1 z-10 text-sm">
                      {filteredFriends.map((name, index) => (
                        <li
                          key={index}
                          onClick={() => setFriendName(name)}
                          className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Enter game name"
                  value={gameInput}
                  onChange={(e) => setGameInput(e.target.value)}
                  className="w-full p-2 border rounded mt-3"
                />

                <div className="mt-2">
                  <p className="text-sm text-gray-600">Most Played</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {mostPlayed.map((game) => (
                      <button
                        key={game}
                        type="button"
                        onClick={() => setGameInput(game)}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
                      >
                        {game}
                      </button>
                    ))}
                  </div>
                </div>

                {gameInput && (
                  <ul className="bg-white border w-full mt-1 rounded shadow text-sm max-h-40 overflow-y-auto">
                    {filteredGames.map((game, index) => (
                      <li
                        key={index}
                        onClick={() => setGameInput(game)}
                        className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {game}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700"
                >
                  Send Invite
                </button>
              </form>
            </div>
          </div>

          {/* Incoming Invites */}
          {incomingInvites.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="text-black">
                <h2 className="text-lg font-semibold mb-3 text-red-700">Incoming Invites</h2>
                {incomingInvites.map((invite) => (
                  <div key={invite.id} className="flex justify-between items-center mb-3">
                    <div>
                      <p className="font-semibold">{invite.name}</p>
                      <p className="text-sm text-gray-600">{invite.game}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptInvite(invite.id)}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectInvite(invite.id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ongoing Challenges */}
          {challenges.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="text-black">
                <h2 className="text-lg font-semibold mb-3 text-blue-700">Ongoing Challenges</h2>
                {challenges.map((ch) => (
                  <div key={ch.id} className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ch.name)}`}
                        alt={ch.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{ch.name}</p>
                        <p className="text-sm text-gray-600">{ch.game}</p>
                      </div>
                    </div>
                    {ch.status === 'Pending' ? (
                      <button
                        onClick={() => handleCancelChallenge(ch.id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                        {ch.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Challenges;
