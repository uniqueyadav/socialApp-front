import React, { useContext, useState, useEffect } from 'react';
import { AuthCont } from '../context/AuthCont';
import { Mail, Edit3, Image as ImageIcon, Loader, X, Clock } from 'lucide-react';
import Button from '../components/common/Button';
import EditProfileModal from '../components/profile/EditProfileModal'; 
import axiosInstance from '../api/axiosInstance';

const Profile = () => {
  // updateLocalUser context mein hona chahiye jo localStorage update kare
  const { user, updateLocalUser, logout } = useContext(AuthCont); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState([]); 
  const [loadingPosts, setLoadingPosts] = useState(true);

  // --- Backend Base URL Logic ---
  const PF = import.meta.env.VITE_API_URL || "https://socialapp-back.onrender.com/";

  // Helper to get correct URL
  const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = PF.endsWith('/') ? PF : `${PF}/`;
    return baseUrl + path;
  };

  // Modals for Followers/Following
  const [showListModal, setShowListModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [listData, setListData] = useState([]);

  // --- 1. Fetch My Posts ---
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axiosInstance.get(`/posts/user/${user._id}`);
        setUserPosts(res.data); 
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };
    if (user?._id) fetchMyPosts();
  }, [user?._id]);

  // --- 2. Update Profile (FIXED LOGIC) ---
  const handleSaveProfile = async (updatedData) => {
    try {
      const res = await axiosInstance.put(`/auth/profile`, updatedData);
      
      // Update Context AND LocalStorage (Taaki refresh pe purana na aaye)
      updateLocalUser(res.data);
      localStorage.setItem('userInfo', JSON.stringify(res.data)); 
      
      alert("Profile updated successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Database update failed!");
    }
  };

  // --- 3. Follower/Following List (FIXED) ---
  const handleOpenList = async (type) => {
    setModalTitle(type === 'followers' ? "Followers" : "Following");
    try {
      // Dhyan de: Ye URL tere backend route se match hona chahiye
      const res = await axiosInstance.get(`/auth/${user._id}/friends`);
      const data = type === 'followers' ? res.data.followers : res.data.following;
      setListData(data || []);
      setShowListModal(true);
    } catch (err) {
      console.error("List fetch error:", err);
      alert("Could not load list. Check if backend route exists.");
    }
  };

  // --- 4. Remove/Unfollow Logic (FIXED & SIMPLIFIED) ---
  const handleRemoveFriend = async (friendId) => {
    try {
      // 1. Backend call (Database update) - Ab backend khud fresh user bhej raha hai
      const res = await axiosInstance.post(`/auth/follow/${friendId}`);
      
      if (res.status === 200) {
        // 2. Modal ki list se turant UI filter karo
        setListData(prev => prev.filter(item => item._id !== friendId));

        // 3. Backend se aaye huye fresh data se Context aur Storage update karo
        // res.data.user mein populated followers/following hain
        updateLocalUser(res.data.user); 
        localStorage.setItem('userInfo', JSON.stringify(res.data.user));

        console.log("Sync successful with backend fresh data");
      }
    } catch (err) {
      console.error("Remove failed:", err);
      alert("Action failed! Check backend connection.");
    }
  };

  if (!user) return <div className="text-center mt-5 p-5">Loading user profile...</div>;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          
          <div className="post-card shadow-sm mb-4 bg-white" style={{borderRadius: '20px', overflow: 'hidden'}}>
            <div style={{ height: '150px', background: 'linear-gradient(135deg, #1877f2 0%, #0056b3 100%)' }}></div>
            <div className="p-4 text-center" style={{ marginTop: '-75px' }}>
              <img 
                src={getMediaUrl(user.profilePic) || 'https://via.placeholder.com/150'} 
                className="rounded-circle border border-4 border-white shadow"
                width="120" height="120"
                style={{ objectFit: 'cover', background: '#eee' }}
                alt="profile"
              />
              <h3 className="mt-2 fw-bold mb-0">{user.username}</h3>
              <p className="text-muted small mb-3">{user.bio || 'No bio added yet.'}</p>
              
              <div className="d-flex justify-content-center gap-4 mb-3 border-top border-bottom py-3">
                <div className="text-center cursor-pointer" onClick={() => handleOpenList('followers')} style={{cursor: 'pointer'}}>
                  <div className="fw-bold">{user.followers?.length || 0}</div>
                  <div className="text-muted small">Followers</div>
                </div>
                <div className="text-center cursor-pointer" onClick={() => handleOpenList('following')} style={{cursor: 'pointer'}}>
                  <div className="fw-bold">{user.following?.length || 0}</div>
                  <div className="text-muted small">Following</div>
                </div>
                <div className="text-center">
                    <div className="fw-bold">{userPosts.length}</div>
                    <div className="text-muted small">Posts</div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-2 mt-2">
                <Button variant="outline-primary" className="btn-sm rounded-pill px-4" onClick={() => setIsModalOpen(true)}>
                  <Edit3 size={16} className="me-1" /> Edit Profile
                </Button>
                <Button variant="danger" className="btn-sm rounded-pill px-4" onClick={logout}>Logout</Button>
              </div>
            </div>

            <div className="p-4 bg-light border-top">
              <h6 className="fw-bold mb-3 text-start">About</h6>
              <div className="d-flex flex-column gap-2 text-secondary small text-start">
                <div className="d-flex align-items-center gap-2">
                  <Mail size={16} /> <span>{user.email}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Clock size={16} /> <span>Joined {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="mt-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center">
                <ImageIcon size={20} className="me-2 text-primary" /> Gallery
            </h5>
            
            {loadingPosts ? (
              <div className="text-center p-5"><Loader className="animate-spin" /> Fetching...</div>
            ) : userPosts.length > 0 ? (
              <div className="row g-3">
                {userPosts.map((post) => (
                  <div key={post._id} className="col-sm-6">
                    <div className="post-card shadow-sm border-0 h-100 overflow-hidden bg-white">
                      {/* Media logic: Agar video file extension hai to video tag dikhao */}
                      {(post.video || (post.fileUrl && post.fileUrl.match(/\.(mp4|webm|ogg)$|^uploads\/.*video/i))) ? (
                        <video 
                          src={getMediaUrl(post.video || post.fileUrl)} 
                          className="w-100"
                          style={{ height: '200px', objectFit: 'cover', background: '#000' }}
                          muted
                        />
                      ) : (
                        <img 
                          src={getMediaUrl(post.image || post.fileUrl) || 'https://via.placeholder.com/300'} 
                          className="w-100" 
                          alt="post" 
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="p-3 bg-white">
                        <p className="small mb-1 fw-bold text-truncate">{post.content}</p>
                        <span className="text-muted" style={{ fontSize: '10px' }}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-5 bg-white border rounded shadow-sm text-muted">
                <p>No posts yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Modal Pop-up (Fixed) --- */}
      {showListModal && (
        <div className="custom-list-modal" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
          <div style={{ backgroundColor: 'white', width: '90%', maxWidth: '400px', borderRadius: '15px', overflow: 'hidden' }}>
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <h6 className="mb-0 fw-bold">{modalTitle}</h6>
              <X className="cursor-pointer" onClick={() => setShowListModal(false)} size={20} />
            </div>
            <div className="p-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {listData.length > 0 ? listData.map((item) => (
                <div key={item._id} className="d-flex align-items-center justify-content-between p-2 hover-bg-light rounded">
                  <div className="d-flex align-items-center gap-2">
                    <img src={getMediaUrl(item.profilePic) || 'https://via.placeholder.com/35'} width="35" height="35" className="rounded-circle border" alt="u" />
                    <span className="small fw-bold">{item.username}</span>
                  </div>
                  <button className="btn btn-sm btn-outline-danger px-3 rounded-pill" style={{fontSize: '11px'}} onClick={() => handleRemoveFriend(item._id)}>
                    {modalTitle === "Following" ? "Unfollow" : "Remove"}
                  </button>
                </div>
              )) : <div className="p-4 text-center text-muted">Empty List</div>}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <EditProfileModal user={user} onClose={() => setIsModalOpen(false)} onSave={handleSaveProfile} />
      )}
    </div>
  );
};

export default Profile;