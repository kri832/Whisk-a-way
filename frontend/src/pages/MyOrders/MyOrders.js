import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatINR } from '../../utils/currency';
import './MyOrders.css';

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get('/orders/mine')
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className="orders-shell">
      <header>
        <h1 className="page-heading">My orders</h1>
        <p className="page-subtitle">
          Every evening you have sent home or taken to a different table.
        </p>
      </header>
      <div className="grid orders-grid">
        {orders.map((order) => (
          <article key={order._id} className="card orders-card">
            <div className="orders-row">
              <span className="orders-label">Status</span>
              <span className="orders-value">{order.status}</span>
            </div>
            <div className="orders-row">
              <span className="orders-label">Location</span>
              <span className="orders-value">{order.location}</span>
            </div>
            <div className="orders-row">
              <span className="orders-label">Total</span>
              <span className="orders-value">{formatINR(order.totalAmount)}</span>
            </div>
            {order.items && order.items.length > 0 && (
              <div className="orders-items">
                <div className="orders-items-title">Items</div>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.menuItem || item.name}>
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>{formatINR(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
        {orders.length === 0 && (
          <div className="card orders-empty">
            No orders yet. Once you check out, they will appear here.
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;

