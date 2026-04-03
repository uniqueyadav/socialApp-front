import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthCont } from '../../context/AuthCont';
import { Home, User, Settings, Bookmark, Hash, Users } from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthCont);

  const menuItems = [
    { icon: Home, label: 'Feed', path: '/' },
    { icon: Hash, label: 'Explore', path: '/explore' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="sidebar-container d-none d-lg-block">
      <ul className="list-unstyled">
        {menuItems.map((item, index) => (
          <li key={index} className="mb-2">
            <Link to={item.path} className="sidebar-link">
              <item.icon size={20} className="me-3 text-primary" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      {user && (
        <div className="mt-4 p-3 bg-light rounded-4 border">
          <p className="small text-secondary fw-bold mb-2">SUGGESTIONS</p>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width:30, height:30, fontSize:12}}>G</div>
            <span className="small fw-medium"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;