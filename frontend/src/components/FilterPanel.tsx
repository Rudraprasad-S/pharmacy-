import type { Category } from "../types/medicine";

interface Props {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedAgeGroup: string;
  onAgeGroupChange: (value: string) => void;
  selectedInStock: boolean | undefined;
  onInStockChange: (value: boolean | undefined) => void;
}

const AGE_GROUPS = [
  { label: "All Ages", value: "" },
  { label: "Adult", value: "adult" },
  { label: "Child", value: "child" },
  { label: "Infant", value: "infant" },
];

export default function FilterPanel({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedAgeGroup,
  onAgeGroupChange,
  selectedInStock,
  onInStockChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category filter */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Age group filter */}
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
        {AGE_GROUPS.map((ag) => (
          <button
            key={ag.value}
            onClick={() => onAgeGroupChange(ag.value)}
            className={`px-3 py-2 text-sm transition-colors ${
              selectedAgeGroup === ag.value
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {ag.label}
          </button>
        ))}
      </div>

      {/* In stock toggle */}
      <button
        onClick={() =>
          onInStockChange(
            selectedInStock === true ? undefined : true
          )
        }
        className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
          selectedInStock === true
            ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
      >
        {selectedInStock === true ? "✓ In Stock Only" : "In Stock Only"}
      </button>

      {/* Clear filters */}
      {(selectedCategory || selectedAgeGroup || selectedInStock !== undefined) && (
        <button
          onClick={() => {
            onCategoryChange("");
            onAgeGroupChange("");
            onInStockChange(undefined);
          }}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
