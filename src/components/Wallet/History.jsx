import React from 'react';
import './History.css';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();

  return (
    <button className="history-btn" onClick={() => navigate('/history')}>
      History
    </button>
  );
};

export default History;
