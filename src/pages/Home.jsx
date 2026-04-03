
import React, { useState, useEffect, useContext, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AuthCont } from '../context/AuthCont';
import PostCard from '../components/posts/PostCard'; 
import { Image, Video, Send, X, FileText } from 'lucide-react';
import Load from '../components/common/Load';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // System file ke liye
  const [filePreview, setFilePreview] = useState(null); // Preview ke liye
  
  const fileInputRef = useRef(null);
  const { user, updateLocalUser } = useContext(AuthCont);

  const fetchPosts = async () => {
    try {
      const { data } = await axiosInstance.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggested = async () => {
    try {
      const { data } = await axiosInstance.get('/auth/suggested');
      setSuggestedUsers(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    if (user) fetchSuggested();
  }, [user]);

  // File Select Handle Karo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file)); // Preview create karo
    }
  };

  const handleFollow = async (userId) => {
    try {
      await axiosInstance.post(`/auth/follow/${userId}`);
      const isAlreadyFollowing = user.following.includes(userId);
      let updatedFollowing;
      if (isAlreadyFollowing) {
        updatedFollowing = user.following.filter(id => id !== userId);
      } else {
        updatedFollowing = [...user.following, userId];
      }
      updateLocalUser({ following: updatedFollowing });
      setSuggestedUsers(prev => prev.filter(u => u._id !== userId));
      alert("Success!");
    } catch (err) {
      console.error("Follow failed", err);
      alert("Something went wrong!");
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content && !selectedFile) return;

    try {
      // FormData ka use zaroori hai file upload ke liye
      const formData = new FormData();
      formData.append('content', content);
      if (selectedFile) {
        formData.append('file', selectedFile); // Backend 'file' naam expect kar raha hai
      }

      await axiosInstance.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setContent('');
      setSelectedFile(null);
      setFilePreview(null);
      fetchPosts(); 
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        
        {/* Feed Section */}
        <div className="col-md-8 col-lg-7 offset-lg-1">
          {user && (
            <div className="post-card p-3 mb-4 shadow-sm bg-white border-0" style={{borderRadius: '12px'}}>
              <div className="d-flex gap-2">
                <img src={user.profilePic} alt="me" className="rounded-circle" width="45" height="45" style={{objectFit:'cover'}} />
                <textarea 
                  className="form-control border-0 bg-light" 
                  placeholder={`What's on your mind, ${user.username}?`}
                  rows="2"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ borderRadius: '15px', resize: 'none' }}
                />
              </div>

              {/* File Preview Section */}
              {filePreview && (
                <div className="position-relative mt-3 text-center bg-light p-2 rounded" style={{borderRadius: '15px'}}>
                  <button 
                    onClick={() => {setSelectedFile(null); setFilePreview(null);}}
                    className="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                    style={{zIndex: 10, width: '30px', height: '30px', padding: '0'}}
                  >
                    <X size={16} />
                  </button>
                  {selectedFile.type.startsWith('image/') ? (
                    <img src={filePreview} alt="preview" className="img-fluid rounded" style={{maxHeight: '300px'}} />
                  ) : (
                    <div className="p-4 d-flex flex-column align-items-center">
                       <Video size={40} className="text-danger mb-2" />
                       <span className="small text-muted">{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              )}

              <hr className="my-2" />
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3 text-secondary">
                  {/* Hidden Input for Files */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*,video/*" 
                    className="d-none" 
                  />
                  
                  <div 
                    className="d-flex align-items-center gap-1" 
                    style={{cursor:'pointer'}}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Image size={18} className="text-success" /> <small>Photo</small>
                  </div>
                  <div 
                    className="d-flex align-items-center gap-1" 
                    style={{cursor:'pointer'}}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Video size={18} className="text-danger" /> <small>Video</small>
                  </div>
                </div>
                <button 
                  onClick={handlePostSubmit} 
                  className="btn btn-primary btn-sm px-4 rounded-pill"
                  disabled={!content && !selectedFile}
                >
                  Post <Send size={14} className="ms-1" />
                </button>
              </div>
            </div>
          )}

          {loading ? <Load/> : (
            posts.map(post => <PostCard key={post._id} post={post} refresh={fetchPosts} />)
          )}
        </div>

        {/* Suggestions Sidebar */}
        <div className="col-md-4 col-lg-3 d-none d-md-block">
          <div className="post-card p-3 shadow-sm bg-white border-0" style={{borderRadius: '12px', position: 'sticky', top: '80px'}}>
            <h6 className="fw-bold mb-3">Who to follow</h6>
            {suggestedUsers.length > 0 ? (
              suggestedUsers.map((sUser) => (
                <div key={sUser._id} className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <img src={sUser.profilePic} alt="user" className="rounded-circle" width="35" height="35" style={{objectFit:'cover'}} />
                    <div>
                      <div className="fw-bold small" style={{lineHeight: '1.2'}}>{sUser.username}</div>
                      <div className="text-muted" style={{fontSize: '10px'}}>Suggested for you</div>
                    </div>
                  </div>
                  <button 
                    className="btn btn-outline-primary btn-sm rounded-pill py-0 px-2"
                    style={{fontSize: '11px', fontWeight: 'bold'}}
                    onClick={() => handleFollow(sUser._id)}
                  >
                    Follow
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted small">No suggestions for now.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;