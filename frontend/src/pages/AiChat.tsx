import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { aiChat } from "../lib/api";

interface AiMedicine {
  id: number;
  name: string;
  price: number;
  purpose: string;
  category_name: string;
}

interface AiResponse {
  response: string;
  medicines: AiMedicine[];
  category: string | null;
}

export default function AiChatPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<AiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await aiChat(query);
      setResponse(res);
    } catch {
      setError("Failed to get AI response. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const quickSymptoms = [
    "Headache",
    "Cold and cough",
    "Acidity",
    "Skin rash",
    "Fever",
    "Allergy",
    "Constipation",
    "Joint pain",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🤖 AI Health Assistant
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Describe your symptoms and I'll recommend medicines from our catalog.
        </p>

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickSymptoms.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                // Auto-search on click
                aiChat(s)
                  .then(setResponse)
                  .catch(() => {});
              }}
              className="px-3 py-1.5 text-sm rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 transition"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder='e.g., "I have a headache and fever"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !query.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {response.response}
            </p>

            {response.medicines.length > 0 && (
              <div className="space-y-2">
                {response.medicines.map((m) => (
                  <Link
                    key={m.id}
                    to={`/medicine/${m.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition border border-gray-100 dark:border-gray-700"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {m.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                        {m.purpose}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 dark:text-blue-400">
                        ₹{Number(m.price).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {m.category_name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!response.medicines.length && response.category === null && (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Try browsing categories or use different keywords.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
