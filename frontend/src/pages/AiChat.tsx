import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { aiChat } from "../lib/api";

interface AiMed { id: number; name: string; price: number; purpose: string; category_name: string; }

export default function AiChatPage() {
  const [q, setQ] = useState(""); const [res, setRes] = useState<{response:string;medicines:AiMed[];category:string|null}|null>(null);
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string|null>(null);

  const ask = async (query: string) => { setLoading(true); setError(null); try { const r = await aiChat(query); setRes(r); } catch { setError("Failed. Backend running?"); } finally { setLoading(false); } };
  const quick = ["Headache","Cold and cough","Acidity","Skin rash","Fever","Allergy","Constipation","Joint pain"];

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 font-sans"><Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🤖 AI Health Assistant</h1>
        <p className="text-sm text-gray-500 mb-4">Describe your symptoms for medicine recommendations.</p>
        <div className="flex flex-wrap gap-2 mb-4">{quick.map((s) => <button key={s} onClick={() => { setQ(s); ask(s); }} className="px-3 py-1.5 text-sm rounded-full bg-blue-50 dark:bg-navy-800 text-navy-500 border border-blue-200 dark:border-navy-700 hover:bg-blue-100 dark:hover:bg-navy-700 transition">{s}</button>)}</div>
        <div className="flex gap-2 mb-6"><input type="text" placeholder='e.g., "I have a headache and fever"' value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key==="Enter"&&ask(q)} className="flex-1 border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-navy-500 outline-none transition-colors" /><button onClick={() => ask(q)} disabled={loading||!q.trim()} className="bg-navy-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy-800 transition disabled:opacity-50">{loading?"...":"Ask"}</button></div>
        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl p-3 text-sm mb-4">{error}</div>}
        {res && (
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">{res.response}</p>
            {res.medicines.length > 0 && <div className="space-y-2">{res.medicines.map((m) => <Link key={m.id} to={`/medicine/${m.id}`} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-navy-800 hover:bg-blue-50 dark:hover:bg-navy-700 transition border border-gray-100 dark:border-navy-700"><div><p className="font-medium text-gray-900 dark:text-white">{m.name}</p><p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{m.purpose}</p></div><div className="text-right"><p className="font-bold text-navy-500">₹{Number(m.price).toFixed(2)}</p><p className="text-xs text-gray-400">{m.category_name}</p></div></Link>)}</div>}
            {!res.medicines.length && res.category===null && <p className="text-sm text-gray-400">Try different keywords.</p>}
          </div>
        )}
      </main>
    </div>
  );
}
