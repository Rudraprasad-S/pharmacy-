import { useMedicines } from "../hooks/useMedicines";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import MedicineCard from "../components/MedicineCard";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";

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
          <p className="text-sm text-gray-500 mb-4">
            {total} medicine{total !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse"
              >
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-3" />
                <div className="h-4 w-full bg-gray-100 rounded mb-2" />
                <div className="h-4 w-2/3 bg-gray-100 rounded mb-4" />
                <div className="flex justify-between">
                  <div className="h-6 w-20 bg-gray-200 rounded" />
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <p className="text-gray-400 text-sm mt-2">
              Make sure the FastAPI server is running on port 8000
            </p>
          </div>
        )}

        {/* Medicine grid */}
        {!loading && !error && (
          <>
            {medicines.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No medicines found</p>
                <p className="text-gray-400 text-sm mt-1">
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
