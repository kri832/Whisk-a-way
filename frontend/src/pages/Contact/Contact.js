import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Thank you. We read every note and will be in touch if needed.');
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
            <input type="text" required />
          </label>
          <label>
            Email
            <input type="email" required />
          </label>
          <label>
            Message
            <textarea rows="4" required />
          </label>
          {message && <p className="contact-message">{message}</p>}
          <button type="submit" className="btn btn-primary contact-submit">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;

