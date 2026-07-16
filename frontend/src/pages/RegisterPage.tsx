import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const cls = "w-full border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-colors";

export default function RegisterPage() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => { e.preventDefault(); setError(null); if (!name.trim()) { setError("Please enter your name."); return; } if (password.length < 6) { setError("Password must be at least 6 characters."); return; } setLoading(true); try { await register(email, name, password); navigate("/"); } catch (err: any) { setError(err?.response?.data?.detail || err?.message || "Registration failed"); } finally { setLoading(false); } };

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 font-sans"><Navbar />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md"><div className="text-center mb-8"><Link to="/" className="text-3xl font-bold text-navy-800 dark:text-white">💊 Starsup</Link><p className="text-gray-500 mt-2">Create your account</p></div>
          <form onSubmit={handle} className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm p-6 space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label><input type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className={cls} /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={cls} /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label><input type="password" required placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className={cls} /></div>
            {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl p-3">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-navy-500 text-white py-3 rounded-xl font-semibold hover:bg-navy-800 transition disabled:opacity-50">{loading ? "Creating..." : "Create Account"}</button>
            <p className="text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-navy-500 hover:underline">Sign In</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}
