import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './EmailVerification.css';

function EmailVerification() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(data.message);
        
        // Auto-login after verification
        if (data.token && data.user) {
          localStorage.setItem('whisk_token', data.token);
          localStorage.setItem('whisk_user', JSON.stringify(data.user));
          
          // Redirect after 2 seconds
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. Please try again.');
        if (err.response?.data?.email) {
          setEmail(err.response.data.email);
        }
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const handleResend = async () => {
    if (!email) {
      return;
    }

    setResending(true);
    try {
      const { data } = await api.post('/auth/resend-verification', { email });
      setMessage(data.message);
      setStatus('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to resend verification email.');
      setStatus('error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verification-shell">
      <div className="card verification-card">
        {status === 'loading' && (
          <>
            <div className="verification-icon loading">
              <div className="spinner"></div>
            </div>
            <h1 className="page-heading">Verifying your email...</h1>
            <p className="page-subtitle">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="verification-icon success">✓</div>
            <h1 className="page-heading">Email Verified!</h1>
            <p className="page-subtitle">{message}</p>
            <p className="verification-note">
              Redirecting you to the homepage...
            </p>
            <Link to="/" className="btn btn-primary verification-btn">
              Go to Homepage
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="verification-icon error">✕</div>
            <h1 className="page-heading">Verification Failed</h1>
            <p className="page-subtitle">{message}</p>
            
            {email && (
              <div className="verification-resend">
                <p>Need a new verification link?</p>
                <button
                  className="btn btn-primary verification-btn"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            )}
            
            <Link to="/login" className="btn btn-ghost verification-btn">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default EmailVerification;
