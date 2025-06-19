import React from "react";
import "./CommunityFeed.css";
import Video from '../assets/video.png'; // Assuming you have a video file in the Assets folder
import { CiSearch ,CiHeart,CiCamera} from "react-icons/ci"; // Importing the search icon from react-icons
import { FaRegComment } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import  Profile  from "../Components/Profile"; // Assuming you have a Profile component
const posts = [
  {
    id: 1,
    user: "alexjhonson",
    time: "2h",
    likes: 1034,
    comments: 87,
    shares: 23,
    videoThumbnail: Video
  },
  
  {
    id: 2,
    user: "alexjhonson",
    time: "2h",
    likes: 1034,
    comments: 87,
    shares: 23,
    videoThumbnail: Video
  },
  {
    id: 3,
    user: "alexjhonson",
    time: "2h",
    likes: 1034,
    comments: 87,
    shares: 23,
    videoThumbnail: Video
  },
];

const CommunityFeed = () => {
  const[profile, setProfile] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const handleUserClick = (userData) => {
    setProfile(true);
    setSelectedUser(userData);
    
  };
  return (
    <div className="community-container">
      <div className="search-bar">
        
        <input type="text" placeholder="Search Users and Hashtags" />
        <button className="search-btn"><CiSearch/></button>
      </div>

      <div className="post-input">
        <input type="text" placeholder="What's on your mind?" />
        <button className="camera-btn"><CiCamera /></button>
      </div>
     {profile && selectedUser && (
  <div className="profile">
    <Profile setProfile={setProfile} user={selectedUser} />
  </div>
)}

      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          <div className="post-header">
            <div className="user-avatar" />
            <span className="username"   onClick={() => handleUserClick(post)} >{post.user}</span>
            <span className="time">{post.time}</span>
          </div>

          <div className="video-thumbnail">
            <img src={post.videoThumbnail} alt="thumbnail" />
            
          </div>

          <div className="post-footer">
            <span className="l" ><CiHeart className="icon"/> {post.likes}</span>
            <span><FaRegComment className="icon" />{post.comments}</span>
            <span><IoShareSocialSharp className="icon" /> {post.shares}</span>
            <button className="challenge-btn">Send Challenge</button>
          </div>
        </div>
      ))}

    </div>
  );
};
export default CommunityFeed;
