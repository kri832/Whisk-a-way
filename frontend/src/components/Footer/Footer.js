import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-inner">
        <div>
          <div className="footer-title">Whisk-a-Way</div>
          <p className="footer-tagline">Beyond the plate.</p>
        </div>
        <div className="footer-columns">
          <div>
            <div className="footer-heading">Hours</div>
            <p>Tue–Sun · 5pm–11pm</p>
          </div>
          <div>
            <div className="footer-heading">Contact</div>
            <p>hello@whiskaway.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

