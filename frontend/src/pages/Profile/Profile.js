import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  return (
    <div className="profile-shell">
      <header>
        <h1 className="page-heading">Profile</h1>
        <p className="page-subtitle">
          Your seat at Whisk‑a‑Way. Favourites, branches, and evenings so far.
        </p>
      </header>

      <section className="card profile-summary">
        <div>
          <div className="profile-name">{user?.name}</div>
          <div className="profile-email">{user?.email}</div>
        </div>
        <div className="profile-links">
          <span>Role: {user?.role}</span>
        </div>
      </section>

      <section className="profile-favorites card">
        <h2>Favourites</h2>
        {!profile && <p className="profile-muted">Loading your favourites…</p>}
        {profile && profile.favorites && profile.favorites.length === 0 && (
          <p className="profile-muted">
            You have not pinned any dishes yet. Mark them from the menu when something
            feels right.
          </p>
        )}
        {profile && profile.favorites && profile.favorites.length > 0 && (
          <ul className="profile-favorites-list">
            {profile.favorites.map((fav) => (
              <li key={fav._id}>
                <div className="profile-fav-name">{fav.name}</div>
                <div className="profile-fav-meta">
                  <span>{fav.location}</span>
                  <span>{fav.category}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Profile;

