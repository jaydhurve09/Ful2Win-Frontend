import React from 'react';
import './ActionButtons.css';
import { RotateCcw, Play, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="action-buttons">
      <div className="action-box" onClick={() => navigate('/spin')}>
        <RotateCcw className="action-icon" />
        <span>Spin</span>
      </div>
      <div className="action-box" onClick={() => navigate('/ads')}>
        <Play className="action-icon" />
        <span>Ads</span>
      </div>
      <div className="action-box" onClick={() => navigate('/challenges')}>
        <Zap className="action-icon" />
        <span>Challenges</span>
      </div>
    </div>
  );
};

export default ActionButtons;
