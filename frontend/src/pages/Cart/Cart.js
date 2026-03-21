import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/currency';
import './Cart.css';

function Cart() {
  const { items, summary, removeItem, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-shell">
        <header>
          <h1 className="page-heading">Cart</h1>
          <p className="page-subtitle">Your table is still empty. For now.</p>
        </header>
        <div className="card cart-empty">
          Start with the <Link to="/menu">menu</Link> and we&apos;ll keep your picks warm
          here.
        </div>
      </div>
    );
  }

  return (
    <div className="cart-shell">
      <header className="cart-header">
        <h1 className="page-heading">Cart</h1>
        <p className="page-subtitle">
          A quick snapshot of what the evening looks like. Adjust portions, then slide to
          checkout.
        </p>
      </header>
      <div className="cart-layout">
        <div className="card cart-items">
          {items.map((item) => (
            <div key={item._id} className="cart-row">
              <div className="cart-row-main">
                <div className="cart-title">{item.name}</div>
                <div className="cart-meta">
                  <span>{item.location}</span>
                  <span>{item.category}</span>
                </div>
              </div>
              <div className="cart-row-actions">
                <div className="cart-qty">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-price">
                  {formatINR(item.price * item.quantity)}
                </div>
                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <aside className="card cart-summary">
          <div className="cart-summary-row">
            <span>Items</span>
            <span>{summary.itemCount}</span>
          </div>
          <div className="cart-summary-row">
            <span>Estimated total</span>
            <span>{formatINR(summary.total)}</span>
          </div>
          <button
            type="button"
            className="btn btn-primary cart-checkout-btn"
            onClick={handleCheckout}
          >
            Proceed to checkout
          </button>
          <button
            type="button"
            className="btn btn-ghost cart-clear-btn"
            onClick={clearCart}
          >
            Clear cart
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;

