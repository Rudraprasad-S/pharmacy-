import { useState } from "react";
import { Link } from "react-router-dom";
import { trackOrders, advanceTracking } from "../lib/api";
import type { OrderResponse } from "../types/medicine";

const ALL_STAGES = [
  "Order Placed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function TrackOrderPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await trackOrders(phone);
      setOrders(res.orders);
      setSearched(true);
    } catch {
      setError("Failed to fetch orders. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceTracking = async (orderId: number) => {
    try {
      const updated = await advanceTracking(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o)),
      );
    } catch {
      setError("Failed to advance tracking.");
    }
  };

  const getStageIndex = (stage: string) => {
    return ALL_STAGES.indexOf(stage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-gray-500 hover:text-gray-700 transition">
            ← Home
          </Link>
          <h1 className="text-xl font-bold text-gray-900">📦 Track Orders</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Find Your Orders
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter the phone number you used during checkout to view your orders.
          </p>
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {/* Results */}
        {searched && !loading && orders.length === 0 && !error && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500">No orders found for this phone number.</p>
            <p className="text-gray-400 text-sm mt-1">
              Make sure you entered the same number used during checkout.
            </p>
          </div>
        )}

        {/* Order list */}
        {orders.map((order) => {
          const currentIdx = getStageIndex(order.tracking_stage);
          const isDelivered = order.tracking_stage === "Delivered";

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-4"
            >
              {/* Order header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.order_status)}`}
                >
                  {order.order_status.toUpperCase()}
                </span>
              </div>

              {/* Order details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Medicine</p>
                    <p className="font-medium text-gray-900">{order.medicine_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Qty × Price</p>
                    <p className="font-medium text-gray-900">
                      {order.quantity} × ₹{Number(order.price_per_unit).toFixed(2)}
                    </p>
                  </div>
                  {order.brand_name && (
                    <div>
                      <p className="text-gray-400 text-xs uppercase">Brand</p>
                      <p className="font-medium text-gray-900">{order.brand_name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Total</p>
                    <p className="font-bold text-blue-600">
                      ₹{Number(order.total_price).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Payment</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {order.payment_method} · {order.payment_status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking timeline */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Tracking Status
                </h4>
                <div className="relative">
                  {ALL_STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={stage} className="flex items-start gap-3 pb-4 last:pb-0">
                        {/* Connector line */}
                        {idx < ALL_STAGES.length - 1 && (
                          <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200"
                            style={{
                              background:
                                idx < currentIdx
                                  ? "linear-gradient(to bottom, #22c55e, #22c55e)"
                                  : "#e5e7eb",
                              top: idx === 0 ? "24px" : "0",
                            }}
                          />
                        )}

                        {/* Dot */}
                        <div
                          className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? isCurrent
                                ? "bg-blue-600 ring-4 ring-blue-100"
                                : "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        >
                          {isCompleted && !isCurrent && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {isCurrent && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>

                        {/* Label */}
                        <div className="flex-1 pt-0.5">
                          <p
                            className={`text-sm font-medium ${
                              isCompleted ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {stage}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-blue-600 mt-0.5">Current status</p>
                          )}
                          {isCompleted && !isCurrent && (
                            <p className="text-xs text-green-600 mt-0.5">Completed</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tracking history list */}
              {order.tracking_history.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Timeline
                  </h4>
                  <div className="space-y-2">
                    {order.tracking_history.map((event, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-gray-400 shrink-0">
                          {new Date(event.timestamp).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-gray-600">{event.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advance tracking button (demo) */}
              {!isDelivered && (
                <button
                  onClick={() => handleAdvanceTracking(order.id)}
                  className="mt-4 w-full border-2 border-dashed border-gray-300 text-gray-500 py-2 rounded-lg text-sm hover:border-blue-400 hover:text-blue-600 transition"
                >
                  ⏭ Simulate Next Stage (Demo)
                </button>
              )}

              {isDelivered && (
                <div className="mt-4 bg-green-50 text-green-700 text-sm rounded-lg p-3 text-center font-medium">
                  ✅ Your order has been delivered!
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
