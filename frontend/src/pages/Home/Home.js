import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatINR } from '../../utils/currency';
import './Home.css';

function Home() {
  const [specials, setSpecials] = useState([]);

  useEffect(() => {
    api
      .get('/menu', { params: { special: true } })
      .then((res) => setSpecials(res.data.slice(0, 3)))
      .catch(() => setSpecials([]));
  }, []);

  return (
    <div className="home-shell">
      <section className="home-hero card">
        <div className="home-hero-copy">
          <div className="pill">
            <span>New</span>
            <span>Whisk-a-Way Experiences</span>
          </div>
          <h1 className="home-title">Beyond the plate.</h1>
          <p className="home-subtitle">
            A citywide table where midnight risottos, grills, and tastings
            share the same story: unforgettable evenings, plated with care.
          </p>
          <div className="home-hero-actions">
            <Link to="/menu" className="btn btn-primary">
              Explore the menu
            </Link>
            <Link to="/reservations" className="btn btn-ghost">
              Book a table
            </Link>
          </div>
          <div className="home-stats">
            <div>
              <div className="home-stat-number">24</div>
              <div className="home-stat-label">Seasonal dishes</div>
            </div>
            <div>
              <div className="home-stat-number">7k+</div>
              <div className="home-stat-label">Evenings hosted</div>
            </div>
          </div>
        </div>
        <div className="home-hero-panel">
          <div className="home-panel-card">
            <div className="home-panel-heading">Tonight at Whisk-a-Way</div>
            <p className="home-panel-copy">
              Tonight&apos;s specials lean into smoke, citrus, and a little maroon velvet.
            </p>
            <ul className="home-panel-list">
              <li>Midnight Maroon Risotto</li>
              <li>Charred ember burger</li>
              <li>Citrus‑cured salmon</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <h2 className="page-heading">Chef&apos;s specials</h2>
          <p className="page-subtitle">
            A short list of plates we obsess over this season. They sell out fast, so plan
            your evening accordingly.
          </p>
        </div>
        <div className="grid home-specials-grid">
          {specials.map((item) => (
            <article key={item._id} className="home-special-card card">
              <div className="home-special-header">
                <h3>{item.name}</h3>
                <span className="home-price">{formatINR(item.price)}</span>
              </div>
              <p className="home-special-desc">{item.description}</p>
              <div className="home-special-meta">
                <span>{item.category}</span>
              </div>
            </article>
          ))}
          {specials.length === 0 && (
            <div className="card home-special-placeholder">
              Specials are still simmering. Seed the database, then refresh to meet them.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;

