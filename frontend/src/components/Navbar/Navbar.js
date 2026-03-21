import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

function Navbar() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { summary } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <img src="/logo.png" alt="Whisk-a-Way" className="nav-logo" />
          <div className="nav-brand-text">
            <span className="nav-title">WHISK-A-WAY</span>
            <span className="nav-tagline">Beyond the plate</span>
            <span className="nav-tagline-1">Whisking since 2000S</span>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/reservations">Reservations</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="nav-actions">
          <NavLink to="/cart" className="nav-cart">
            <span>Cart</span>
            {summary.itemCount > 0 && (
              <span className="nav-cart-badge">{summary.itemCount}</span>
            )}
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className="nav-pill-link">
                {user?.name?.split(' ')[0] || 'Account'}
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className="nav-pill-link">
                  Admin
                </NavLink>
              )}
              <button type="button" className="btn btn-ghost nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-pill-link">
                Sign in
              </NavLink>
              <NavLink to="/register" className="btn btn-primary nav-cta">
                Join the table
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

