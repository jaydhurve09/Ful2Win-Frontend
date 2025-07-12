import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Challenges = () => {
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [friendName, setFriendName] = useState('');
  const [gameInput, setGameInput] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [incomingInvites, setIncomingInvites] = useState([]);
  const navigate = useNavigate();

  const allFriends = ['Kevin Marshall', 'Ritika Sharma', 'Aayush Patel', 'Rohan Mehta', 'Kiran Jain', 'Anjali Rao', 'Akshay Kulkarni'];
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
        <div className="pt-20 px-4 max-w-md mx-auto flex items-center mb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-100 text-4xl sm:text-[2.5rem] font-bold leading-none relative -top-1"
          >
            &#8249;
          </button>
          <h1 className="px-4 text-2xl sm:text-3xl font-bold text-center text-blue-100">
            Challenges
          </h1>
        </div>

        <div className="px-4 max-w-md mx-auto space-y-6 overflow-y-auto pb-20">
          {/* Challenge Form */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 shadow-[0_0_16px_rgba(255,255,255,0.1)] border border-white/20 text-white text-sm transition-transform hover:scale-[1.01] duration-300 ease-in-out">
            <div>
              <div
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="flex justify-between items-center cursor-pointer mb-1"
              >
                <h2 className="text-xl sm:text-xl font-bold text-blue-300 leading-tight relative drop-shadow-[1px_1px_0_rgba(0,0,0,0.3)]">
                  <span className="inline-block transform translate-y-[1px] drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                    Challenge a Friend
                  </span>
                </h2>
                <span className="text-blue-400 text-base">{isFormOpen ? '▲' : '▼'}</span>
              </div>

              <form
                onSubmit={handleInviteSubmit}
                className={`overflow-hidden transition-all duration-300 ${isFormOpen ? 'max-h-[1000px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95 pointer-events-none'}`}
              >
                <div className="relative mt-2">
                  <input
                    type="text"
                    placeholder="Friend's name"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/15 border border-blue-300 text-white placeholder:text-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                  />
                  {filteredFriends.length > 0 && (
                    <ul className="absolute w-full bg-white/10 text-white border border-blue-300 backdrop-blur-md rounded mt-1 z-10 text-xs shadow-lg max-h-32 overflow-y-auto">
                      {filteredFriends.map((name, index) => (
                        <li
                          key={index}
                          onClick={() => setFriendName(name)}
                          className="px-3 py-1 hover:bg-blue-500/30 cursor-pointer"
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Game name"
                  value={gameInput}
                  onChange={(e) => setGameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white/15 border border-blue-300 text-white placeholder:text-white/60 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                />

                <div className="mt-2">
                  <p className="text-xs text-white/60 font-medium">Most Played</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mostPlayed.map((game) => (
                      <button
                        key={game}
                        type="button"
                        onClick={() => setGameInput(game)}
                        className="bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full text-[10px] hover:bg-blue-500/40 transition"
                      >
                        {game}
                      </button>
                    ))}
                  </div>
                </div>

                {gameInput && filteredGames.length > 0 && (
                  <ul className="bg-white/10 border border-blue-300 text-white backdrop-blur-md w-full mt-2 rounded text-xs max-h-32 overflow-y-auto shadow">
                    {filteredGames.map((game, index) => (
                      <li
                        key={index}
                        onClick={() => setGameInput(game)}
                        className="px-3 py-1 hover:bg-blue-500/30 cursor-pointer"
                      >
                        {game}
                      </li>
                    ))}
                  </ul>
                )}

                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 mt-2 rounded-lg text-xs font-semibold transition shadow-md">
                  Invite Friend
                </button>
              </form>
            </div>
          </div>

          {/* Incoming Invites */}
          {incomingInvites.length > 0 && (
            <div className="bg-white/15 backdrop-blur-md rounded-2xl shadow-[0_0_12px_rgba(255,255,255,0.1)] border border-white/20 p-4 transition">
              <h2 className="text-lg font-bold mb-4 text-red-300 tracking-wide">Incoming Invites</h2>
              {incomingInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between gap-3 mb-4 bg-white/10 p-3 rounded-xl hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] transition">
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(invite.name)}`} className="w-10 h-10 rounded-full border border-white/20 shadow-sm" alt={invite.name} />
                    <div>
                      <p className="font-semibold text-sm text-white">{invite.name}</p>
                      <p className="text-xs text-white/60">{invite.game}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAcceptInvite(invite.id)} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-500/30 transition">Accept</button>
                    <button onClick={() => handleRejectInvite(invite.id)} className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-500/30 transition">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ongoing Challenges */}
          {challenges.length > 0 && (
            <div className="bg-white/15 backdrop-blur-md rounded-2xl shadow-[0_0_12px_rgba(255,255,255,0.1)] border border-white/20 p-4 mb-6 transition">
              <h2 className="text-lg font-bold mb-4 text-white/90 tracking-wide">Ongoing Challenges</h2>
              {challenges.map((ch) => (
                <div key={ch.id} className="flex justify-between items-center mb-4 bg-white/10 p-3 rounded-xl hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] transition">
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ch.name)}`} alt={ch.name} className="w-10 h-10 rounded-full border border-white/20 shadow-sm" />
                    <div>
                      <p className="font-semibold text-sm text-white">{ch.name}</p>
                      <p className="text-xs text-white/60">{ch.game}</p>
                    </div>
                  </div>
                  {ch.status === 'Pending' ? (
                    <button onClick={() => handleCancelChallenge(ch.id)} className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-500/30 transition">Cancel</button>
                  ) : (
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                      {ch.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Challenges;