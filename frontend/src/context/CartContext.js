import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (menuItem, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i._id === menuItem._id);
      if (existing) {
        return current.map((i) =>
          i._id === menuItem._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...current, { ...menuItem, quantity }];
    });
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((i) => i._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setItems((current) =>
      current.map((i) => (i._id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  };

  const clearCart = () => setItems([]);

  const summary = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return { itemCount, total };
  }, [items]);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    summary,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

