/** Custom hook for fetching medicines with search and filters. */
import { useState, useEffect, useCallback, useRef } from "react";
import type { MedicineListItem } from "../types/medicine";
import { fetchMedicines, fetchCategories, type MedicineListParams } from "../lib/api";
import type { Category } from "../types/medicine";

export function useMedicines() {
  const [medicines, setMedicines] = useState<MedicineListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [inStock, setInStock] = useState<boolean | undefined>(undefined);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const loadMedicines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: MedicineListParams = {
        page,
        page_size: pageSize,
      };
      if (debouncedSearch) params.q = debouncedSearch;
      if (category) params.category = category;
      if (ageGroup) params.age_group = ageGroup;
      if (inStock !== undefined) params.in_stock = inStock;

      const result = await fetchMedicines(params);
      setMedicines(result.data);
      setTotal(result.total);
    } catch (err) {
      setError("Failed to load medicines. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, category, ageGroup, inStock]);

  // Load categories once
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Load medicines whenever filters/page change
  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  const totalPages = Math.ceil(total / pageSize);

  return {
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
    reload: loadMedicines,
  };
}
