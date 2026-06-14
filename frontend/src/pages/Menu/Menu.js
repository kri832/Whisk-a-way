import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/currency';
import './Menu.css';

function Menu() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    api
      .get('/menu')
      .then((res) => setItems(res.data))
      .catch(() => setItems([]));
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(items.map((i) => i.category));
    return ['All', ...Array.from(unique)];
  }, [items]);

  const toggleFavorite = async (id) => {
    if (!isAuthenticated) {
      // eslint-disable-next-line no-alert
      alert('Sign in to save favourites.');
      return;
    }
    try {
      await api.post(`/auth/favorites/${id}`);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Unable to update favourites right now.');
    }
  };

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (category !== 'All' && item.category !== category) return false;
        if (
          search &&
          !`${item.name} ${item.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
        ) {
          return false;
        }
        return true;
      }),
    [items, category, search]
  );

  const groupedItems = useMemo(() => {
    const groups = {};
    filtered.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="menu-shell">
      <header className="menu-header">
        <h1 className="page-heading">Menu</h1>
        <p className="page-subtitle">
          Browse seasonal dishes across Whisk‑a‑Way. Filter by room, course,
          or a craving that will not leave you alone.
        </p>
      </header>

      <div className="menu-filters card">
        <div className="menu-filter-row">
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="menu-filter-row">
          <label className="menu-search">
            Search
            <input
              type="text"
              placeholder="Midnight, citrus, charcoal…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="menu-filter-note">
              {isAuthenticated
                ? 'Tap the star on a dish to save it to your favourites.'
                : 'Sign in later to favourite dishes and save your shortlist.'}
          </div>
        </div>
      </div>

      <div className="menu-sections">
        {Object.entries(groupedItems).map(([catName, catItems]) => (
          <section key={catName} className="menu-category-section">
            <h2 className="menu-category-title">{catName}</h2>
            <div className="grid menu-grid">
              {catItems.map((item) => (
                <article key={item._id} className="card menu-card">
                  <div className="menu-card-content">
                    <div className="menu-card-header">
                      <div className="menu-card-title-group">
                        <h3>{item.name}</h3>
                        <div className="menu-card-meta">
                          <span>{item.location}</span>
                          {item.isSpecial && <span className="menu-chip">Chef&apos;s pick</span>}
                        </div>
                      </div>
                      <div className="menu-price">{formatINR(item.price)}</div>
                    </div>
                    <p className="menu-desc">{item.description}</p>
                  </div>
                  <div className="menu-card-footer">
                    <button
                      type="button"
                      className="btn btn-primary menu-add-btn"
                      onClick={() => addItem(item)}
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      className="menu-fav-btn"
                      onClick={() => toggleFavorite(item._id)}
                    >
                      ☆ Save
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {filtered.length === 0 && (
          <div className="card menu-empty">
            {items.length === 0
              ? 'No menu items yet. Start the backend, run "npm run seed" in the backend folder, then refresh.'
              : 'Nothing matches those filters yet. Try loosening the search or category.'}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
