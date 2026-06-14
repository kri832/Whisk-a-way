import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatINR } from '../../utils/currency';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="orderconf-shell">
      <div className="card orderconf-card">
        <h1 className="page-heading">Order placed</h1>
        <p className="page-subtitle">
          We&apos;ll keep everything warm and ready. You&apos;ll find the full details in
          your order history.
        </p>
        <div className="orderconf-body">
          {order ? (
            <>
              <div className="orderconf-row">
                <span>Order ID</span>
                <span>{order._id}</span>
              </div>
              <div className="orderconf-row">
                <span>Status</span>
                <span>{order.status}</span>
              </div>
              <div className="orderconf-row">
                <span>Payment Method</span>
                <span className="payment-method-display">{(order.paymentMethod || 'cash').toUpperCase()}</span>
              </div>
              <div className="orderconf-row">
                <span>Total</span>
                <span>{formatINR(order.totalAmount)}</span>
              </div>
              {order.items && order.items.length > 0 && (
                <div className="orderconf-items">
                  <div className="orderconf-items-title">Items in this order</div>
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
            </>
          ) : (
            <p className="orderconf-missing">
              This page works best right after checkout. Visit **My Orders** for your full
              history.
            </p>
          )}
        </div>
        <div className="orderconf-actions">
          <Link to="/menu" className="btn btn-ghost">
            Keep browsing
          </Link>
          <Link to="/my-orders" className="btn btn-primary">
            View my orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;

