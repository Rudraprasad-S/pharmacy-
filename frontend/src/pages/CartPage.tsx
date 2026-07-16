import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  if (items.length === 0) return <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 font-sans"><Navbar /><main className="max-w-3xl mx-auto px-4 py-12 text-center"><div className="text-5xl mb-4">🛒</div><h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2><p className="text-gray-500 mb-6">Add medicines from browse.</p><Link to="/" className="inline-block bg-navy-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy-800 transition">Browse Medicines</Link></main></div>;

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 font-sans"><Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">🛒 Cart ({totalItems})</h1><button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700">Clear All</button></div>
        <div className="space-y-3 mb-6">
          {items.map(({ medicine, quantity }) => (
            <div key={medicine.id} className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-4 flex items-center gap-4">
              <div className="flex-1"><h3 className="font-semibold text-gray-900 dark:text-white truncate">{medicine.name}</h3><p className="text-xs text-gray-400 mt-0.5">{medicine.category_name}</p><p className="text-lg font-bold text-navy-500 mt-1">₹{Number(medicine.price).toFixed(2)}</p></div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(medicine.id, quantity - 1)} className="w-7 h-7 rounded-lg border border-gray-200 dark:border-navy-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-navy-800 text-gray-600 dark:text-gray-300">−</button>
                <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">{quantity}</span>
                <button onClick={() => updateQuantity(medicine.id, quantity + 1)} className="w-7 h-7 rounded-lg border border-gray-200 dark:border-navy-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-navy-800 text-gray-600 dark:text-gray-300">+</button>
              </div>
              <div className="text-right min-w-[80px]"><p className="font-bold text-gray-900 dark:text-white">₹{(Number(medicine.price) * quantity).toFixed(2)}</p></div>
              <button onClick={() => removeFromCart(medicine.id)} className="text-red-400 hover:text-red-600 p-1">✕</button>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-6 sticky bottom-4">
          <div className="flex justify-between items-center mb-4"><span className="text-gray-500">Total</span><span className="text-2xl font-bold text-navy-500">₹{totalPrice.toFixed(2)}</span></div>
          <Link to="/checkout-multi" className="block w-full bg-navy-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-navy-800 transition">Proceed to Checkout →</Link>
        </div>
      </main>
    </div>
  );
}
