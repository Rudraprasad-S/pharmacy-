import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-12 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add medicines from the browse page to get started.
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🛒 Shopping Cart ({totalItems} items)
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 transition"
          >
            Clear All
          </button>
        </div>

        {/* Cart items */}
        <div className="space-y-3 mb-6">
          {items.map(({ medicine, quantity }) => (
            <div
              key={medicine.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {medicine.name}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {medicine.category_name}
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                  ₹{Number(medicine.price).toFixed(2)}
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(medicine.id, quantity - 1)}
                  className="w-7 h-7 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(medicine.id, quantity + 1)}
                  className="w-7 h-7 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-gray-900 dark:text-white">
                  ₹{(Number(medicine.price) * quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(medicine.id)}
                className="text-red-400 hover:text-red-600 transition p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky bottom-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400">Total ({totalItems} items)</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div>
          <Link
            to={`/checkout-multi`}
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Proceed to Checkout →
          </Link>
        </div>
      </main>
    </div>
  );
}
