import React, { useState } from 'react';
import api from '../../utils/api';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    try {
      await api.post('/contacts', formData);
      setStatusMessage('Thank you. We read every note and will be in touch if needed.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatusMessage('Unable to send message right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-shell">
      <header className="contact-header">
        <h1 className="page-heading">Contact</h1>
        <p className="page-subtitle">
          Questions, private dining, or whole‑room reservations—send us a note and our
          team will follow up.
        </p>
      </header>
      <div className="contact-layout">
        <form className="card contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </label>
          {statusMessage && <p className="contact-message">{statusMessage}</p>}
          <button
            type="submit"
            className="btn btn-primary contact-submit"
            disabled={loading}
          >
            {loading ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;

