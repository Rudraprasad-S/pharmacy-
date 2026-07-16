import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { trackOrders, advanceTracking } from "../lib/api";
import type { OrderResponse } from "../types/medicine";
import Navbar from "../components/Navbar";

const ALL_STAGES = ["Order Placed","Processing","Packed","Shipped","Out for Delivery","Delivered"];

export default function TrackOrderPage() {
  const [phone, setPhone] = useState(""); const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null); const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!phone || phone.length < 10) { setError("Enter valid 10-digit number."); return; }
    setLoading(true); setError(null);
    try { const res = await trackOrders(phone); setOrders(res.orders); setSearched(true); } catch { setError("Failed. Backend running?"); } finally { setLoading(false); }
  };

  const advance = async (id: number) => {
    try { const u = await advanceTracking(id); setOrders((p) => p.map((o) => o.id === id ? u : o)); } catch { setError("Failed to advance."); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 font-sans"><Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Find Your Orders</h2>
          <div className="flex gap-2">
            <input type="tel" placeholder="10-digit phone number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} onKeyDown={(e) => e.key==="Enter"&&search()} className="flex-1 border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-navy-500 outline-none transition-colors" />
            <button onClick={search} disabled={loading} className="bg-navy-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-navy-800 transition disabled:opacity-50">{loading?"...":"Track"}</button>
          </div>
        </div>
        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl p-3 text-sm mb-4">{error}</div>}
        {searched && !loading && orders.length === 0 && !error && <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-8 text-center"><div className="text-4xl mb-3">🔍</div><p className="text-gray-500">No orders found.</p></div>}
        {orders.map((o) => {
          const ci = ALL_STAGES.indexOf(o.tracking_stage);
          return (
            <div key={o.id} className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm p-6 mb-4">
              <div className="flex justify-between mb-4"><div><h3 className="font-semibold text-gray-900 dark:text-white">Order #{o.id}</h3><p className="text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</p></div><span className="rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">{o.order_status}</span></div>
              <div className="bg-gray-50 dark:bg-navy-800 rounded-xl p-4 mb-4"><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-gray-400 uppercase">Medicine</p><p className="font-medium text-gray-900 dark:text-white">{o.medicine_name}</p></div><div><p className="text-xs text-gray-400 uppercase">Qty × Price</p><p className="font-medium text-gray-900 dark:text-white">{o.quantity} × ₹{Number(o.price_per_unit).toFixed(2)}</p></div><div><p className="text-xs text-gray-400 uppercase">Total</p><p className="font-bold text-navy-500">₹{Number(o.total_price).toFixed(2)}</p></div><div><p className="text-xs text-gray-400 uppercase">Payment</p><p className="font-medium capitalize">{o.payment_method} · {o.payment_status}</p></div></div></div>
              <div className="relative">
                {ALL_STAGES.map((s, i) => { const done = i <= ci; const cur = i === ci;
                  return <div key={s} className="flex items-start gap-3 pb-4 last:pb-0">
                    {i < ALL_STAGES.length - 1 && <div className="absolute left-[11px] top-6 bottom-0 w-0.5" style={{background:i<ci?"#22c55e":"#e5e7eb",top:i===0?"24px":"0"}} />}
                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${done?(cur?"bg-navy-500 ring-4 ring-blue-100":"bg-green-500"):"bg-gray-300"}`}>{done&&!cur&&<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}{cur&&<div className="w-2 h-2 bg-white rounded-full"/>}</div>
                    <div className="flex-1 pt-0.5"><p className={`text-sm font-medium ${done?"text-gray-900 dark:text-white":"text-gray-400"}`}>{s}</p>{cur&&<p className="text-xs text-navy-500 mt-0.5">Current</p>}{done&&!cur&&<p className="text-xs text-green-600 mt-0.5">Done</p>}</div>
                  </div>;
                })}
              </div>
              {o.tracking_stage !== "Delivered" && <button onClick={() => advance(o.id)} className="mt-4 w-full border-2 border-dashed border-gray-200 dark:border-navy-700 text-gray-500 py-2 rounded-xl text-sm hover:border-navy-400 hover:text-navy-500 transition">⏭ Simulate Next Stage (Demo)</button>}
              {o.tracking_stage === "Delivered" && <div className="mt-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm rounded-xl p-3 text-center font-medium">✅ Delivered!</div>}
            </div>
          );
        })}
      </main>
    </div>
  );
}
