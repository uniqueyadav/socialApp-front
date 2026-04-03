import React from 'react';

const Button = ({ children, onClick, type = "button", variant = "primary", loading = false, disabled = false, fullWidth = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`custom-btn btn-${variant} ${fullWidth ? 'w-100' : ''} ${loading ? 'loading' : ''}`}
    >
      {loading ? (
        <div className="spinner-container">
          <span className="spinner-border spinner-border-sm" role="status"></span>
          <span className="ms-2">Processing...</span>
        </div>
      ) : (
        <span className="btn-content">{children}</span>
      )}
    </button>
  );
};

export default Button;