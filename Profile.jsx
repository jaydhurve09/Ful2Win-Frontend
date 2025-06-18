import React from 'react';
import './Profile.css';
import { RxCrossCircled } from "react-icons/rx";
import {
  FaUserPlus,
  FaCommentDots,
  FaTrophy,
  FaHistory,
  FaPaperPlane
} from 'react-icons/fa';

const Profile = ({ user, setProfile }) => {
  console.log(user)
  return (
    <div className="profile-card">
      <button className="close-btn" onClick={() => setProfile(false)}><RxCrossCircled /></button>
      <div className="avatar-section">
        <div className="avatar" />
        <h2>
          Full Name <span className="username">{user.user}</span>
        </h2>
      </div>

      <div className="action-buttons">
        <div className="action"><FaUserPlus /><span>Add Friend</span></div>
        <div className="action"><FaCommentDots /><span>Chat</span></div>
        <div className="action"><FaTrophy /><span>Challenge</span></div>
        <div className="action"><FaHistory /><span>History</span></div>
        <div className="action"><FaPaperPlane /><span>Share</span></div>
      </div>

      <div className="stats">
        <div className="stat"><strong>32</strong><span>Wins</span></div>
        <div className="stat"><strong>76%</strong><span>Win Rate</span></div>
        <div className="stat"><strong>543</strong><span>Games</span></div>
        <div className="stat"><strong>85</strong><span>Friends</span></div>
      </div>

      <div className="mutual-section">
        <h4>Mutual Friends (5)</h4>
        <div className="mutual-friends">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="mutual-avatar" />
          ))}
        </div>
      </div>

      <div className="achievements">
        <div className="achievements-title">
          <FaTrophy className="trophy-icon" />
          <span>Achievements</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
