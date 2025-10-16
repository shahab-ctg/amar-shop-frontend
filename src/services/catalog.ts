// src/services/catalog.ts
import  apiGet  from "@/lib/api";
import {
  ZCategoriesResponse,
  ZProductsResponse,
  ZOkProduct,
  ZOkCategory,
  type CategoriesResponse,
  type ProductsResponse,
} from "@/lib/schemas";

export async function fetchCategories(): Promise<CategoriesResponse> {
  const endpoints = ["/categories", "/admin/categories", "/api/v1/categories"];
  for (const ep of endpoints) {
    try {
      const json = await apiGet(ep);
      const parsed = ZCategoriesResponse.safeParse(json);
      if (parsed.success) {
        console.log("✅ Categories from", ep);
        return parsed.data;
      }
    } catch (e) {
      console.log("❌", ep, "failed");
    }
  }
  return { ok: false, data: [] };
}

export async function fetchProducts(params?: {
  category?: string;
  page?: number;
  limit?: number;
  q?: string;
  discounted?: "true" | "false";
}): Promise<ProductsResponse> {
  const sp = new URLSearchParams();
  if (params?.category) sp.set("category", params.category);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));
  if (params?.q) sp.set("q", params.q);
  if (params?.discounted) sp.set("discounted", params.discounted);

  try {
    const json = await apiGet(`/products${sp.size ? `?${sp}` : ""}`);
    return ZProductsResponse.parse(json);
  } catch {
    return { ok: false, data: [], pageInfo: undefined };
  }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const json = await apiGet(`/products/${slug}`);
    const parsed = ZOkProduct.safeParse(json);
    return parsed.success ? parsed.data.data : null;
  } catch {
    return null;
  }
}

export async function fetchCategoryBySlug(slug: string) {
  try {
    const json = await apiGet(`/categories/${slug}`);
    const parsed = ZOkCategory.safeParse(json);
    return parsed.success ? parsed.data.data : null;
  } catch {
    return null;
  }
}
