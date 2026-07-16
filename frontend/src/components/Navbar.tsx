import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState, useEffect, useCallback } from "react";

export default function Navbar() {
  const { totalItems } = useCart();
  const { items: wishItems } = useWishlist();
  const location = useLocation();

  // Dark mode
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("pharmacy_dark") === "true";
  });

  const toggleDark = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("pharmacy_dark", String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-blue-600 dark:text-blue-400 font-semibold"
      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400";

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + nav */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition"
          >
            💊 Pharmacy
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link to="/" className={isActive("/")}>
              Browse
            </Link>
            <Link to="/orders/track" className={isActive("/orders/track")}>
              📦 Track
            </Link>
            {wishItems.length > 0 && (
              <Link to="/wishlist" className={isActive("/wishlist")}>
                ❤️ Wishlist
                <span className="ml-1 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                  {wishItems.length}
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Cart, dark mode */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-lg"
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {/* Wishlist (mobile) */}
          <Link
            to="/wishlist"
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
          >
            ❤️
            {wishItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {wishItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
