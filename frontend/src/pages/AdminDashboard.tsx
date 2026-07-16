import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });
type CatOpt = { id: number; name: string };
type Order = { id:number;customer_name:string;customer_phone:string;medicine_name:string;quantity:number;total_price:number;payment_method:string;order_status:string;tracking_stage:string;created_at:string };
const cls = "w-full border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-navy-500 outline-none transition-colors";

export default function AdminDashboard() {
  const { user, token, isAdmin } = useAuth(); const nav = useNavigate();
  useEffect(() => { if (!isAdmin) nav("/"); }, [isAdmin, nav]);
  const [tab, setTab] = useState<"orders"|"add">("orders");
  const [cats, setCats] = useState<CatOpt[]>([]);
  const [name, setName] = useState(""); const [purpose, setPurpose] = useState(""); const [age, setAge] = useState("all");
  const [price, setPrice] = useState(""); const [catId, setCatId] = useState("");
  const [msg, setMsg] = useState<string|null>(null); const [err, setErr] = useState<string|null>(null);
  const [orders, setOrders] = useState<Order[]>([]); const [loading, setLoading] = useState(false);
  const h = { Authorization: `Bearer ${token}` };
  const loadCats = useCallback(async () => { try { const { data } = await api.get("/api/admin/categories",{headers:h}); setCats(data); } catch {} }, [token]);
  const loadOrders = useCallback(async () => { setLoading(true); try { const { data } = await api.get("/api/admin/orders",{headers:h}); setOrders(data.orders); } catch {} setLoading(false); }, [token]);
  useEffect(() => { loadCats(); loadOrders(); }, [loadCats, loadOrders]);

  const add = async (e: React.FormEvent) => { e.preventDefault(); setMsg(null); setErr(null); try { const { data } = await api.post("/api/admin/medicines",{name,purpose,age_group:age,price:parseFloat(price),category_id:parseInt(catId)},{headers:h}); setMsg(data.message); setName(""); setPurpose(""); setPrice(""); setAge("all"); setCatId(""); } catch (ex:any) { setErr(ex?.response?.data?.detail||"Failed"); } };

  if (!isAdmin) return null;
  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 font-sans">
      <header className="bg-white dark:bg-navy-950 border-b border-gray-100 dark:border-navy-800"><div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between"><div className="flex items-center gap-4"><Link to="/" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">← Home</Link><h1 className="text-xl font-bold text-gray-900 dark:text-white">⚙️ Admin</h1></div><span className="text-sm text-gray-500">👤 {user?.name}</span></div></header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-2 mb-6">
          <button onClick={()=>setTab("orders")} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab==="orders"?"bg-navy-500 text-white":"bg-white dark:bg-navy-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-800"}`}>📋 Orders</button>
          <button onClick={()=>setTab("add")} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab==="add"?"bg-navy-500 text-white":"bg-white dark:bg-navy-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-800"}`}>➕ Add</button>
        </div>
        {tab==="orders"&&(
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 overflow-hidden">
            <div className="p-4 border-b border-gray-50 dark:border-navy-800"><h2 className="font-semibold">All Orders ({orders.length})</h2></div>
            {loading?<div className="p-8 text-center text-gray-400">Loading...</div>:orders.length===0?<div className="p-8 text-center text-gray-400">No orders.</div>:(
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-gray-50 dark:border-navy-800 text-left"><th className="px-4 py-3 text-gray-500 font-medium">#</th><th className="px-4 py-3 text-gray-500 font-medium">Customer</th><th className="px-4 py-3 text-gray-500 font-medium">Phone</th><th className="px-4 py-3 text-gray-500 font-medium">Medicine</th><th className="px-4 py-3 text-gray-500 font-medium">Qty</th><th className="px-4 py-3 text-gray-500 font-medium">Total</th><th className="px-4 py-3 text-gray-500 font-medium">Payment</th><th className="px-4 py-3 text-gray-500 font-medium">Status</th><th className="px-4 py-3 text-gray-500 font-medium">Date</th></tr></thead><tbody>{orders.map((o)=><tr key={o.id} className="border-b border-gray-50 dark:border-navy-800 hover:bg-gray-50 dark:hover:bg-navy-800/50"><td className="px-4 py-3 font-mono text-navy-500">#{o.id}</td><td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{o.customer_name}</td><td className="px-4 py-3 text-gray-500">{o.customer_phone}</td><td className="px-4 py-3 text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{o.medicine_name}</td><td className="px-4 py-3">x{o.quantity}</td><td className="px-4 py-3 font-semibold text-navy-500">₹{Number(o.total_price).toFixed(2)}</td><td className="px-4 py-3"><span className="text-xs bg-gray-100 dark:bg-navy-800 px-2 py-0.5 rounded-full capitalize">{o.payment_method}</span></td><td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.tracking_stage==="Delivered"?"bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400":o.tracking_stage==="Shipped"?"bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400":"bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"}`}>{o.tracking_stage}</span></td><td className="px-4 py-3 text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</td></tr>)}</tbody></table></div>
            )}
          </div>
        )}
        {tab==="add"&&(
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-6">
            <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">Add Medicine</h2>
            <form onSubmit={add} className="space-y-4 max-w-lg">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label><input required value={name} onChange={(e)=>setName(e.target.value)} className={cls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purpose</label><textarea required rows={3} value={purpose} onChange={(e)=>setPurpose(e.target.value)} className={cls} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label><input type="number" required step="0.01" min="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} className={cls} /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label><select required value={catId} onChange={(e)=>setCatId(e.target.value)} className={cls}><option value="">Select...</option>{cats.map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label><select value={age} onChange={(e)=>setAge(e.target.value)} className={cls}><option value="all">All Ages</option><option value="adult">Adult</option><option value="child">Child</option><option value="infant">Infant</option></select></div>
              {msg && <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl p-3 text-sm">✅ {msg}</div>}
              {err && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl p-3 text-sm">{err}</div>}
              <button type="submit" className="w-full bg-navy-500 text-white py-3 rounded-xl font-semibold hover:bg-navy-800 transition">Add Medicine</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
