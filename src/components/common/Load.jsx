import React from 'react';

const Loader = ({ fullPage = false }) => {
  return (
    <div className={`loader-wrapper ${fullPage ? 'full-page' : ''}`}>
      <div className="custom-spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      <p className="loader-text">Loading Awesome Content...</p>
    </div>
  );
};

export default Loader;