import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Send } from 'lucide-react';

const CommentSection = ({ postId, comments, refresh }) => {
  const [text, setText] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await axiosInstance.post(`/posts/${postId}/comment`, { text });
      setText('');
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-3 bg-light border-top">
      <form onSubmit={handleAddComment} className="d-flex gap-2 mb-3">
        <input 
          type="text" 
          className="form-control form-control-sm rounded-pill px-3 border-0 shadow-sm" 
          placeholder="Write a comment..." 
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary btn-sm rounded-circle d-flex align-items-center p-2 border-0" type="submit">
          <Send size={14} />
        </button>
      </form>

      {/* List */}
      <div className="comment-list d-flex flex-column gap-2">
        {comments.map((c, i) => (
          <div key={i} className="d-flex gap-2 align-items-start">
            <img src={c.user?.profilePic || 'https://via.placeholder.com/30'} alt="c" className="rounded-circle mt-1" width="28" height="28" />
            <div className="bg-white p-2 rounded-3 shadow-sm border" style={{maxWidth: '85%'}}>
              <p className="mb-0 fw-bold small" style={{fontSize: '12px'}}>{c.user?.username || 'User'}</p>
              <p className="mb-0 small text-dark" style={{fontSize: '13px'}}>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;