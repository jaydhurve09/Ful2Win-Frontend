import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleWithdraw = async () => {
    if (!amount || !upiId) return alert('Please enter valid fields');

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, upiId }),
      });

      if (!response.ok) throw new Error('Withdrawal failed');
      alert('Withdrawal request submitted');
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-gradient-to-b from-[#0b3fae] via-[#1555d1] to-[#2583ff] pb-24">
      <BackgroundBubbles />
      <div className="relative z-10">
        <Header />

        {/* Back Button and Heading */}
        <div className="flex items-center gap-2 max-w-md mx-auto px-4 mt-20">
          <button
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate('/wallet'); // fallback route
              }
            }}
            className="bg-white/10 p-2 rounded-full hover:bg-white/20"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold ml-11">Withdraw Money</h1>
        </div>

        <div className="max-w-md mx-auto mt-4 text-center px-4">
          {/* Wallet Icon */}
          <div className="w-20 h-20 rounded-full bg-yellow-400 mx-auto flex items-center justify-center overflow-hidden mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3069/3069172.png"
              alt="Wallet"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold">Full2Win Wallet</h2>
          <h4 className="text-sm text-white/70">Wallet Balance: ₹124.00</h4>

          {/* Amount Input */}
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-4 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60"
          />

          {/* UPI Input */}
          <input
            type="text"
            placeholder="Enter your UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="mt-3 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60"
          />

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className={`mt-4 w-full py-3 rounded-lg font-bold transition ${
              loading
                ? 'bg-yellow-400 text-blue-900 cursor-wait'
                : 'border-2 border-white text-white hover:bg-white/20'
            }`}
          >
            {loading ? 'Processing...' : 'Withdraw Money'}
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Withdraw;
