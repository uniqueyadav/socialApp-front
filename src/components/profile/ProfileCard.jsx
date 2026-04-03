import React from 'react';
import { Mail, Calendar, MapPin, Link as LinkIcon, Edit3 } from 'lucide-react';

const ProfileCard = ({ user, onEditClick }) => {
  return (
    <div className="profile-card-container animate-fade-in">
      {/* Banner/Cover Area */}
      <div className="profile-banner"></div>
      
      <div className="profile-content-wrapper">
        <div className="profile-header-main">
          <div className="profile-avatar-wrapper">
            <img 
              src={user?.profilePic || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="profile-main-img"
            />
          </div>
          <button className="edit-profile-btn" onClick={onEditClick}>
            <Edit3 size={16} className="me-2" /> Edit Profile
          </button>
        </div>

        <div className="profile-info-section">
          <h2 className="profile-name">{user?.username}</h2>
          <p className="profile-bio text-muted">Full Stack Developer | Tech Enthusiast</p>
          
          <div className="profile-meta-grid">
            <div className="meta-item">
              <Mail size={16} /> <span>{user?.email}</span>
            </div>
            <div className="meta-item">
              <MapPin size={16} /> <span>India</span>
            </div>
            <div className="meta-item">
              <Calendar size={16} /> <span>Joined {new Date().getFullYear()}</span>
            </div>
            <div className="meta-item">
              <LinkIcon size={16} /> <a href="#" className="text-primary text-decoration-none">portfolio.dev</a>
            </div>
          </div>
        </div>

        <div className="profile-stats-row">
          <div className="stat-box">
            <span className="stat-count">124</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-box">
            <span className="stat-count">1.2k</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-box">
            <span className="stat-count">450</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;