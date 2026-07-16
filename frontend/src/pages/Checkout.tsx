import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchMedicine, sendOTP, verifyOTP, checkout } from "../lib/api";
import type { MedicineDetail } from "../types/medicine";
import Navbar from "../components/Navbar";

const STAGES = ["cart","otp","payment","done"] as const; type Stage = typeof STAGES[number];
const cls = "w-full border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-navy-500 outline-none transition-colors";

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>(); const nav = useNavigate();
  const [m, setM] = useState<MedicineDetail|null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState<string|null>(null);
  const [stage, setStage] = useState<Stage>("cart");
  const [cname, setCname] = useState(""); const [cphone, setCphone] = useState(""); const [qty, setQty] = useState(1);
  const [brand, setBrand] = useState(""); const [pm, setPm] = useState("card");
  const [otp, setOtp] = useState(""); const [demoOtp, setDemoOtp] = useState<string|null>(null);
  const [otpSent, setOtpSent] = useState(false); const [otpErr, setOtpErr] = useState<string|null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [oids, setOids] = useState<number[]>([]);

  useEffect(() => { if(!id) return; fetchMedicine(Number(id)).then(setM).catch(()=>setError("Not found")).finally(()=>setLoading(false)); }, [id]);
  useEffect(() => { if(otpTimer<=0) return; const i = setInterval(()=>setOtpTimer((t)=>{if(t<=1){clearInterval(i);return 0}return t-1}),1000); return ()=>clearInterval(i); }, [otpTimer]);

  if(loading) return <div className="min-h-screen bg-[#f8fafd]"><Navbar/><div className="max-w-lg mx-auto px-4 py-6"><div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded"/><div className="h-4 w-96 bg-gray-100 rounded"/><div className="h-40 bg-gray-100 rounded"/></div></div></div>;
  if(error||!m) return <div className="min-h-screen bg-[#f8fafd] flex items-center justify-center"><div className="text-center"><p className="text-red-500">{error||"Not found"}</p><Link to="/" className="mt-4 inline-block text-navy-500 hover:underline">← Back</Link></div></div>;

  const tp = Number(m.price) * qty;
  const send = async () => { if(!cphone||cphone.length<10){setOtpErr("Enter valid phone.");return} setOtpErr(null); try { const r = await sendOTP(cphone); setOtpSent(true); setOtpTimer(300); if(r.otp_code) setDemoOtp(r.otp_code); else { const ms = r.message.match(/\d{6}/g); if(ms&&ms.length) setDemoOtp(ms[ms.length-1]); } } catch { setOtpErr("Failed to send OTP."); } };
  const verify = async () => { if(!otp||otp.length!==6){setOtpErr("Enter 6-digit OTP.");return} setOtpErr(null); try { const r = await verifyOTP(cphone,otp); if(r.verified) setStage("payment"); } catch { setOtpErr("Invalid OTP."); } };
  const place = async () => { try { const o = await checkout({customer_name:cname,customer_phone:cphone,items:[{medicine_id:m.id,brand_name:brand||undefined,quantity:qty}],payment_method:pm,otp_code:otp}); setOids(o.map(x=>x.id)); setStage("done"); } catch(ex:any){ setOtpErr(ex?.response?.data?.detail||"Order failed."); } };
  const si = STAGES.indexOf(stage);

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 font-sans"><Navbar />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6"><div className="flex items-center justify-between">{STAGES.slice(0,-1).map((s,i)=><div key={s} className="flex items-center flex-1 last:flex-none"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i<=si-1?"bg-green-500 text-white":i===si?"bg-navy-500 text-white":"bg-gray-200 text-gray-500"}`}>{i<si-1?"✓":i+1}</div>{i<STAGES.length-2&&<div className={`flex-1 h-1 mx-2 rounded ${i<si-1?"bg-green-500":"bg-gray-200"}`}/>}<span className="text-xs text-gray-500 ml-1 capitalize">{s}</span></div>)}</div></div>

        {stage==="cart"&&<div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Summary</h2>
          <div className="bg-gray-50 dark:bg-navy-800 rounded-xl p-4"><h3 className="font-medium text-gray-900 dark:text-white">{m.name}</h3><p className="text-sm text-gray-500">{m.purpose.slice(0,80)}...</p><div className="flex justify-between items-center mt-3"><p className="text-2xl font-bold text-navy-500">₹{Number(m.price).toFixed(2)}</p><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.in_stock?"bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400":"bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>{m.in_stock?"In Stock":"Out"}</span></div></div>
          {m.brands.length>0&&<div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label><select value={brand} onChange={(e)=>setBrand(e.target.value)} className={cls}><option value="">Default (₹{Number(m.price).toFixed(2)})</option>{m.brands.map((b,i)=><option key={i} value={b.brand_name}>{b.brand_name} by {b.manufacturer} — ₹{Number(b.price).toFixed(2)}</option>)}</select></div>}
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qty</label><div className="flex items-center gap-2"><button onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100">−</button><span className="w-10 text-center font-semibold text-gray-900 dark:text-white">{qty}</span><button onClick={()=>setQty(q=>Math.min(20,q+1))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100">+</button></div></div>
          <div className="border-t border-gray-100 dark:border-navy-800 pt-4"><div className="flex justify-between"><span className="text-gray-500">Total</span><span className="text-2xl font-bold text-navy-500">₹{tp.toFixed(2)}</span></div></div>
          <input type="text" placeholder="Full Name" value={cname} onChange={(e)=>setCname(e.target.value)} className={cls} />
          <input type="tel" placeholder="Phone Number" value={cphone} onChange={(e)=>setCphone(e.target.value.replace(/\D/g,"").slice(0,10))} className={cls} />
          <button onClick={()=>{if(!cname.trim()){setOtpErr("Enter name.");return}if(!cphone||cphone.length<10){setOtpErr("Enter valid phone.");return}setStage("otp")}} disabled={!m.in_stock} className="w-full bg-navy-500 text-white py-3 rounded-xl font-semibold hover:bg-navy-800 transition disabled:opacity-50">{m.in_stock?"Proceed to OTP":"Out of Stock"}</button>
        </div>}

        {stage==="otp"&&<div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">OTP Verification</h2>
          <p className="text-sm text-gray-500">OTP sent to <strong>+91{cphone}</strong>.</p>
          {demoOtp&&<div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center"><p className="text-xs text-amber-600 mb-1">🔧 Demo OTP:</p><p className="text-2xl font-mono font-bold text-amber-800 tracking-[0.3em]">{demoOtp}</p></div>}
          {!otpSent?<button onClick={send} className="w-full bg-navy-500 text-white py-3 rounded-xl font-semibold hover:bg-navy-800 transition">Send OTP</button>:<div className="space-y-3">
            <input type="text" inputMode="numeric" maxLength={6} placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} className="w-full border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 rounded-xl px-3 py-2 text-center tracking-widest text-lg font-mono focus:ring-2 focus:ring-navy-500 outline-none" />
            <div className="flex justify-between text-sm"><span className="text-gray-500">{otpTimer>0?`Expires ${Math.floor(otpTimer/60)}:${String(otpTimer%60).padStart(2,"0")}`:"Expired"}</span><button onClick={send} className="text-navy-500 hover:underline" disabled={otpTimer>240}>Resend</button></div>
            <button onClick={verify} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">Verify OTP</button>
          </div>}
          {otpErr&&<div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm rounded-xl p-3">{otpErr}</div>}
          <button onClick={()=>setStage("cart")} className="w-full text-gray-500 py-2 text-sm">← Back</button>
        </div>}

        {stage==="payment"&&<div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment</h2>
          <div className="bg-gray-50 dark:bg-navy-800 rounded-xl p-4"><div className="flex justify-between text-sm"><span className="text-gray-500">Item</span><span className="font-medium text-gray-900 dark:text-white">{m.name}</span></div><div className="flex justify-between text-sm mt-1"><span className="text-gray-500">Qty</span><span>x{qty}</span></div><div className="flex justify-between text-sm mt-1 pt-2 border-t border-gray-100 dark:border-navy-700"><span className="font-semibold">Total</span><span className="font-bold text-navy-500">₹{tp.toFixed(2)}</span></div></div>
          {[["card","💳 Card"],["upi","📱 UPI"],["netbanking","🏦 Net Banking"],["cod","💰 Cash on Delivery"]].map(([v,l])=><label key={v} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${pm===v?"border-navy-500 bg-blue-50 dark:bg-navy-800":"border-gray-200 dark:border-navy-700 hover:border-gray-300"}`}><input type="radio" name="pm" value={v} checked={pm===v} onChange={(e)=>setPm(e.target.value)} className="accent-navy-500"/><p className="font-medium text-gray-900 dark:text-white">{l}</p></label>)}
          {otpErr&&<div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm rounded-xl p-3">{otpErr}</div>}
          <button onClick={place} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">Place Order — ₹{tp.toFixed(2)}</button>
          <button onClick={()=>setStage("otp")} className="w-full text-gray-500 py-2 text-sm">← Back</button>
        </div>}

        {stage==="done"&&<div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm p-6 text-center space-y-4">
          <div className="text-5xl">✅</div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Confirmed!</h2>
          <p className="text-gray-500">{oids.map(oid=><span key={oid} className="block text-navy-500 font-mono">Order #{oid}</span>)}</p>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-left"><p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Summary</p><p className="text-sm text-green-700 dark:text-green-400">{m.name} × {qty}</p><p className="text-sm text-green-700 dark:text-green-400">Total: ₹{tp.toFixed(2)}</p><p className="text-sm text-green-700 dark:text-green-400">Payment: {pm.toUpperCase()}</p><p className="text-sm text-green-700 dark:text-green-400">Phone: +91{cphone}</p></div>
          <button onClick={()=>nav("/orders/track")} className="w-full bg-navy-500 text-white py-3 rounded-xl font-semibold hover:bg-navy-800 transition">Track Your Order</button>
          <Link to="/" className="block text-gray-500 py-2 text-sm">Continue Shopping</Link>
        </div>}
      </main>
    </div>
  );
}
