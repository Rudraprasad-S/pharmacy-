import { Link } from "react-router-dom";
import type { MedicineListItem } from "../types/medicine";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

interface Props {
  medicine: MedicineListItem;
}

export default function MedicineCard({ medicine }: Props) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const liked = isWishlisted(medicine.id);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600">
      <Link to={`/medicine/${medicine.id}`} className="block p-5 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
            {medicine.name}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              medicine.in_stock
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}
          >
            {medicine.in_stock ? "In Stock" : "Out"}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {medicine.purpose}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            ₹{Number(medicine.price).toFixed(2)}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full px-2 py-0.5">
            {medicine.category_name}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span className="capitalize">{medicine.age_group}</span>
        </div>
      </Link>

      {/* Action buttons */}
      <div className="flex border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(medicine);
          }}
          className={`flex-1 py-2.5 text-sm font-medium transition ${
            liked
              ? "text-red-500 bg-red-50 dark:bg-red-900/20"
              : "text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          }`}
          title={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          {liked ? "❤️" : "🤍"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (medicine.in_stock) addToCart(medicine, 1);
          }}
          disabled={!medicine.in_stock}
          className="flex-1 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          🛒 Add
        </button>
      </div>
    </div>
  );
}
