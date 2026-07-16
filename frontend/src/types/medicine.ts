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

// ── Order types ───────────────────────────────────────────────────────────

export interface TrackingEvent {
  stage: string;
  timestamp: string;
  description: string;
}

export interface OrderResponse {
  id: number;
  customer_name: string;
  customer_phone: string;
  medicine_name: string;
  brand_name: string | null;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  tracking_stage: string;
  tracking_history: TrackingEvent[];
  created_at: string;
  updated_at: string;
}

export interface OrderListResponse {
  orders: OrderResponse[];
  total: number;
}

export interface CheckoutItem {
  medicine_id: number;
  brand_name?: string;
  quantity: number;
}

export interface CheckoutRequest {
  customer_name: string;
  customer_phone: string;
  items: CheckoutItem[];
  payment_method: string;
  otp_code: string;
}

export interface SendOTPResponse {
  message: string;
  otp_code: string | null; // Demo only — the actual OTP code
  expires_in_seconds: number;
}

export interface VerifyOTPResponse {
  verified: boolean;
  message: string;
}
