import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

interface CategoryOption {
  id: number;
  name: string;
}

interface AdminOrder {
  id: number;
  customer_name: string;
  customer_phone: string;
  medicine_name: string;
  quantity: number;
  total_price: number;
  payment_method: string;
  order_status: string;
  tracking_stage: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin
  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  const [tab, setTab] = useState<"add" | "orders">("orders");

  // Add medicine form
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [ageGroup, setAgeGroup] = useState("all");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [addMsg, setAddMsg] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  // Orders
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const loadCategories = useCallback(async () => {
    try {
      const { data } = await api.get("/api/admin/categories", {
        headers: authHeaders,
      });
      setCategories(data);
    } catch {}
  }, [token]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/orders", {
        headers: authHeaders,
      });
      setOrders(data.orders);
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => {
    loadCategories();
    loadOrders();
  }, [loadCategories, loadOrders]);

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddMsg(null);
    setAddError(null);
    try {
      const { data } = await api.post(
        "/api/admin/medicines",
        {
          name,
          purpose,
          age_group: ageGroup,
          price: parseFloat(price),
          category_id: parseInt(categoryId),
        },
        { headers: authHeaders },
      );
      setAddMsg(data.message);
      setName("");
      setPurpose("");
      setPrice("");
      setAgeGroup("all");
      setCategoryId("");
    } catch (err: any) {
      setAddError(err?.response?.data?.detail || "Failed to add medicine");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              ← Home
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              ⚙️ Admin Dashboard
            </h1>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            👤 {user?.name} (Admin)
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "orders"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            📋 All Orders
          </button>
          <button
            onClick={() => setTab("add")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "add"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            ➕ Add Medicine
          </button>
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                All Customer Orders ({orders.length})
              </h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                No orders placed yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                      <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Order #</th>
                      <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Customer</th>
                      <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Phone</th>
                      <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Medicine</th>
                      <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Qty</th>
                      <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Total</th>
                      <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Payment</th>
                      <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                      <th className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr
                        key={o.id}
                        className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                      >
                        <td className="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">
                          #{o.id}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-gray-200 font-medium">
                          {o.customer_name}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          {o.customer_phone}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                          {o.medicine_name}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          x{o.quantity}
                        </td>
                        <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">
                          ₹{Number(o.total_price).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="capitalize text-gray-600 dark:text-gray-400 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                            {o.payment_method}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              o.tracking_stage === "Delivered"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : o.tracking_stage === "Shipped"
                                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            }`}
                          >
                            {o.tracking_stage}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">
                          {new Date(o.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add Medicine Tab */}
        {tab === "add" && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Add New Medicine
            </h2>
            <form onSubmit={handleAddMedicine} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Purpose / Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Select...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age Group
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="all">All Ages</option>
                  <option value="adult">Adult</option>
                  <option value="child">Child</option>
                  <option value="infant">Infant</option>
                </select>
              </div>

              {addMsg && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg p-3 text-sm">
                  ✅ {addMsg}
                </div>
              )}
              {addError && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-3 text-sm">
                  {addError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Add Medicine
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
