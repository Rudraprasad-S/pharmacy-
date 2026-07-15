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
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Age group filter */}
      <div className="flex rounded-lg border border-gray-300 overflow-hidden">
        {AGE_GROUPS.map((ag) => (
          <button
            key={ag.value}
            onClick={() => onAgeGroupChange(ag.value)}
            className={`px-3 py-2 text-sm transition ${
              selectedAgeGroup === ag.value
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
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
        className={`rounded-lg border px-3 py-2 text-sm transition ${
          selectedInStock === true
            ? "border-green-500 bg-green-50 text-green-700"
            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
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
          className="text-sm text-blue-600 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
