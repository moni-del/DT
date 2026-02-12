import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  discount: number;
  applyDiscount: (code: string) => boolean;
  discountCode: string;
  flyingProduct: { product: Product; startRect: DOMRect } | null;
  setFlyingProduct: (data: { product: Product; startRect: DOMRect } | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DISCOUNT_CODES: Record<string, number> = {
  DT10: 10,
  DT20: 20,
  DT50: 50,
  WELCOME: 15,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [flyingProduct, setFlyingProduct] = useState<{ product: Product; startRect: DOMRect } | null>(null);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscount(0);
    setDiscountCode("");
  }, []);

  const applyDiscount = useCallback((code: string) => {
    const upperCode = code.toUpperCase();
    if (DISCOUNT_CODES[upperCode]) {
      setDiscount(DISCOUNT_CODES[upperCode]);
      setDiscountCode(upperCode);
      return true;
    }
    return false;
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalPrice = subtotal - (subtotal * discount) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        discount,
        applyDiscount,
        discountCode,
        flyingProduct,
        setFlyingProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
