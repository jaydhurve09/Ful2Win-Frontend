import React from 'react';
import './WalletCard.css';
import { Coins } from 'lucide-react';

const WalletCard = ({ onAction }) => {
  return (
    <div className="wallet-card">
      <div className="wallet-card-bg">
        <img src="/avatar.png" alt="Avatar" className="avatar" />
        <div className='balance-coin'>
          <h4>Wallet Balance</h4>
          <h2>₹ 24.2</h2>
          <hr />
          <p>Coins</p>
          <h3 className="coins">80 <Coins size={18} /></h3>
          <hr />
        </div>

        {/* ✅ Call the parent handler instead of navigation */}
        <button className="add-btn" onClick={() => onAction('add')}>ADD ₹</button>
        <button className="withdraw-btn" onClick={() => onAction('withdraw')}>WITHDRAW ₹</button>

        <p className="kyc-info">
          After KYC<br />
          Coins not Withdrawable
        </p>
      </div>
    </div>
  );
};

export default WalletCard;
