import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : []
  );

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);
      if (existItem) {
        return prevItems.map((x) =>
          x.product === product._id
            ? {
                ...x,
                qty: Math.min(product.countInStock, existItem.qty + qty),
              }
            : x
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            title: product.title,
            image: product.images[0],
            price: product.price,
            countInStock: product.countInStock,
            qty,
          },
        ];
      }
    });
  };

  const updateCartQty = (productId, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) => (x.product === productId ? { ...x, qty } : x))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((x) => x.product !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Core pricing calculations
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = Number(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
