import { createContext } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
