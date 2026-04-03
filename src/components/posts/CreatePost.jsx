import React, { useState, useContext } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { AuthCont } from '../../context/AuthCont';
import { Image, Video, Send, X } from 'lucide-react';
import Button from '../common/Button';

const CreatePost = ({ refresh }) => {
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthCont);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await axiosInstance.post('/posts', { content, fileUrl });
      setContent('');
      setFileUrl('');
      refresh(); // Feed refresh karne ke liye
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-card p-3 mb-4 shadow-sm border-0">
      <div className="d-flex gap-2">
        <img src={user?.profilePic} alt="avatar" className="rounded-circle" width="45" height="45" style={{objectFit: 'cover'}} />
        <textarea 
          className="form-control border-0 bg-light" 
          placeholder={`What's on your mind, ${user?.username}?`}
          rows="2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ borderRadius: '12px', resize: 'none', fontSize: '15px' }}
        />
      </div>
      
      {fileUrl && (
        <div className="position-relative mt-2 rounded-3 overflow-hidden bg-light p-2 border">
          <small className="text-truncate d-block pe-4">{fileUrl}</small>
          <X size={16} className="position-absolute top-50 end-0 translate-middle-y me-2 cursor-pointer text-danger" onClick={() => setFileUrl('')} />
        </div>
      )}

      <hr className="my-3 opacity-25" />
      
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <Button className="btn btn-sm btn-light border-0 d-flex align-items-center gap-1 text-success fw-medium" onClick={() => setFileUrl(prompt("Paste Image URL:"))}>
            <Image size={18} /> <span className="d-none d-sm-inline">Photo</span>
          </Button>
          <Button className="btn btn-sm btn-light border-0 d-flex align-items-center gap-1 text-danger fw-medium" onClick={() => setFileUrl(prompt("Paste Video URL:"))}>
            <Video size={18} /> <span className="d-none d-sm-inline">Video</span>
          </Button>
        </div>
        <Button onClick={handlePost} loading={loading} variant="primary" className="rounded-pill px-4 btn-sm" disabled={!content.trim()}>
          Share <Send size={14} className="ms-2" />
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;