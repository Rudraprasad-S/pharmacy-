import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchMedicine, sendOTP, verifyOTP, checkout } from "../lib/api";
import type { MedicineDetail } from "../types/medicine";

const STAGES = ["cart", "otp", "payment", "done"] as const;
type Stage = (typeof STAGES)[number];

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState<MedicineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [stage, setStage] = useState<Stage>("cart");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  // OTP state
  const [otpCode, setOtpCode] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Result state
  const [orderIds, setOrderIds] = useState<number[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchMedicine(Number(id))
      .then(setMedicine)
      .catch(() => setError("Medicine not found"))
      .finally(() => setLoading(false));
  }, [id]);

  // OTP timer
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-lg mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-96 bg-gray-100 rounded" />
            <div className="h-40 bg-gray-100 rounded" />
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
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to medicines
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = Number(medicine.price) * quantity;

  const handleSendOTP = async () => {
    if (!customerPhone || customerPhone.length < 10) {
      setOtpError("Please enter a valid phone number.");
      return;
    }
    setOtpError(null);
    try {
      const res = await sendOTP(customerPhone);
      setOtpSent(true);
      setOtpTimer(300);
      // Demo: extract OTP from message and show in UI
      const match = res.message.match(/\d{6}/);
      if (match) {
        setDemoOtp(match[0]);
      }
    } catch {
      setOtpError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    setOtpError(null);
    try {
      const res = await verifyOTP(customerPhone, otpCode);
      if (res.verified) {
        setOtpVerified(true);
        setStage("payment");
      }
    } catch {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orders = await checkout({
        customer_name: customerName,
        customer_phone: customerPhone,
        items: [
          {
            medicine_id: medicine.id,
            brand_name: selectedBrand || undefined,
            quantity,
          },
        ],
        payment_method: paymentMethod,
        otp_code: otpCode,
      });
      setOrderIds(orders.map((o) => o.id));
      setStage("done");
    } catch (err: any) {
      setOtpError(
        err?.response?.data?.detail || "Order failed. Please try again.",
      );
    }
  };

  // Progress indicator
  const stageIdx = STAGES.indexOf(stage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <Link to={`/medicine/${medicine.id}`} className="text-gray-500 hover:text-gray-700">
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {STAGES.slice(0, -1).map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= stageIdx - 1
                      ? "bg-green-500 text-white"
                      : i === stageIdx
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < stageIdx - 1 ? "✓" : i + 1}
                </div>
                {i < STAGES.length - 2 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      i < stageIdx - 1 ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
                <span className="text-xs text-gray-500 ml-1 capitalize">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stage: Cart */}
        {stage === "cart" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">{medicine.name}</h3>
              <p className="text-sm text-gray-500">{medicine.purpose.slice(0, 80)}...</p>
              <div className="flex justify-between items-center mt-3">
                <p className="text-2xl font-bold text-blue-600">₹{Number(medicine.price).toFixed(2)}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    medicine.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {medicine.in_stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Brand selector */}
            {medicine.brands.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Brand (optional)
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Default (₹{Number(medicine.price).toFixed(2)})</option>
                  {medicine.brands.map((b, i) => (
                    <option key={i} value={b.brand_name}>
                      {b.brand_name} by {b.manufacturer} — ₹{Number(b.price).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-bold text-blue-600">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Customer info */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number (10 digits)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => {
                if (!customerName.trim()) {
                  setOtpError("Please enter your name.");
                  return;
                }
                if (!customerPhone || customerPhone.length < 10) {
                  setOtpError("Please enter a valid 10-digit phone number.");
                  return;
                }
                setStage("otp");
              }}
              disabled={!medicine.in_stock}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {medicine.in_stock ? "Proceed to OTP Verification" : "Out of Stock"}
            </button>
          </div>
        )}

        {/* Stage: OTP */}
        {stage === "otp" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">OTP Verification</h2>
            <p className="text-sm text-gray-500">
              We'll send a 6-digit OTP to <strong>+91{customerPhone}</strong> for verification.
            </p>

            {/* Demo OTP banner */}
            {demoOtp && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                <p className="text-xs text-amber-600 mb-1">🔧 Demo Mode — OTP is:</p>
                <p className="text-2xl font-mono font-bold text-amber-800 tracking-[0.3em]">{demoOtp}</p>
              </div>
            )}

            {!otpSent ? (
              <button
                onClick={handleSendOTP}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Send OTP
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center tracking-widest text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {otpTimer > 0 ? `Expires in ${Math.floor(otpTimer / 60)}:${String(otpTimer % 60).padStart(2, "0")}` : "OTP expired"}
                  </span>
                  <button
                    onClick={handleSendOTP}
                    className="text-blue-600 hover:underline"
                    disabled={otpTimer > 240}
                  >
                    Resend
                  </button>
                </div>
                <button
                  onClick={handleVerifyOTP}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  Verify OTP
                </button>
              </div>
            )}

            {otpError && (
              <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">
                {otpError}
              </div>
            )}

            <button
              onClick={() => setStage("cart")}
              className="w-full text-gray-500 py-2 hover:text-gray-700 transition text-sm"
            >
              ← Back to cart
            </button>
          </div>
        )}

        {/* Stage: Payment */}
        {stage === "payment" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>

            {/* Order summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Item</span>
                <span className="font-medium">{medicine.name}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Quantity</span>
                <span className="font-medium">x{quantity}</span>
              </div>
              <div className="flex justify-between text-sm mt-1 pt-2 border-t">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-blue-600">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment options */}
            <div className="space-y-2">
              {[
                { value: "card", label: "💳 Credit/Debit Card", desc: "Visa, Mastercard, RuPay" },
                { value: "upi", label: "📱 UPI", desc: "Google Pay, PhonePe, Paytm" },
                { value: "netbanking", label: "🏦 Net Banking", desc: "All major banks" },
                { value: "cod", label: "💰 Cash on Delivery", desc: "Pay when you receive" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                    paymentMethod === opt.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-blue-600"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {otpError && (
              <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">
                {otpError}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Place Order — ₹{totalPrice.toFixed(2)}
            </button>

            <button
              onClick={() => setStage("otp")}
              className="w-full text-gray-500 py-2 hover:text-gray-700 transition text-sm"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Stage: Done */}
        {stage === "done" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center space-y-4">
            <div className="text-5xl mb-2">✅</div>
            <h2 className="text-xl font-bold text-gray-900">Order Confirmed!</h2>
            <p className="text-gray-500">
              Your order has been placed successfully.
              {orderIds.map((oid) => (
                <span key={oid} className="block text-blue-600 font-mono mt-1">
                  Order #{oid}
                </span>
              ))}
            </p>

            <div className="bg-green-50 rounded-lg p-4 text-left">
              <p className="text-sm font-medium text-green-800 mb-2">Order Summary</p>
              <p className="text-sm text-green-700">{medicine.name} × {quantity}</p>
              <p className="text-sm text-green-700">Total: ₹{totalPrice.toFixed(2)}</p>
              <p className="text-sm text-green-700">Payment: {paymentMethod.toUpperCase()}</p>
              <p className="text-sm text-green-700">Phone: +91{customerPhone}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => navigate("/orders/track")}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Track Your Order
              </button>
              <Link
                to="/"
                className="block w-full text-gray-500 py-2 hover:text-gray-700 transition text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
