import React, { useState } from 'react';
import './TransactionPage.css';

const AddMoneyPage = () => {
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    if (!amount || amount <= 0) return alert('Enter a valid amount');

    const options = {
      key: 'YOUR_RAZORPAY_KEY', // Replace with your key
      amount: amount * 100, 
      currency: 'INR',
      name: 'Full2win Wallet',
      description: 'Add Money to Wallet',
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        
      },
      prefill: {
        name: 'fun',
        email: 'user@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#002e6e',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="transaction-container">
      <img src="/avatar.png" className="avatar-lg" alt="Avatar" />
      <h2>Ful2Win_Demo</h2>
      <h4>Wallet Balance: ₹124.00</h4>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handlePayment}>Add Money</button>
    </div>
  );
};

export default AddMoneyPage;
