// src/services/catalog.ts
import {
  ZCategoriesResponse,
  ZProductsResponse,
  ZOkProduct,
  ZProduct,
} from "@/lib/schemas";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API) throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");

type Query = Record<string, string | number | boolean | undefined | null>;

function buildURL(path: string, params?: Query) {
  const usp = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).length > 0) {
        usp.set(k, String(v));
      }
    });
  }
  return `${API}${path}${usp.toString() ? `?${usp.toString()}` : ""}`;
}

async function getJSON<T>(path: string, params?: Query): Promise<T> {
  const res = await fetch(buildURL(path, params), {
    method: "GET",
    headers: { "content-type": "application/json" },
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

/** ---------- Helpers: normalize any products response shape ---------- */
function normalizeProductsShape(raw: unknown): { arr: unknown[]; pageInfo?: unknown } {
  let arr: unknown[] = [];
  let pageInfo: unknown | undefined = undefined;

  const rawObj = raw as Record<string, unknown>;
  const rawData = rawObj?.data;

  if (Array.isArray(rawData)) {
    arr = rawData;
    pageInfo = rawObj?.pageInfo;
  } else if (rawData && typeof rawData === "object") {
    const box = rawData as Record<string, unknown>;

    arr =
      (box.docs as unknown[]) ??
      (box.items as unknown[]) ??
      (box.data as unknown[]) ??
      (box.results as unknown[]) ??
      (Object.values(box).find((v) => Array.isArray(v)) as unknown[]) ??
      [];

    const pSrc = (rawObj.pageInfo as Record<string, unknown>) || {
      page: box.page,
      limit: box.limit,
      total: box.total,
      hasNext: box.hasNext,
    };
    if (
      pSrc &&
      (typeof pSrc.page === "number" || typeof pSrc.limit === "number")
    ) {
      pageInfo = pSrc;
    }
  } else {
    const maybe = raw && typeof raw === "object" ? Object.values(raw) : [];

    const firstArr = (maybe as unknown[]).find((v) => Array.isArray(v)) ?? [];
    arr = Array.isArray(firstArr) ? firstArr : [];
  }

  if (!Array.isArray(arr)) arr = [];
  return { arr, pageInfo };
}

/** ---------------- Public APIs (Shop) ---------------- */
export async function fetchCategories() {
  const raw = await getJSON<unknown>("/categories");
  const parsed = ZCategoriesResponse.parse(raw);
  const data = parsed.data.filter((c) => c.status === "ACTIVE");
  return { ok: true as const, data };
}

export type ProductsQuery = {
  q?: string;
  category?: string;
  discounted?: "true" | "false";
  limit?: number;
  page?: number;
  status?: "ACTIVE" | "DRAFT" | "HIDDEN";
  sort?: string;
};

export async function fetchProducts(query?: ProductsQuery) {
  //  clamp/remove invalid limit to avoid 400
  let limit = query?.limit;
  if (typeof limit === "number") {
    if (!Number.isFinite(limit) || limit <= 0) {
      limit = undefined;
    } else if (limit > 60) {
      limit = 60;
    }
  }

  const params: Query = {
    ...query,
    limit, // ← sanitized
    status: query?.status ?? "ACTIVE",
  };

  // Try fetch
  let raw: unknown;
  try {
    raw = await getJSON<unknown>("/products", params);
  } catch (e: unknown) {
    // যদি limit-জনিত 400 আসে, fallback: limit বাদ দিয়ে আবার চেষ্টা
    const error = e as {message?: string};
    if (
      String(error?.message || "").includes('"limit"') ||
      String(error?.message || "").includes("VALIDATION_ERROR")
    ) {
      raw = await getJSON<unknown>("/products", { ...params, limit: undefined });
    } else {
      throw e;
    }
  }

  // strict → fallback normalize
  let dataArr: unknown[] = [];
  let pageInfo: unknown | undefined = undefined;

  try {
    const parsed = ZProductsResponse.parse(raw);
    dataArr = parsed.data;
    pageInfo = parsed.pageInfo;
  } catch {
    const norm = normalizeProductsShape(raw);
    dataArr = norm.arr;
    pageInfo = norm.pageInfo;
  }

  const validated = dataArr
    .map((item) => {
      const res = ZProduct.safeParse(item);
      return res.success ? res.data : null;
    })
    .filter(Boolean) as Array<ReturnType<typeof ZProduct.parse>>;

  let data = validated.filter((p) => p.status === "ACTIVE");

  if (query?.discounted === "true") {
    data = data.filter(
      (p) => p.isDiscounted === true || (p.compareAtPrice ?? 0) > p.price
    );
  }

  if (!query?.sort && data.length > 0) {
    const firstItem = data[0] as Record<string, unknown>;
    if ("createdAt" in firstItem) {
      data = [...data].sort((a, b) => {
        const aDate = (a as Record<string, unknown>).createdAt;
        const bDate = (b as Record<string, unknown>).createdAt;

        if (aDate === bDate) return 0;
        if (typeof aDate === "string" && typeof bDate === "string") {
          return aDate > bDate ? -1 : 1;
        }
        return 0;
      });
    }
  }

  if (limit && data.length > limit) {
    data = data.slice(0, limit);
  }

  return { ok: true as const, data, pageInfo };
}

export async function fetchProduct(slug: string) {
  const raw = await getJSON<unknown>(`/products/${slug}`);
  const parsed = ZOkProduct.parse(raw);
  return { ok: true as const, data: parsed.data };
}
