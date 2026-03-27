import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';
import { formatINR } from '../../utils/currency';
import './Checkout.css';

function Checkout() {
  const { items, summary, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="checkout-shell">
        <header>
          <h1 className="page-heading">Checkout</h1>
          <p className="page-subtitle">Your cart is empty.</p>
        </header>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      // eslint-disable-next-line no-alert
      alert('Please enter your name.');
      return;
    }

    setSubmitting(true);
    try {
      const payloadItems = items.map((item) => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const gst = summary.total * 0.05;
      const rawTotal = summary.total + gst;
      const grandTotal = Math.round(rawTotal);

      const { data } = await api.post('/orders', {
        items: payloadItems,
        totalAmount: grandTotal,
        notes,
        customerName,
      });

      clearCart();
      navigate('/order-confirmation', { state: { order: data } });
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Unable to place order right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const gst = summary.total * 0.05;
  const rawTotal = summary.total + gst;
  const grandTotal = Math.round(rawTotal);
  const roundOff = grandTotal - rawTotal;

  return (
    <div className="checkout-shell">
      <header className="checkout-header">
        <h1 className="page-heading">Checkout</h1>
        <p className="page-subtitle">
          Confirm your order and we&apos;ll set the tempo.
        </p>
      </header>

      <form className="card checkout-form" onSubmit={handleSubmit}>
        <div className="checkout-form-row">
          <label>
            Your Name
            <input
              type="text"
              placeholder="Full name for the order"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="checkout-form-row">
          <label>
            Notes for the kitchen
            <input
              type="text"
              placeholder="Allergies, timings, celebrations…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </div>
        <div className="checkout-summary">
          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <span>{formatINR(summary.total)}</span>
          </div>
          <div className="checkout-summary-row">
            <span>GST (5%)</span>
            <span>{formatINR(gst)}</span>
          </div>
          {roundOff !== 0 && (
            <div className="checkout-summary-row checkout-round-off">
              <span>Rounding</span>
              <span>{roundOff > 0 ? '+' : ''}{formatINR(roundOff)}</span>
            </div>
          )}
          <div className="checkout-summary-row checkout-grand-total">
            <span>Grand Total</span>
            <span>{formatINR(grandTotal)}</span>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary checkout-submit"
          disabled={submitting}
        >
          {submitting ? 'Plating your evening…' : 'Place order'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;

