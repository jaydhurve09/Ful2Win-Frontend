import React, { useState } from 'react';
import './TransactionPage.css';

const WithdrawPage = () => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');

  const handleWithdraw = () => {
    if (!amount || !upiId) return alert('Please enter all fields');
    alert(`₹${amount} will be sent to ${upiId} after verification.`);
    
  };

  return (
    <div className="transaction-container">
      <img src="/avatar.png" className="avatar-lg" alt="Avatar" />
      <h2>Full2win_Demo</h2>
      <h4>Wallet Balance: ₹124.00</h4>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter your UPI ID"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
      />

      <button onClick={handleWithdraw}>Withdraw Money</button>
    </div>
  );
};

export default WithdrawPage;