/** API client for the Pharmacy backend. */
import axios from "axios";
import type {
  Category,
  Brand,
  MedicineDetail,
  PaginatedMedicines,
  OrderResponse,
  OrderListResponse,
  CheckoutRequest,
  SendOTPResponse,
  VerifyOTPResponse,
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

// ── OTP ───────────────────────────────────────────────────────────────────

export async function sendOTP(phone_number: string): Promise<SendOTPResponse> {
  const { data } = await api.post<SendOTPResponse>("/api/otp/send", {
    phone_number,
  });
  return data;
}

export async function verifyOTP(
  phone_number: string,
  otp_code: string,
): Promise<VerifyOTPResponse> {
  const { data } = await api.post<VerifyOTPResponse>("/api/otp/verify", {
    phone_number,
    otp_code,
  });
  return data;
}

// ── Orders ────────────────────────────────────────────────────────────────

export async function checkout(
  payload: CheckoutRequest,
): Promise<OrderResponse[]> {
  const { data } = await api.post<OrderResponse[]>(
    "/api/orders/checkout",
    payload,
  );
  return data;
}

export async function trackOrders(
  phone_number: string,
): Promise<OrderListResponse> {
  const { data } = await api.post<OrderListResponse>("/api/orders/track", {
    phone_number,
  });
  return data;
}

export async function getOrder(order_id: number): Promise<OrderResponse> {
  const { data } = await api.get<OrderResponse>(`/api/orders/${order_id}`);
  return data;
}

export async function advanceTracking(
  order_id: number,
): Promise<OrderResponse> {
  const { data } = await api.patch<OrderResponse>(
    `/api/orders/${order_id}/tracking`,
  );
  return data;
}
