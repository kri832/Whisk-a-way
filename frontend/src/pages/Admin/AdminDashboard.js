import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatINR } from '../../utils/currency';
import './AdminDashboard.css';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isSpecial: false,
  });

  // Orders pagination and filtering
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPerPage] = useState(15);
  const [dateFilter, setDateFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Load other data on mount
  useEffect(() => {
    api
      .get('/reservations')
      .then((res) => setReservations(res.data))
      .catch(() => setReservations([]));
    api
      .get('/users')
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
    api
      .get('/menu')
      .then((res) => setMenuItems(res.data))
      .catch(() => setMenuItems([]));
    api
      .get('/contacts')
      .then((res) => setContacts(res.data))
      .catch(() => setContacts([]));
  }, []);

  // Fetch orders with pagination and filters
  const fetchOrders = (page = 1, date = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: ordersPerPage.toString(),
    });
    
    if (date) {
      params.append('date', date);
    }

    api
      .get(`/orders?${params.toString()}`)
      .then((res) => {
        setOrders(res.data.orders);
        setPagination(res.data.pagination);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setOrders([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalOrders: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
      });
  };

  // Initial load of orders
  useEffect(() => {
    fetchOrders(1, dateFilter);
  }, [dateFilter]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setOrdersPage(newPage);
    fetchOrders(newPage, dateFilter);
  };

  // Handle date filter change
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setOrdersPage(1); // Reset to first page when filter changes
  };

  // Clear date filter
  const clearDateFilter = () => {
    setDateFilter('');
    setOrdersPage(1);
  };

  const handleUserField = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemField = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const submitNewUser = async (e) => {
    e.preventDefault();

    const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
    const emailDomain = newUser.email.split('@')[1]?.toLowerCase();

    if (!allowedDomains.includes(emailDomain)) {
      // eslint-disable-next-line no-alert
      alert(`Only registration from ${allowedDomains.join(', ')} is allowed.`);
      return;
    }

    try {
      const { data } = await api.post('/users', newUser);
      setUsers((prev) => [data, ...prev]);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.response?.data?.message || 'Unable to create user right now.');
    }
  };

  const deleteUser = async (id) => {
    // eslint-disable-next-line no-alert
    const ok = window.confirm('Permanently remove this user account?');
    if (!ok) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.response?.data?.message || 'Unable to remove user right now.');
    }
  };

  const submitNewItem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newItem,
        price: Number(newItem.price || 0),
      };
      const { data } = await api.post('/menu', payload);
      setMenuItems((prev) => [data, ...prev]);
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: '',
        isSpecial: false,
      });
    } catch {
      // eslint-disable-next-line no-alert
      alert('Unable to add menu item right now.');
    }
  };

  const deleteMenuItem = async (id) => {
    // eslint-disable-next-line no-alert
    const ok = window.confirm('Remove this dish from the menu?');
    if (!ok) return;
    try {
      await api.delete(`/menu/${id}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
    } catch {
      // eslint-disable-next-line no-alert
      alert('Unable to remove menu item right now.');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/orders/${id}/status`, { status });
      // Update the order in the current list
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
    } catch (err) {
      console.error('Error updating order status:', err);
      // eslint-disable-next-line no-alert
      alert('Unable to update order status.');
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/reservations/${id}/status`, { status });
      setReservations((prev) => prev.map((r) => (r._id === id ? data : r)));
    } catch {
      // eslint-disable-next-line no-alert
      alert('Unable to update reservation status.');
    }
  };

  return (
    <div className="admin-shell">
      <header>
        <h1 className="page-heading">Admin</h1>
        <p className="page-subtitle">
          Manage guests, dishes, reservations, and the flow of orders.
        </p>
      </header>

      <section className="card admin-section">
        <h2>Users</h2>
        <p className="admin-subtitle">
          Add guests or staff accounts manually without going through the public signup
          flow.
        </p>
        <form className="admin-form" onSubmit={submitNewUser}>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => handleUserField('name', e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => handleUserField('email', e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => handleUserField('password', e.target.value)}
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => handleUserField('role', e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="btn btn-primary admin-submit">
            Add user
          </button>
        </form>
        <div className="admin-table admin-users">
          <div className="admin-table-header">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Action</span>
          </div>
          {users.map((u) => (
            <div key={u._id} className="admin-table-row">
              <span>{u.name}</span>
              <span>{u.email}</span>
              <span>{u.role}</span>
              <span>
                <button
                  type="button"
                  className="admin-danger-link"
                  onClick={() => deleteUser(u._id)}
                >
                  Remove
                </button>
              </span>
            </div>
          ))}
          {users.length === 0 && (
            <div className="admin-table-empty">No users loaded yet.</div>
          )}
        </div>
      </section>

      <section className="card admin-section">
        <h2>Menu</h2>
        <p className="admin-subtitle">
          Expand the Whisk‑a‑Way menu with new dishes.
        </p>
        <form className="admin-form" onSubmit={submitNewItem}>
          <input
            type="text"
            placeholder="Dish name"
            value={newItem.name}
            onChange={(e) => handleItemField('name', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Short description"
            value={newItem.description}
            onChange={(e) => handleItemField('description', e.target.value)}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => handleItemField('price', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Category (Mains, Starters…)"
            value={newItem.category}
            onChange={(e) => handleItemField('category', e.target.value)}
            required
          />
          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={newItem.isSpecial}
              onChange={(e) => handleItemField('isSpecial', e.target.checked)}
            />
            <span>Mark as chef&apos;s special</span>
          </label>
          <button type="submit" className="btn btn-primary admin-submit">
            Add menu item
          </button>
        </form>
        <div className="admin-table admin-menu">
          <div className="admin-table-header">
            <span>Dish</span>
            <span>Price</span>
            <span>Actions</span>
          </div>
          {menuItems.map((item) => (
            <div key={item._id} className="admin-table-row">
              <span>{item.name}</span>
              <span>{formatINR(item.price)}</span>
              <span>
                <button
                  type="button"
                  className="admin-danger-link"
                  onClick={() => deleteMenuItem(item._id)}
                >
                  Remove
                </button>
              </span>
            </div>
          ))}
          {menuItems.length === 0 && (
            <div className="admin-table-empty">No menu items yet. Add your first dish.</div>
          )}
        </div>
      </section>

      <section className="card admin-section">
        <h2>Reservations</h2>
        <p className="admin-subtitle">
          See who has a table waiting and when they arrive.
        </p>
        <div className="admin-table admin-reservations">
          <div className="admin-table-header">
            <span>Guest</span>
            <span>Date</span>
            <span>Guests</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {reservations.map((r) => (
            <div key={r._id} className="admin-table-row">
              <span>{r.name}</span>
              <span>
                {r.date} · {r.time}
              </span>
              <span>{r.partySize}</span>
              <span>{r.status}</span>
              <span>
                {r.status === 'pending' && (
                  <button
                    type="button"
                    className="admin-action-btn"
                    onClick={() => updateReservationStatus(r._id, 'confirmed')}
                  >
                    Confirm
                  </button>
                )}
              </span>
            </div>
          ))}
          {reservations.length === 0 && (
            <div className="admin-table-empty">
              No reservations yet. Guest bookings will appear here.
            </div>
          )}
        </div>
      </section>

      <section className="card admin-section">
        <h2>Orders</h2>
        <p className="admin-subtitle">
          Track what guests have ordered and update the status from the pass.
        </p>
        
        {/* Date Filter */}
        <div className="orders-filter">
          <div className="filter-group">
            <label htmlFor="date-filter">Filter by Date:</label>
            <input
              type="date"
              id="date-filter"
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="date-filter-input"
            />
            {dateFilter && (
              <button
                type="button"
                className="btn btn-secondary clear-filter-btn"
                onClick={clearDateFilter}
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="orders-summary">
            <span className="orders-count">
              Showing {orders.length} of {pagination.totalOrders} order{pagination.totalOrders !== 1 ? 's' : ''}
              {dateFilter && ` for ${new Date(dateFilter + 'T00:00:00').toLocaleDateString()}`}
            </span>
          </div>
        </div>

        <div className="admin-table admin-orders">
          <div className="admin-table-header">
            <span>Guest</span>
            <span>Items Ordered</span>
            <span>Date & Time</span>
            <span>Total</span>
            <span>Payment</span>
            <span>Status</span>
            <span>Update</span>
          </div>
          {orders.length > 0 ? orders.map((o) => {
            const orderDate = new Date(o.createdAt);
            const formattedDate = orderDate.toLocaleDateString();
            const formattedTime = orderDate.toLocaleTimeString();
            
            return (
              <div key={o._id} className="admin-table-row">
                <span>{o.user?.name || 'Guest'}</span>
                <div className="admin-order-items">
                  {o.items?.map((item, idx) => (
                    <div key={idx} className="admin-order-item">
                      <span>
                        <span className="admin-item-qty">{item.quantity}x</span>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="order-datetime">
                  <span className="order-date">{formattedDate}</span>
                  <span className="order-time">{formattedTime}</span>
                </div>
                <span>{formatINR(o.totalAmount)}</span>
                <span>
                  <span className={`payment-tag payment-${o.paymentMethod || 'cash'}`}>
                    {(o.paymentMethod || 'cash').toUpperCase()}
                  </span>
                </span>
                <span>{o.status}</span>
                <span>
                  {o.status === 'pending' && (
                    <button
                      type="button"
                      className="admin-action-btn"
                      onClick={() => updateOrderStatus(o._id, 'confirmed')}
                    >
                      Accept
                    </button>
                  )}
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </span>
              </div>
            );
          }) : (
            <div className="admin-table-empty">
              {dateFilter ? 'No orders found for this date.' : 'No orders yet. Once guests check out, you\'ll see them here.'}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="btn btn-pagination"
              disabled={!pagination.hasPrevPage}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              ← Previous
            </button>
            
            <div className="pagination-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            
            <button
              className="btn btn-pagination"
              disabled={!pagination.hasNextPage}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </section>

      <section className="card admin-section">
        <h2>Contact Responses</h2>
        <p className="admin-subtitle">
          Read what guests are saying through the contact form.
        </p>
        <div className="admin-table admin-contacts">
          <div className="admin-table-header">
            <span>Guest</span>
            <span>Contact Info</span>
            <span>Message</span>
            <span>Date</span>
          </div>
          {contacts.map((c) => (
            <div key={c._id} className="admin-table-row">
              <span>{c.name}</span>
              <div className="admin-contact-info">
                <span>{c.email}</span>
                <span>{c.phone}</span>
              </div>
              <span className="admin-contact-message">{c.message}</span>
              <span>{new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
          {contacts.length === 0 && (
            <div className="admin-table-empty">
              No contact responses yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
