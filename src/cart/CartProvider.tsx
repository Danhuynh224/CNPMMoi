import React, { useState } from "react";
import { CartContext, type CartItem } from "./CartContext";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const exist = prev.find((p) => p.id === item.id);
      if (exist) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, item];
    });
  };

  const updateItem = (id: string, quantity: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
