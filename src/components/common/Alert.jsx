import React from 'react';
import { AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';

const Alert = ({ message, type = "danger" }) => {
  if (!message) return null;

  // Type ke hisab se icon select karne ka logic
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} />;
      case 'warning': return <AlertCircle size={20} />;
      case 'info':    return <Info size={20} />;
      default:        return <XCircle size={20} />;
    }
  };

  return (
    <div className={`custom-alert alert-${type} animate-fade-in`}>
      <div className="alert-icon-wrapper">
        {getIcon()}
      </div>
      <div className="alert-message">
        {message}
      </div>
    </div>
  );
};

export default Alert;