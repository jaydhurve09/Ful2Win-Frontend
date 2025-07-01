import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BackgroundBubbles from '../components/BackgroundBubbles';

const AddMoney = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!amount || amount <= 0) return alert('Enter a valid amount');
    setLoading(true);

    const options = {
      key: 'YOUR_RAZORPAY_KEY',
      amount: amount * 100,
      currency: 'INR',
      name: 'Full2win Wallet',
      description: 'Add Money to Wallet',
      handler: function (response) {
        alert('Payment successful! ID: ' + response.razorpay_payment_id);
        // Send response.payment_id to backend
      },
      prefill: {
        name: 'Fun',
        email: 'user@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#002e6e',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
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
          <h1 className="text-xl font-bold ml-2">Add Money</h1>
        </div>

        {/* Wallet UI */}
        <div className="text-white p-6 rounded-lg max-w-md mx-auto mt-4 text-center bg-white/10 backdrop-blur border border-white/20 shadow-xl">
          {/* Profile Image */}
          <div className="w-20 h-20 rounded-full bg-yellow-400 mx-auto flex items-center justify-center overflow-hidden mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3069/3069172.png"
              alt="Wallet"
              className="w-16 h-16 object-contain"
            />
          </div>

          <h2 className="text-xl font-semibold">Full2win Wallet</h2>
          <h4 className="text-yellow-200 text-sm mb-2">Balance: ₹124.00</h4>

          {/* Quick Amount Buttons */}
          <div className="flex justify-center gap-3 my-3">
            {[50, 100, 200, 500].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className="bg-white/10 px-4 py-2 rounded-lg text-white hover:bg-white/20 transition"
              >
                ₹{val}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 my-2 rounded-md text-black text-base outline-none"
          />

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={!amount || amount <= 0 || loading}
            className={`bg-yellow-400 text-blue-900 font-bold py-3 px-6 mt-4 text-base rounded-md w-full hover:bg-yellow-300 transition ${
              (!amount || amount <= 0 || loading) && 'opacity-50 cursor-not-allowed'
            }`}
          >
            {loading ? 'Processing...' : 'Add Money'}
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default AddMoney;
