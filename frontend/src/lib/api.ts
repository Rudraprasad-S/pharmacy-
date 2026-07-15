/** API client for the Pharmacy backend. */
import axios from "axios";
import type {
  Category,
  Brand,
  MedicineDetail,
  PaginatedMedicines,
} from "../types/medicine";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export interface MedicineListParams {
  q?: string;
  category?: string;
  age_group?: string;
  in_stock?: boolean;
  page?: number;
  page_size?: number;
}

export async function fetchMedicines(
  params: MedicineListParams,
): Promise<PaginatedMedicines> {
  const { data } = await api.get<PaginatedMedicines>("/api/medicines", {
    params,
  });
  return data;
}

export async function fetchMedicine(id: number): Promise<MedicineDetail> {
  const { data } = await api.get<MedicineDetail>(`/api/medicines/${id}`);
  return data;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/api/categories");
  return data;
}

export async function fetchBrands(): Promise<Brand[]> {
  const { data } = await api.get<Brand[]>("/api/brands");
  return data;
}
