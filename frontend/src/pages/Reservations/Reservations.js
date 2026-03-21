import React, { useState } from 'react';
import api from '../../utils/api';
import './Reservations.css';

function Reservations() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    partySize: 2,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await api.post('/reservations', form);
      setMessage('Reservation requested. We will confirm shortly.');
    } catch (err) {
      setMessage('Unable to place reservation right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reserv-shell">
      <header className="reserv-header">
        <h1 className="page-heading">Reservations</h1>
        <p className="page-subtitle">
          Choose your room, time, and the people you&apos;d like to lose track of time
          with.
        </p>
      </header>

      <form className="card reserv-form" onSubmit={handleSubmit}>
        <div className="reserv-grid">
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              required
            />
          </label>
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              required
            />
          </label>
          <label>
            Time
            <input
              type="time"
              value={form.time}
              onChange={(e) => updateField('time', e.target.value)}
              required
            />
          </label>
          <label>
            Guests
            <input
              type="number"
              min="1"
              max="12"
              value={form.partySize}
              onChange={(e) => updateField('partySize', Number(e.target.value))}
              required
            />
          </label>
          <label>
            Notes
            <input
              type="text"
              placeholder="Occasion, seating preference…"
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
            />
          </label>
        </div>
        {message && <p className="reserv-message">{message}</p>}
        <button
          type="submit"
          className="btn btn-primary reserv-submit"
          disabled={submitting}
        >
          {submitting ? 'Saving your seat…' : 'Request reservation'}
        </button>
      </form>
    </div>
  );
}

export default Reservations;

