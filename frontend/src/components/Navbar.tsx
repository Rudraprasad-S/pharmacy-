import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";

export default function Navbar() {
  const { totalItems } = useCart();
  const { items: wishItems } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const [dark, setDark] = useState(() => localStorage.getItem("pharmacy_dark") === "true");
  const toggleDark = useCallback(() => {
    setDark((p) => { const n = !p; localStorage.setItem("pharmacy_dark", String(n)); return n; });
  }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  const isActive = (path: string) => location.pathname === path ? "text-navy-500 font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-navy-500";

  return (
    <header className="bg-white dark:bg-navy-950 border-b border-gray-100 dark:border-navy-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-navy-800 dark:text-white">
            <span className="w-8 h-8 bg-gradient-to-br from-navy-500 to-navy-800 rounded-lg flex items-center justify-center text-white text-sm">✦</span>
            Starsup
          </Link>
          <nav className="hidden sm:flex items-center gap-5 text-sm">
            <Link to="/" className={isActive("/")}>Browse</Link>
            <Link to="/ai-chat" className={isActive("/ai-chat")}>🤖 AI</Link>
            <Link to="/landing" className={isActive("/landing")}>Landing</Link>
            <Link to="/orders/track" className={isActive("/orders/track")}>📦 Track</Link>
            {wishItems.length > 0 && (
              <Link to="/wishlist" className={isActive("/wishlist")}>
                ❤️ <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">{wishItems.length}</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <Link to="/admin" className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-lg font-medium hover:bg-amber-200 transition">⚙️ Admin</Link>
              )}
              <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400 font-medium">👤 {user.name.split(" ")[0]}</span>
              <button onClick={logout} className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-navy-500 px-2 py-1 transition">Sign In</Link>
              <Link to="/register" className="text-sm bg-navy-500 text-white px-3 py-1 rounded-lg hover:bg-navy-800 transition">Register</Link>
            </div>
          )}

          <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-lg" title={dark ? "Light" : "Dark"}>{dark ? "☀️" : "🌙"}</button>

          <Link to="/cart" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition relative">
            🛒{totalItems > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-navy-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{totalItems}</span>}
          </Link>

          <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 dark:border-navy-800 bg-white dark:bg-navy-950 px-4 pb-4">
          <Link to="/" className="block py-2 text-gray-600 dark:text-gray-300">Browse</Link>
          <Link to="/ai-chat" className="block py-2 text-gray-600 dark:text-gray-300">🤖 AI</Link>
          <Link to="/landing" className="block py-2 text-gray-600 dark:text-gray-300">Landing</Link>
          <Link to="/orders/track" className="block py-2 text-gray-600 dark:text-gray-300">📦 Track</Link>
          {wishItems.length > 0 && <Link to="/wishlist" className="block py-2 text-gray-600 dark:text-gray-300">❤️ Wishlist ({wishItems.length})</Link>}
          <Link to="/cart" className="block py-2 text-gray-600 dark:text-gray-300">🛒 Cart ({totalItems})</Link>
        </div>
      )}
    </header>
  );
}
