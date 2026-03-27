import React from 'react';
import './Toast.css';

function Toast({ message, visible, onClose }) {
  if (!visible) return null;

  return (
    <div className={`toast-container ${visible ? 'visible' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">✓</span>
        <p className="toast-message">{message}</p>
        <button className="toast-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}

export default Toast;
