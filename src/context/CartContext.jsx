// frontend/src/context/CartContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";

import { useAuth } from "./AuthContext";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { subscribeToLogout } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem("cartItems");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Failed to parse cart items from local storage", error);
      return [];
    }
  });

  // Shipping Address State & Local Storage
  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const localData = localStorage.getItem("shippingAddress");
      return localData ? JSON.parse(localData) : {};
    } catch (error) {
      console.error("Failed to parse shipping address from local storage", error);
      return {};
    }
  });

  // Payment Method State & Local Storage
  const [paymentMethod, setPaymentMethod] = useState(() => {
    try {
      const localData = localStorage.getItem("paymentMethod");
      return localData ? JSON.parse(localData) : "";
    } catch (error) {
      console.error("Failed to parse payment method from local storage", error);
      return "";
    }
  });

  // Save cartItems to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart items to local storage", error);
    }
  }, [cartItems]);

  // Save shippingAddress to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
    } catch (error) {
      console.error("Failed to save shipping address to local storage", error);
    }
  }, [shippingAddress]);

  // Save paymentMethod to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem("paymentMethod", JSON.stringify(paymentMethod));
    } catch (error) {
      console.error("Failed to save payment method to local storage", error);
    }
  }, [paymentMethod]);

  useEffect(() => {
    const handleLogout = () => {
      setCartItems([]);
      localStorage.removeItem("cartItems"); // Clear cart items on logout
      setShippingAddress({}); // Clear shipping address
      setPaymentMethod(""); // Clear payment method
      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("paymentMethod");
    };

    const unsubscribe = subscribeToLogout(handleLogout);
    return () => unsubscribe(); // Cleanup the event listener
  }, [subscribeToLogout]); // subscribeToLogout ပြောင်းလဲရင် useEffect ပြန် run မယ်

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { ...product, id: product._id, quantity }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.id !== productId);
      }
      return prevItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item));
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
  };

  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
  };

  const clearCart = () => {
    // Order တင်ပြီးရင် Cart ကို ရှင်းဖို့
    setCartItems([]);
    setShippingAddress({});
    setPaymentMethod("");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Tax, Shipping & Total Price တွက်ချက်ခြင်း (Frontend မှာ)
  const addDecimals = (num) => {
    // 2 decimal places
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10); // $100 အထက်ဆို Free Shipping
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2))); // 15% Tax
  const totalPrice = addDecimals(Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice));

  const contextValue = {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCart,
    getTotalItems,
    getSubtotal,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
