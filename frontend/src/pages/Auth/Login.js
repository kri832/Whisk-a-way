import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const from = location.state?.from?.pathname || location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const isNetworkError = !err.response;
      const isBadCredentials = err.response?.status === 400;
      const isUnverified = err.response?.status === 403;
      
      if (isNetworkError) {
        setError('Cannot reach the server. Is the backend running? Check that REACT_APP_API_URL in frontend/.env matches your backend port (e.g. http://127.0.0.1:5001/api).');
      } else if (isBadCredentials) {
        setError('Invalid email or password. If you just set up the app, run "npm run seed" in the backend folder to create sample users.');
      } else if (isUnverified) {
        setError('Please verify your email before logging in. Check your inbox for the verification link.');
      } else {
        setError(err.response?.data?.message || 'Unable to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setResending(true);
    setError('');
    try {
      const { data } = await api.post('/auth/resend-verification', { email });
      setError('');
      alert(data.message); // Simple alert for success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h1 className="page-heading">Welcome back</h1>
        <p className="page-subtitle">
          Sign in to pick up where your last evening left off.
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <div className="auth-error">
              {error}
              {error.includes('verify your email') && (
                <button
                  type="button"
                  className="auth-resend-btn"
                  onClick={handleResendVerification}
                  disabled={resending}
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              )}
            </div>
          )}
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing you in…' : 'Sign in'}
          </button>
        </form>
        <p className="auth-note">
          New to Whisk‑a‑Way? <Link to="/register">Create an account</Link>.
        </p>
      </div>
    </div>
  );
}

export default Login;

