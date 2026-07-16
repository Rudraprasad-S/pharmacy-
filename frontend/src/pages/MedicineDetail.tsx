import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMedicine } from "../lib/api";
import type { MedicineDetail } from "../types/medicine";
import Navbar from "../components/Navbar";

export default function MedicineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [m, setM] = useState<MedicineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchMedicine(Number(id)).then(setM).catch(() => setError("Medicine not found")).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950"><Navbar /><div className="max-w-3xl mx-auto px-4 py-6"><div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 dark:bg-navy-800 rounded" /><div className="h-4 w-96 bg-gray-100 dark:bg-navy-800 rounded" /><div className="h-24 bg-gray-100 dark:bg-navy-800 rounded" /></div></div></div>;
  if (error || !m) return <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 flex items-center justify-center"><div className="text-center"><p className="text-red-500 text-lg">{error || "Not found"}</p><Link to="/" className="mt-4 inline-block text-navy-500 hover:underline">← Back</Link></div></div>;

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 font-sans">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm p-6">
          <div className="flex items-start justify-between gap-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{m.name}</h2>
            <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${m.in_stock ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>{m.in_stock ? "In Stock" : "Out"}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{m.purpose}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-navy-800 rounded-xl p-3"><p className="text-xs text-gray-400 uppercase">Price</p><p className="text-xl font-bold text-navy-500">₹{Number(m.price).toFixed(2)}</p></div>
            <div className="bg-gray-50 dark:bg-navy-800 rounded-xl p-3"><p className="text-xs text-gray-400 uppercase">Age</p><p className="text-lg font-semibold text-gray-800 dark:text-gray-200 capitalize">{m.age_group}</p></div>
            <div className="bg-gray-50 dark:bg-navy-800 rounded-xl p-3"><p className="text-xs text-gray-400 uppercase">Category</p><p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{m.category.name}</p></div>
          </div>
          {m.brands.length > 0 && (
            <div className="mb-6"><h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Available Brands</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-gray-200 dark:border-navy-800 text-left"><th className="pb-2 font-medium text-gray-500">Brand</th><th className="pb-2 font-medium text-gray-500">Manufacturer</th><th className="pb-2 font-medium text-gray-500 text-right">Price</th></tr></thead><tbody>{m.brands.map((b, i) => <tr key={i} className="border-b border-gray-100 dark:border-navy-800 last:border-0"><td className="py-2 font-medium text-gray-800 dark:text-gray-200">{b.brand_name}</td><td className="py-2 text-gray-500 dark:text-gray-400">{b.manufacturer}</td><td className="py-2 text-right font-medium text-navy-500">₹{Number(b.price).toFixed(2)}</td></tr>)}</tbody></table></div>
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-navy-800">
            {m.in_stock ? <Link to={`/checkout/${m.id}`} className="block w-full bg-navy-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-navy-800 transition">🛒 Buy Now — ₹{Number(m.price).toFixed(2)}</Link> : <button disabled className="block w-full bg-gray-300 text-gray-500 text-center py-3 rounded-xl font-semibold cursor-not-allowed">Out of Stock</button>}
          </div>
        </div>
      </main>
    </div>
  );
}
