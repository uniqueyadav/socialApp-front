import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 mt-5 border-top bg-white">
      <div className="container text-center text-secondary small">
        <p className="mb-1">© {new Date().getFullYear()} SocialApp. Built with ❤️ for Developers.</p>
        <div className="d-flex justify-content-center gap-3">
          <a href="#" className="text-decoration-none text-muted">About</a>
          <a href="#" className="text-decoration-none text-muted">Privacy</a>
          <a href="#" className="text-decoration-none text-muted">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;