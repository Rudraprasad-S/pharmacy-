import { useMedicines } from "../hooks/useMedicines";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import MedicineCard from "../components/MedicineCard";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function MedicineList() {
  const {
    medicines,
    categories,
    total,
    page,
    totalPages,
    loading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    ageGroup,
    setAgeGroup,
    inStock,
    setInStock,
    setPage,
  } = useMedicines();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* AI Banner */}
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-semibold">🤖 AI Health Assistant</p>
              <p className="text-sm text-blue-100">Describe your symptoms — get instant medicine recommendations</p>
            </div>
            <Link
              to="/ai-chat"
              className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition"
            >
              Ask AI →
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FilterPanel
            categories={categories}
            selectedCategory={category}
            onCategoryChange={setCategory}
            selectedAgeGroup={ageGroup}
            onAgeGroupChange={setAgeGroup}
            selectedInStock={inStock}
            onInStockChange={setInStock}
          />
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {total} medicine{total !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 animate-pulse"
              >
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded mb-2" />
                <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-800 rounded mb-4" />
                <div className="flex justify-between">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Make sure the FastAPI server is running on port 8000
            </p>
          </div>
        )}

        {/* Medicine grid */}
        {!loading && !error && (
          <>
            {medicines.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 dark:text-gray-500 text-lg">No medicines found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicines.map((med) => (
                  <MedicineCard key={med.id} medicine={med} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}
