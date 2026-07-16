import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { MedicineListItem } from "../types/medicine";

interface WishlistContextType {
  items: MedicineListItem[];
  addToWishlist: (medicine: MedicineListItem) => void;
  removeFromWishlist: (medicineId: number) => void;
  isWishlisted: (medicineId: number) => boolean;
  toggleWishlist: (medicine: MedicineListItem) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);
const WISH_KEY = "pharmacy_wishlist";

function load(): MedicineListItem[] {
  try {
    return JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MedicineListItem[]>(load);

  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = useCallback((m: MedicineListItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === m.id)) return prev;
      return [...prev, m];
    });
  }, []);

  const removeFromWishlist = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isWishlisted = useCallback(
    (id: number) => items.some((i) => i.id === id),
    [items],
  );

  const toggleWishlist = useCallback(
    (m: MedicineListItem) => {
      if (items.some((i) => i.id === m.id)) {
        removeFromWishlist(m.id);
      } else {
        addToWishlist(m);
      }
    },
    [items, addToWishlist, removeFromWishlist],
  );

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx)
    throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
