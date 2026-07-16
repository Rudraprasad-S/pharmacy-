import { useState } from "react";

/* ── Reusable Icons ───────────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const CrossIcon = () => (
  <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg className={`w-4 h-4 ${filled ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ── Product data ─────────────────────────────────────────────────────── */
const products = [
  { name: "Panadol Xtra", tagline: "Fast-Acting Pain Relief", dosage: "500mg Tablets", rating: 4.5, purchases: 2340, price: 12.99, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
  { name: "Cold-FX", tagline: "Daily Immune Support", dosage: "60 Capsules", rating: 4.2, purchases: 1890, price: 24.99, img: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=200&h=200&fit=crop" },
  { name: "Nyquil Liquid", tagline: "Nighttime Cold & Flu", dosage: "354ml Bottle", rating: 4.7, purchases: 3120, price: 15.49, img: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=200&h=200&fit=crop" },
  { name: "Aller-Ease", tagline: "24hr Allergy Relief", dosage: "30 Tablets", rating: 4.3, purchases: 1560, price: 18.99, img: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=200&h=200&fit=crop" },
];

/* ── Pricing data ──────────────────────────────────────────────────────── */
const regularPlan = { name: "Regular Plan", price: 19.99, features: ["Primary care consultations", "Basic lab tests", "Annual health checkup", "Prescription discounts"] };
const premiumPlan = { name: "Premium Plan", price: 49.99, features: ["All Regular benefits", "Specialist referrals", "Advanced diagnostics", "24/7 telemedicine", "Dental & vision coverage", "Family coverage (up to 4)"] };
const allFeatures = [...new Set([...regularPlan.features, ...premiumPlan.features])];

/* ── Components ───────────────────────────────────────────────────────── */

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Home", "Products", "Plans", "About", "Contact"];
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2 text-xl font-bold text-[#12378C]">
          <span className="w-8 h-8 bg-gradient-to-br from-[#2E73F6] to-[#12378C] rounded-lg flex items-center justify-center text-white text-sm">✦</span>
          Starsup
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {links.map((l) => <a key={l} href="#" className="hover:text-[#2E73F6] transition-colors">{l}</a>)}
        </nav>
        <div className="flex items-center gap-3">
          <button className="hidden md:block bg-[#2E73F6] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#12378C] transition-colors shadow-md shadow-blue-500/20">Get Started</button>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
          {links.map((l) => <a key={l} href="#" className="block py-2 text-gray-600 hover:text-[#2E73F6]">{l}</a>)}
          <button className="mt-2 w-full bg-[#2E73F6] text-white px-5 py-2.5 rounded-full text-sm font-semibold">Get Started</button>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#12378C] via-[#1a4ba8] to-[#2E73F6] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-white/20" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
            Expert Care, Every Step Of The Way
          </h1>
          <p className="mt-4 text-blue-100 text-lg max-w-xl mx-auto">Choose the plan that fits your health needs. Affordable, transparent, and built around you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Regular Plan */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800">{regularPlan.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900">${regularPlan.price}</span>
              <span className="text-gray-400 text-sm">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {allFeatures.map((f) => {
                const has = regularPlan.features.includes(f);
                return (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    {has ? <CheckIcon /> : <CrossIcon />}
                    <span className={has ? "text-gray-700" : "text-gray-400 line-through"}>{f}</span>
                  </li>
                );
              })}
            </ul>
            <button className="mt-6 w-full bg-[#2E73F6] text-white py-3 rounded-xl font-semibold hover:bg-[#12378C] transition-colors">Choose Plan</button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-[#2E73F6] relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2E73F6] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">Popular</span>
            <h3 className="text-lg font-semibold text-gray-800">{premiumPlan.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900">${premiumPlan.price}</span>
              <span className="text-gray-400 text-sm">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {allFeatures.map((f) => {
                const has = premiumPlan.features.includes(f);
                return (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    {has ? <CheckIcon /> : <CrossIcon />}
                    <span className={has ? "text-gray-700" : "text-gray-400 line-through"}>{f}</span>
                  </li>
                );
              })}
            </ul>
            <button className="mt-6 w-full bg-[#2E73F6] text-white py-3 rounded-xl font-semibold hover:bg-[#12378C] transition-colors">Choose Plan</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: typeof products[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 flex items-center justify-center mb-4">
        <img src={p.img} alt={p.name} className="w-28 h-28 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform" loading="lazy" />
      </div>
      <h4 className="font-semibold text-gray-900">{p.name}</h4>
      <p className="text-xs text-gray-400 mt-0.5">{p.tagline}</p>
      <p className="text-xs font-medium text-blue-600 mt-1">{p.dosage}</p>
      <div className="flex items-center gap-1 mt-2">
        {[1,2,3,4,5].map((s) => <StarIcon key={s} filled={s <= Math.round(p.rating)} />)}
        <span className="text-xs text-gray-400 ml-1">{p.rating}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">{p.purchases.toLocaleString()}+ purchases</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <span className="text-xl font-bold text-gray-900">${p.price}</span>
        <button className="bg-[#2E73F6] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#12378C] transition-colors">Buy Now</button>
      </div>
    </div>
  );
}

function ProductsSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Advanced Medicine And Equipment</h2>
          <button className="hidden sm:block text-sm font-medium text-[#2E73F6] border border-[#2E73F6] px-4 py-2 rounded-full hover:bg-blue-50 transition-colors">View All Products</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.name} p={p} />)}
        </div>
        <button className="sm:hidden mt-6 w-full text-sm font-medium text-[#2E73F6] border border-[#2E73F6] px-4 py-2 rounded-full">View All Products</button>
      </div>
    </section>
  );
}

function VideoSection() {
  return (
    <section className="bg-[#f8fafd] py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dedicated To Your Well-Being</h2>
        <p className="mt-3 text-gray-500 max-w-xl mx-auto">Our team of expert physicians is committed to providing compassionate, personalized care for you and your family.</p>
        <div className="mt-8 relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop" alt="Doctor consulting patient" className="w-full h-64 sm:h-80 lg:h-96 object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-[#2E73F6] ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-6">
        {/* Dark CTA */}
        <div className="bg-[#0f1a3a] rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold leading-snug">Let's Invest In Your Health Without Breaking The Bank</h3>
            <p className="mt-2 text-sm text-gray-300">Affordable plans designed to keep you and your family covered.</p>
          </div>
          <button className="mt-6 bg-white text-[#0f1a3a] font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors self-start">Subscribe Now</button>
        </div>
        {/* Blue CTA */}
        <div className="bg-[#2E73F6] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start gap-4 justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-bold leading-snug">Download And Register Now, It's Free!</h3>
            <p className="mt-2 text-sm text-blue-100">Get the app and manage your health on the go.</p>
            <button className="mt-6 bg-white text-[#2E73F6] font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">Download Our App</button>
          </div>
          <div className="hidden sm:block relative z-10 -mb-8 -mr-4">
            <div className="w-32 h-56 bg-black rounded-2xl border-4 border-gray-800 overflow-hidden shadow-xl">
              <div className="h-6 bg-gray-800" />
              <div className="p-3 space-y-2">
                <div className="h-2 bg-blue-400 rounded w-3/4" /><div className="h-2 bg-blue-300 rounded w-1/2" />
                <div className="h-6 bg-blue-500 rounded mt-2" /><div className="h-6 bg-blue-400 rounded" />
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute left-0 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0f1a3a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="w-8 h-8 bg-gradient-to-br from-[#2E73F6] to-blue-400 rounded-lg flex items-center justify-center text-sm">✦</span>
              Starsup
            </div>
            <p className="mt-2 text-sm text-gray-400 max-w-md">Your trusted partner in healthcare. We provide accessible, quality medical solutions for everyone.</p>
            <p className="mt-1 text-xs text-gray-500">© {new Date().getFullYear()} Starsup Healthcare. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-3">
            {["facebook", "twitter", "instagram", "linkedin"].map((s) => (
              <a key={s} href="#" aria-label={s} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <span className="text-sm uppercase font-bold">{s[0]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Main Export ──────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="font-sans text-gray-900 antialiased">
      <Header />
      <HeroSection />
      <ProductsSection />
      <VideoSection />
      <CTASection />
      <Footer />
    </div>
  );
}
