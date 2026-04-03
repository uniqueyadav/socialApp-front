import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthCont } from '../../context/AuthCont';
import { 
  LogOut, 
  User, 
  Home, 
  Bell, 
  Search, 
  LayoutGrid 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthCont);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'text-primary' : 'text-secondary';

  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-white border-bottom py-2">
      <div className="container">
        {/* --- Logo --- */}
        <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
          <LayoutGrid className="me-2" size={28} />
          <span style={{ letterSpacing: '-1px', fontSize: '1.5rem' }}>SocialApp</span>
        </Link>

        <div className="d-none d-md-flex mx-auto position-relative" style={{ width: '300px' }}>
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
          <input 
            type="text" 
            className="form-control ps-5 bg-light border-0 rounded-pill" 
            placeholder="Search posts..." 
            style={{ fontSize: '14px', padding: '10px' }}
          />
        </div>

        <div className="d-flex align-items-center gap-3">
          <Link className={`nav-link p-2 rounded-circle hover-bg ${isActive('/')}`} to="/">
            <Home size={24} />
          </Link>
          
          <Link className="nav-link p-2 rounded-circle hover-bg text-secondary" to="#">
            <Bell size={24} />
          </Link>

          {user ? (
            <div className="dropdown">
              <div 
                className="d-flex align-items-center gap-2 cursor-pointer" 
                data-bs-toggle="dropdown"
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={user.profilePic || 'https://ui-avatars.com/api/?name=' + user.username}
                  alt="user" 
                  className="rounded-circle border border-2 border-primary-subtle"
                  width="38" 
                  height="38"
                  style={{ objectFit: 'cover' }}
                />
                <div className="d-none d-lg-block">
                   <p className="mb-0 small fw-bold text-dark">{user.username}</p>
                </div>
              </div>

              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
                <li>
                  <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/profile">
                    <User size={18} /> Profile
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button onClick={handleLogout} className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger">
                    <LogOut size={18} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link className="btn btn-light btn-sm fw-bold px-3 rounded-pill" to="/login">Login</Link>
              <Link className="btn btn-primary btn-sm fw-bold px-3 rounded-pill shadow-sm" to="/register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;