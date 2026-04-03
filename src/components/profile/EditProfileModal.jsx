

import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Save, Upload } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    bio: ''
  });
  const [selectedFile, setSelectedFile] = useState(null); // Nayi file ke liye state
  const [previewUrl, setPreviewUrl] = useState(''); // Local preview dikhane ke liye
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null); // Hidden input ko trigger karne ke liye
  const PF = import.meta.env.VITE_API_URL || "http://localhost:5000/";

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || ''
      });
      // Purani image ka full path set karna
      const currentPic = user.profilePic?.startsWith('http') 
        ? user.profilePic 
        : (user.profilePic ? (PF.endsWith('/') ? PF : PF + '/') + user.profilePic : 'https://via.placeholder.com/150');
      setPreviewUrl(currentPic);
    }
  }, [user, PF]);

  // File select hone par handle karna
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Browser mein turant dikhane ke liye
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      // System storage upload ke liye FormData zaroori hai
      const data = new FormData();
      data.append('username', formData.username);
      data.append('bio', formData.bio);
      if (selectedFile) {
        data.append('profilePic', selectedFile); // Backend 'multer' isse hi 'profilePic' naam se pakdega
      }

      await onSave(data); // Profile.jsx wala handleSaveProfile function call hoga
      onClose();
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Something went wrong while saving!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', 
      alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)'
    }}>
      <div className="modal-content-custom animate-zoom-in bg-white p-4 shadow" 
           style={{ borderRadius: '15px', width: '90%', maxWidth: '450px' }}>
        
        <div className="modal-header-custom d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold">Edit Profile</h5>
          <button className="btn p-0 border-0" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Avatar Preview Section */}
          <div className="text-center mb-4">
            <div className="position-relative d-inline-block cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <img 
                src={previewUrl} 
                className="rounded-circle border border-4 border-light shadow-sm" 
                width="120" height="120" 
                style={{objectFit: 'cover'}}
                alt="Preview"
              />
              <div className="avatar-edit-icon" style={{
                position: 'absolute', bottom: '8px', right: '8px', 
                backgroundColor: '#1877f2', borderRadius: '50%', padding: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                <Camera size={16} color="white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              hidden 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <p className="text-primary small mt-2 mb-0 cursor-pointer fw-bold" onClick={() => fileInputRef.current.click()}>
               Change Profile Photo
            </p>
          </div>

          <Input 
            label="Username" 
            value={formData.username} 
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
            required 
          />
          
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Bio</label>
            <textarea 
              className="form-control bg-light border-0" 
              rows="3" 
              placeholder="Tell us about yourself..."
              style={{borderRadius: '10px'}}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            ></textarea>
          </div>

          <div className="d-flex gap-2 mt-4">
            <Button type="button" variant="light" fullWidth onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            
            <Button type="submit" loading={loading} fullWidth variant="primary">
              <Save size={18} className="me-2" /> Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;