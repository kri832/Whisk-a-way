import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import './VerifyEmailPrompt.css';

function VerifyEmailPrompt() {
  const location = useLocation();
  const email = location.state?.email || '';
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      return;
    }

    setSending(true);
    setError('');
    setMessage('');

    try {
      const { data } = await api.post('/auth/resend-verification', { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="prompt-shell">
      <div className="card prompt-card">
        <div className="prompt-icon">📧</div>
        <h1 className="page-heading">Check Your Email</h1>
        <p className="page-subtitle">
          We've sent a verification link to <strong>{email}</strong>
        </p>
        <p className="prompt-instructions">
          Please check your inbox and click the verification link to activate your account.
          The link will expire in 24 hours.
        </p>

        {message && <div className="prompt-success">{message}</div>}
        {error && <div className="prompt-error">{error}</div>}

        <div className="prompt-actions">
          <button
            className="btn btn-primary prompt-btn"
            onClick={handleResend}
            disabled={sending || !email}
          >
            {sending ? 'Sending...' : 'Resend Email'}
          </button>
          <Link to="/login" className="btn btn-ghost prompt-btn">
            Back to Login
          </Link>
        </div>

        <p className="prompt-tip">
          <strong>Tip:</strong> Check your spam folder if you don't see the email in your inbox.
        </p>
      </div>
    </div>
  );
}

export default VerifyEmailPrompt;
