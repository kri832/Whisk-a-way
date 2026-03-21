import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './MyReservations.css';

function MyReservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    api
      .get('/reservations/mine')
      .then((res) => setReservations(res.data))
      .catch(() => setReservations([]));
  }, []);

  return (
    <div className="myres-shell">
      <header>
        <h1 className="page-heading">My reservations</h1>
        <p className="page-subtitle">
          The evenings we&apos;ve already saved a seat for.
        </p>
      </header>
      <div className="grid myres-grid">
        {reservations.map((resv) => (
          <article key={resv._id} className="card myres-card">
            <div className="myres-row">
              <span className="myres-label">Branch</span>
              <span className="myres-value">{resv.branch}</span>
            </div>
            <div className="myres-row">
              <span className="myres-label">Date</span>
              <span className="myres-value">
                {resv.date} · {resv.time}
              </span>
            </div>
            <div className="myres-row">
              <span className="myres-label">Guests</span>
              <span className="myres-value">{resv.partySize}</span>
            </div>
            <div className="myres-row">
              <span className="myres-label">Status</span>
              <span className="myres-value">{resv.status}</span>
            </div>
          </article>
        ))}
        {reservations.length === 0 && (
          <div className="card myres-empty">
            You haven&apos;t booked a table yet. Once you do, details will appear here.
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReservations;

