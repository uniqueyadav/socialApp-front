import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthCont, AuthProvider } from './context/AuthCont';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Load
import Load from './components/common/Load';

// --- Private Route Wrapper ---
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthCont);
  if (loading) return <Load fullPage />; 
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user } = useContext(AuthCont);

  return (
    <Router>
      <Navbar />

      <div className="main-layout container py-4">
        <div className="row">
          
          {/* Sidebar */}
          {user && (
            <div className="col-lg-3 d-none d-lg-block">
              {/* Sticky sidebar for better UX */}
              <div style={{ position: 'sticky', top: '80px' }}>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className={user ? "col-12 col-lg-9" : "col-12"}>
            <div className="content-wrapper animate-fade-in">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

                {/* Protected Routes */}
                <Route 
                  path="/" 
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/profile/:id?" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;