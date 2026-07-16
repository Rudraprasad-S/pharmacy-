import { useMedicines } from "../hooks/useMedicines";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import MedicineCard from "../components/MedicineCard";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function MedicineList() {
  const { medicines, categories, total, page, totalPages, loading, error, search, setSearch, category, setCategory, ageGroup, setAgeGroup, inStock, setInStock, setPage } = useMedicines();

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-navy-950 transition-colors font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* AI Banner */}
        <div className="mb-6 bg-gradient-to-r from-navy-800 via-navy-700 to-navy-500 rounded-2xl p-4 sm:p-5 text-white shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-semibold text-lg">🤖 AI Health Assistant</p>
              <p className="text-sm text-blue-100">Describe your symptoms — get instant medicine recommendations</p>
            </div>
            <Link to="/ai-chat" className="bg-white text-navy-800 px-4 py-2 rounded-xl font-medium text-sm hover:bg-blue-50 transition">Ask AI →</Link>
          </div>
        </div>

        <div className="mb-4"><SearchBar value={search} onChange={setSearch} /></div>
        <div className="mb-4"><FilterPanel categories={categories} selectedCategory={category} onCategoryChange={setCategory} selectedAgeGroup={ageGroup} onAgeGroupChange={setAgeGroup} selectedInStock={inStock} onInStockChange={setInStock} /></div>

        {!loading && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{total} medicine{total !== 1 ? "s" : ""} found</p>}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-navy-800 bg-white dark:bg-navy-900 p-5 animate-pulse">
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-navy-800 rounded mb-3" />
                <div className="h-4 w-full bg-gray-100 dark:bg-navy-800 rounded mb-2" />
                <div className="h-4 w-2/3 bg-gray-100 dark:bg-navy-800 rounded mb-4" />
                <div className="flex justify-between"><div className="h-6 w-20 bg-gray-200 dark:bg-navy-800 rounded" /><div className="h-6 w-16 bg-gray-200 dark:bg-navy-800 rounded-full" /></div>
              </div>
            ))}
          </div>
        )}

        {error && <div className="text-center py-12"><p className="text-red-500 text-lg">{error}</p></div>}

        {!loading && !error && (
          medicines.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-400 text-lg">No medicines found</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicines.map((m) => <MedicineCard key={m.id} medicine={m} />)}
            </div>
          )
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </main>
    </div>
  );
}
