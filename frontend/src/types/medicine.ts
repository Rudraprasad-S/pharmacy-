/** Shared type definitions for the pharmacy app. */

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Brand {
  id: number;
  name: string;
  manufacturer: string;
}

export interface MedicineBrand {
  brand_name: string;
  manufacturer: string;
  price: number;
}

export interface MedicineListItem {
  id: number;
  name: string;
  purpose: string;
  age_group: string;
  price: number;
  in_stock: boolean;
  category_name: string;
}

export interface MedicineDetail {
  id: number;
  name: string;
  purpose: string;
  age_group: string;
  price: number;
  in_stock: boolean;
  category: Category;
  brands: MedicineBrand[];
}

export interface PaginatedMedicines {
  data: MedicineListItem[];
  total: number;
  page: number;
  page_size: number;
}
