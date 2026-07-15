import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMedicine } from "../lib/api";
import type { MedicineDetail } from "../types/medicine";

export default function MedicineDetail() {
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<MedicineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchMedicine(Number(id))
      .then(setMedicine)
      .catch(() => setError("Medicine not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-96 bg-gray-100 rounded" />
            <div className="h-4 w-72 bg-gray-100 rounded" />
            <div className="h-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || "Medicine not found"}</p>
          <Link
            to="/"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            ← Back to medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            Medicine Details
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {/* Title and availability */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {medicine.name}
            </h2>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
                medicine.in_stock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {medicine.in_stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Purpose */}
          <p className="text-gray-600 mb-6">{medicine.purpose}</p>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Price</p>
              <p className="text-xl font-bold text-blue-600">
                ₹{Number(medicine.price).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Age Group</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">
                {medicine.age_group}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Category</p>
              <p className="text-lg font-semibold text-gray-800">
                {medicine.category.name}
              </p>
            </div>
          </div>

          {/* Brands table */}
          {medicine.brands.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Available Brands
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="pb-2 font-medium text-gray-500">Brand</th>
                      <th className="pb-2 font-medium text-gray-500">
                        Manufacturer
                      </th>
                      <th className="pb-2 font-medium text-gray-500 text-right">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicine.brands.map((mb, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-2 font-medium text-gray-800">
                          {mb.brand_name}
                        </td>
                        <td className="py-2 text-gray-500">
                          {mb.manufacturer}
                        </td>
                        <td className="py-2 text-right font-medium text-blue-600">
                          ₹{Number(mb.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No brands */}
          {medicine.brands.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              No specific brands listed for this medicine.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
