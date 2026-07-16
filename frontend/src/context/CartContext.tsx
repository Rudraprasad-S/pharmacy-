import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { MedicineListItem } from "../types/medicine";

interface CartItem {
  medicine: MedicineListItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (medicine: MedicineListItem, quantity?: number) => void;
  removeFromCart: (medicineId: number) => void;
  updateQuantity: (medicineId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "pharmacy_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = useCallback(
    (medicine: MedicineListItem, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.medicine.id === medicine.id);
        if (existing) {
          return prev.map((i) =>
            i.medicine.id === medicine.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, 20) }
              : i,
          );
        }
        return [...prev, { medicine, quantity }];
      });
    },
    [],
  );

  const removeFromCart = useCallback((medicineId: number) => {
    setItems((prev) => prev.filter((i) => i.medicine.id !== medicineId));
  }, []);

  const updateQuantity = useCallback(
    (medicineId: number, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((i) => i.medicine.id !== medicineId),
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.medicine.id === medicineId
            ? { ...i, quantity: Math.min(quantity, 20) }
            : i,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + Number(i.medicine.price) * i.quantity,
    0,
  );

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx)
    throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
