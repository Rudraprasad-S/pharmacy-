import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-12 text-center">
          <div className="text-5xl mb-4">❤️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Tap the heart icon on any medicine to save it here.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Browse Medicines
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ❤️ Wishlist ({items.length} items)
        </h1>

        <div className="space-y-3">
          {items.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <Link
                  to={`/medicine/${m.id}`}
                  className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition truncate block"
                >
                  {m.name}
                </Link>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                  {m.purpose}
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                  ₹{Number(m.price).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    addToCart(m, 1);
                    removeFromWishlist(m.id);
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(m.id)}
                  className="text-red-400 hover:text-red-600 transition p-2"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
