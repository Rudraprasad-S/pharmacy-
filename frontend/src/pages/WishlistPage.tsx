import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  if (items.length === 0) return <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 font-sans"><Navbar /><main className="max-w-3xl mx-auto px-4 py-12 text-center"><div className="text-5xl mb-4">❤️</div><h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Empty wishlist</h2><Link to="/" className="inline-block bg-navy-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy-800 transition">Browse</Link></main></div>;

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 font-sans"><Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">❤️ Wishlist ({items.length})</h1>
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-4 flex items-center gap-4">
              <div className="flex-1"><Link to={`/medicine/${m.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-navy-500">{m.name}</Link><p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{m.purpose}</p><p className="text-lg font-bold text-navy-500 mt-1">₹{Number(m.price).toFixed(2)}</p></div>
              <button onClick={() => { addToCart(m, 1); removeFromWishlist(m.id); }} className="px-3 py-1.5 text-sm rounded-xl bg-navy-500 text-white hover:bg-navy-800 transition">Move to Cart</button>
              <button onClick={() => removeFromWishlist(m.id)} className="text-red-400 hover:text-red-600 p-2">✕</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
