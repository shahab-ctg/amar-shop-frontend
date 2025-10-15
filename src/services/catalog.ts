
import { apiGet, ZCategoriesResponse, ZProductsResponse } from "@/lib/api";

export async function fetchCategories() {
  const json = await apiGet<any>("/api/v1/categories");
  return ZCategoriesResponse.parse(json).data.filter(
    (c) => c.status === "ACTIVE"
  );
}

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
  discounted?: "true" | "false";
}) {
  const usp = new URLSearchParams();
  if (params?.page) usp.set("page", String(params.page));
  if (params?.limit) usp.set("limit", String(params.limit));
  if (params?.category) usp.set("category", params.category);
  if (params?.q) usp.set("q", params.q);
  if (params?.discounted) usp.set("discounted", params.discounted);
  const json = await apiGet<any>(
    `/api/v1/products${usp.size ? `?${usp}` : ""}`
  );
  return ZProductsResponse.parse(json);
}

export async function fetchProductBySlug(slug: string) {
  const json = await apiGet<any>(`/api/v1/products/${slug}`);
  return z.object({ ok: z.boolean(), data: ZProduct }).parse(json).data;
}
