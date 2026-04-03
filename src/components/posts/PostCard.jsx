import React, { useState, useContext } from 'react';
import ReactPlayer from 'react-player';
import { Heart, MessageCircle, Share2, MoreHorizontal, Clock } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { AuthCont } from '../../context/AuthCont'; // User context for like check
import CommentSection from './CommentSection';

const PostCard = ({ post, refresh }) => {
  const [showComments, setShowComments] = useState(false);
  const { user } = useContext(AuthCont);

  const PF = import.meta.env.VITE_API_URL || "http://localhost:5000/";

  // --- Date/Time Formatting Logic ---
  const formatPostDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";

    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date).replace(',', ' •');
  };

  const handleLike = async () => {
    try {
      await axiosInstance.put(`/posts/${post._id}/like`);
      refresh();
    } catch (err) {
      console.error("Like error", err);
    }
  };

  const isLiked = post.likes?.includes(user?._id);

  const getMediaUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : PF + path;
  };

  return (
    <div className="app-card mb-4 shadow-sm border-0 overflow-hidden animate-fade-in bg-white" style={{borderRadius: '12px'}}>
      
      <div className="p-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <img 
            src={post.user?.profilePic?.startsWith('http') ? post.user?.profilePic : (post.user?.profilePic ? PF + post.user?.profilePic : 'https://via.placeholder.com/40')} 
            alt="u" 
            className="rounded-circle border" 
            width="40" height="40" 
            style={{objectFit: 'cover'}}
          />
          <div>
            <h6 className="mb-0 fw-bold small">{post.user?.username || post.username}</h6>
            <div className="text-muted d-flex align-items-center gap-1" style={{fontSize: '10px'}}>
              <Clock size={10} />
              <span>{formatPostDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
        < MoreHorizontal size={20} className="text-muted cursor-pointer" />
      </div>

      <div className="px-3 pb-2">
        <p className="mb-2" style={{fontSize: '14px', lineHeight: '1.5'}}>{post.content}</p>
      </div>

      {(post.image || post.video || post.fileUrl) && (
        <div className="post-media-wrapper bg-light" style={{minHeight: '200px'}}>
          {(post.video || post.postType === 'video' || (post.fileUrl && post.fileUrl.match(/\.(mp4|webm|ogg)$|^uploads\/.*video/i))) ? (
            <div className='player-wrapper bg-black d-flex align-items-center justify-content-center'>
              <video 
                src={getMediaUrl(post.video || post.fileUrl)} 
                controls 
                style={{ width: '100%', maxHeight: '500px', display: 'block' }}
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            /* Image Check */
            <img 
              src={getMediaUrl(post.image || post.fileUrl)} 
              alt="post" 
              className="img-fluid w-100" 
              style={{maxHeight: '500px', objectFit: 'contain'}} 
            />
          )}
        </div>
      )}

      {/* Post Actions & Stats */}
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-1 text-primary small fw-bold" style={{fontSize: '12px'}}>
             <Heart size={14} fill={post.likes?.length > 0 ? "currentColor" : "none"} /> 
             {post.likes?.length || 0} Likes
          </div>
          <div className="text-muted small" style={{fontSize: '12px'}}>
            {post.comments?.length || 0} Comments
          </div>
        </div>
        
        <div className="d-flex gap-2 border-top pt-2">
          <button 
            className={`btn btn-light flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 border-0 fw-medium ${isLiked ? 'text-danger' : ''}`} 
            onClick={handleLike}
            style={{fontSize: '14px'}}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> Like
          </button>
          
          <button 
            className="btn btn-light flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 border-0 fw-medium" 
            onClick={() => setShowComments(!showComments)}
            style={{fontSize: '14px'}}
          >
            <MessageCircle size={18} /> Comment
          </button>
          
          <button 
            className="btn btn-light flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 border-0 fw-medium"
            style={{fontSize: '14px'}}
          >
            <Share2 size={18} /> Share
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="animate-fade-in border-top">
          <CommentSection postId={post._id} comments={post.comments} refresh={refresh} />
        </div>
      )}
    </div>
  );
};

export default PostCard;