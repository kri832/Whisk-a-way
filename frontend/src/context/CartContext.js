import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    // Clear any existing timer
    if (window.toastTimer) clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  }, []);

  const addItem = useCallback((menuItem, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i._id === menuItem._id);
      if (existing) {
        return current.map((i) =>
          i._id === menuItem._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...current, { ...menuItem, quantity }];
    });
    showToast(`${menuItem.name} added to cart`);
  }, [showToast]);

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((i) => i._id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setItems((current) =>
      current.map((i) => (i._id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const summary = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return { itemCount, total };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      summary,
      toast,
      hideToast: () => setToast({ visible: false, message: '' }),
    }),
    [items, summary, toast]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

