import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatINR } from '../../utils/currency';
import './Checkout.css';

function Checkout() {
  const { items, summary, clearCart } = useCart();
  const { user, isAdmin } = useAuth();
  
  // Auto-fill name for regular users, empty for admin
  const [customerName, setCustomerName] = useState(
    user && !isAdmin ? user.name : ''
  );
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
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

      console.log('Sending payment method:', paymentMethod);

      const { data } = await api.post('/orders', {
        items: payloadItems,
        totalAmount: grandTotal,
        notes,
        customerName,
        paymentMethod,
      });

      console.log('Order created with payment method:', data.paymentMethod);

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
            {user && !isAdmin && (
              <small className="checkout-name-note">
                Using your account name. You can edit if needed.
              </small>
            )}
          </label>
        </div>
        
        <div className="checkout-payment-section">
          <label className="checkout-payment-label">Payment Method</label>
          <div className="checkout-payment-options">
            <div
              className={`checkout-payment-card ${paymentMethod === 'cash' ? 'active' : ''}`}
              onClick={() => {
                setPaymentMethod('cash');
                setShowPaymentDetails(false);
              }}
            >
              <div className="payment-icon">💵</div>
              <div className="payment-card-title">Cash</div>
              <div className="payment-card-desc">Pay At Counter</div>
            </div>
            <div
              className={`checkout-payment-card ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => {
                setPaymentMethod('card');
                setShowPaymentDetails(true);
              }}
            >
              <div className="payment-icon">💳</div>
              <div className="payment-card-title">Card</div>
              <div className="payment-card-desc">Credit/Debit card</div>
            </div>
            <div
              className={`checkout-payment-card ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => {
                setPaymentMethod('upi');
                setShowPaymentDetails(true);
              }}
            >
              <div className="payment-icon">📱</div>
              <div className="payment-card-title">UPI</div>
              <div className="payment-card-desc">Google Pay, PhonePe, etc.</div>
            </div>
          </div>
        </div>

        {/* Payment Details Section */}
        {showPaymentDetails && paymentMethod === 'upi' && (
          <div className="payment-details-box">
            <h4>UPI Payment Details</h4>
            <div className="payment-detail-item">
              <span className="payment-detail-label">UPI ID:</span>
              <span className="payment-value">whiskaway@paytm</span>
            </div>
            <div className="payment-detail-item">
              <span className="payment-detail-label">QR Code:</span>
              <div className="qr-code-container">
                <img 
                  src="/qr-code.png" 
                  alt="UPI QR Code - Scan to Pay" 
                  className="qr-code-image"
                  onError={(e) => {
                    // Fallback if image not found
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="qr-placeholder" style={{ display: 'none' }}>
                  Scan to Pay
                </div>
              </div>
            </div>
            <p className="payment-note">
              Scan QR code or use the UPI ID to complete payment. This is a demo - no real payment will be processed.
            </p>
          </div>
        )}

        {showPaymentDetails && paymentMethod === 'card' && (
          <div className="payment-details-box">
            <h4>Card Payment Details</h4>
            <div className="card-payment-form">
              <label className="payment-form-label">
                Card Number
                <input type="text" placeholder="1234 5678 9012 3456" maxLength="19" />
              </label>
              <div className="card-form-row">
                <label className="payment-form-label">
                  Expiry Date
                  <input type="text" placeholder="MM/YY" maxLength="5" />
                </label>
                <label className="payment-form-label">
                  CVV
                  <input type="password" placeholder="123" maxLength="3" />
                </label>
              </div>
              <label className="payment-form-label">
                Cardholder Name
                <input type="text" placeholder="Name on card" />
              </label>
            </div>
            <p className="payment-note">
              This is a demo. No real payment will be processed.
            </p>
          </div>
        )}

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

