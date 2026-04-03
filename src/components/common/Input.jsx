import React from 'react';

const Input = ({ label, icon: Icon, ...props }) => {
  return (
    <div className="input-group-container mb-4">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" size={18} />}
        <input className={`custom-input ${Icon ? 'with-icon' : ''}`} {...props} />
      </div>
    </div>
  );
};

export default Input;