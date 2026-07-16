import type { Category } from "../types/medicine";
interface Props { categories: Category[]; selectedCategory: string; onCategoryChange: (v: string) => void; selectedAgeGroup: string; onAgeGroupChange: (v: string) => void; selectedInStock: boolean | undefined; onInStockChange: (v: boolean | undefined) => void; }
const AGES = [{ label: "All Ages", value: "" },{ label: "Adult", value: "adult" },{ label: "Child", value: "child" },{ label: "Infant", value: "infant" }];

export default function FilterPanel({ categories, selectedCategory, onCategoryChange, selectedAgeGroup, onAgeGroupChange, selectedInStock, onInStockChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className="rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:border-navy-500 focus:ring-1 focus:ring-navy-500 outline-none transition-colors">
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
      </select>
      <div className="flex rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden">
        {AGES.map((ag) => (
          <button key={ag.value} onClick={() => onAgeGroupChange(ag.value)} className={`px-3 py-2 text-sm transition-colors ${selectedAgeGroup === ag.value ? "bg-navy-500 text-white" : "bg-white dark:bg-navy-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800"}`}>{ag.label}</button>
        ))}
      </div>
      <button onClick={() => onInStockChange(selectedInStock === true ? undefined : true)} className={`rounded-xl border px-3 py-2 text-sm transition-colors ${selectedInStock === true ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800"}`}>{selectedInStock === true ? "✓ In Stock Only" : "In Stock Only"}</button>
      {(selectedCategory || selectedAgeGroup || selectedInStock !== undefined) && <button onClick={() => { onCategoryChange(""); onAgeGroupChange(""); onInStockChange(undefined); }} className="text-sm text-navy-500 hover:underline">Clear filters</button>}
    </div>
  );
}
