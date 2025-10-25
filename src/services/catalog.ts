// src/services/catalog.ts
import {
  ZCategoriesResponse,
  ZProductsResponse,
  ZOkProduct,
  ZProduct,
  ZCategory,
} from "@/lib/schemas";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API) throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");

type Query =
  | Record<string, string | number | boolean | undefined | null>
  | null
  | undefined;

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

/* ------------------------------ Normalizers ------------------------------ */

function normalizeProductsShape(raw: unknown): {
  arr: unknown[];
  pageInfo?: unknown;
} {
  let arr: unknown[] = [];
  let pageInfo: unknown | undefined;

  const rawObj = raw as Record<string, unknown>;
  const rawData =
    rawObj && "data" in rawObj ? (rawObj as { data: unknown }).data : undefined;

  if (Array.isArray(rawData)) {
    arr = rawData;
    pageInfo = (rawObj as Record<string, unknown>)?.pageInfo;
  } else if (rawData && typeof rawData === "object") {
    const box = rawData as Record<string, unknown>;
    arr =
      (box.items as unknown[]) ??
      (box.docs as unknown[]) ??
      (box.data as unknown[]) ??
      (box.results as unknown[]) ??
      (Object.values(box).find((v) => Array.isArray(v)) as unknown[]) ??
      [];
    const pSrc = (rawObj as Record<string, unknown>)?.pageInfo ?? {
      page: (box as Record<string, unknown>)?.page,
      limit: (box as Record<string, unknown>)?.limit,
      total: (box as Record<string, unknown>)?.total,
      hasNext: (box as Record<string, unknown>)?.hasNext,
    };
    pageInfo = pSrc;
  } else if (Array.isArray(raw)) {
    // sometimes API returns array directly at top-level
    arr = raw as unknown[];
  } else if (raw && typeof raw === "object") {
    const maybe = Object.values(raw);
    const firstArr = (maybe as unknown[]).find((v) => Array.isArray(v)) ?? [];
    arr = Array.isArray(firstArr) ? firstArr : [];
  }

  if (!Array.isArray(arr)) arr = [];
  return { arr, pageInfo };
}

function normalizeCategoriesShape(raw: unknown): unknown[] {
  // Accept: { ok, data: [] } | { data: [] } | { items: [] } | [] | { ...any array field... }
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray((obj as { data?: unknown[] }).data))
      return (obj as { data: unknown[] }).data;
    if (Array.isArray((obj as { items?: unknown[] }).items))
      return (obj as { items: unknown[] }).items;
    const arrLike = Object.values(obj).find((v) => Array.isArray(v));
    if (Array.isArray(arrLike)) return arrLike as unknown[];
  }
  if (Array.isArray(raw)) return raw as unknown[];
  return [];
}

/* --------------------------------- APIs ---------------------------------- */

export async function fetchCategories() {
  const raw = await getJSON<unknown>("/categories");

  // Try strict schema first
  try {
    const parsed = ZCategoriesResponse.parse(raw);
    const data = parsed.data.filter((c) => c.status === "ACTIVE");
    return { ok: true as const, data };
  } catch {
    // Fallback: normalize loose shapes
    const arr = normalizeCategoriesShape(raw);
    // Validate each item with ZCategory; drop invalids
    const validated: Array<ReturnType<typeof ZCategory.parse>> = [];
    for (const item of arr) {
      const res = ZCategory.safeParse(item);
      if (res.success) validated.push(res.data);
    }
    const data = validated.filter((c) => c.status === "ACTIVE");
    return { ok: true as const, data };
  }
}

export type ProductsQuery = {
  q?: string;
  category?: string;
  discounted?: "true" | "false";
  featured?: "true" | "false";
  limit?: number;
  page?: number;
  status?: "ACTIVE" | "DRAFT" | "HIDDEN";
  sort?: string; // e.g., "createdAt:desc", "price:asc"
};

export async function fetchProducts(query?: ProductsQuery) {
  // sanitize limit
  let limit = query?.limit;
  if (typeof limit === "number") {
    if (!Number.isFinite(limit) || limit <= 0) limit = undefined;
    else if (limit > 60) limit = 60;
  }

  const params: Query = {
    ...query,
    limit,
    status: query?.status ?? "ACTIVE",
  };

  let raw: unknown;
  try {
    raw = await getJSON<unknown>("/products", params);
  } catch (e: unknown) {
    const message = (e as { message?: string }).message ?? "";
    if (message.includes('"limit"') || message.includes("VALIDATION_ERROR")) {
      raw = await getJSON<unknown>("/products", {
        ...params,
        limit: undefined,
      });
    } else {
      throw e;
    }
  }

  // Prefer strict schema; fallback to normalizer
  let arr: unknown[] = [];
  let pageInfo: unknown | undefined;
  try {
    const parsed = ZProductsResponse.parse(raw);
    arr = parsed.data;
    pageInfo = parsed.pageInfo;
  } catch {
    const norm = normalizeProductsShape(raw);
    arr = norm.arr;
    pageInfo = norm.pageInfo;
  }

  // Validate each item
  const validated: Array<ReturnType<typeof ZProduct.parse>> = [];
  for (const item of arr) {
    const res = ZProduct.safeParse(item);
    if (res.success) validated.push(res.data);
  }

  // Keep only ACTIVE
  let data = validated.filter((p) => p.status === "ACTIVE");

  // discounted filter (defensive on BE shape)
  const wantsDiscounted = query?.discounted === "true";
  if (wantsDiscounted) {
    data = data.filter(
      (p) =>
        p.isDiscounted === true ||
        (typeof p.compareAtPrice === "number" && p.compareAtPrice > p.price)
    );
  }

  // default sort by createdAt desc if not provided and createdAt exists
  if (!query?.sort && data.length > 0 && "createdAt" in data[0]) {
    data = [...data].sort((a, b) => {
      const aDate = (a as { createdAt?: string }).createdAt ?? "";
      const bDate = (b as { createdAt?: string }).createdAt ?? "";
      return aDate > bDate ? -1 : 1;
    });
  }

  // client-side clamp
  if (limit && data.length > limit) data = data.slice(0, limit);

  // cover image fallback (image || images[0])
  data = data.map((p) => {
    const cover =
      p.image ?? (Array.isArray(p.images) ? p.images[0] : undefined);
    return cover ? { ...p, image: cover } : p;
  });

  return { ok: true as const, data, pageInfo };
}

export async function fetchProduct(slug: string) {
  const raw = await getJSON<unknown>(`/products/${slug}`);
  const parsed = ZOkProduct.parse(raw);
  // ensure cover
  const p = parsed.data;
  const cover = p.image ?? (Array.isArray(p.images) ? p.images[0] : undefined);
  return { ok: true as const, data: cover ? { ...p, image: cover } : p };
}

export async function fetchBanners(position?: "hero" | "side") {
  const params: Query = position ? { position } : {};
  const raw = await getJSON<unknown>("/banners", params);
 

  // Accept both { ok, data } and raw arrays
  let dataUnknown: unknown[] = [];
  if (
    raw &&
    typeof raw === "object" &&
    "data" in (raw as Record<string, unknown>)
  ) {
    const obj = raw as { data?: unknown };
    dataUnknown = Array.isArray(obj.data) ? obj.data : [];
  } else if (Array.isArray(raw)) {
    dataUnknown = raw as unknown[];
  } else {
    const arrLike =
      raw && typeof raw === "object"
        ? Object.values(raw as Record<string, unknown>).find((v) =>
            Array.isArray(v)
          )
        : undefined;
    dataUnknown = Array.isArray(arrLike) ? (arrLike as unknown[]) : [];
  }

  // We don't have a strict Zod for banners here; pass through and filter ACTIVE if field exists
  type BannerLoose = {
    status?: string;
  };

  const banners = dataUnknown.filter((b) => {
    const status = (b as BannerLoose)?.status;
    return !status || status.toUpperCase() === "ACTIVE";
  });

  return { ok: true as const, data: banners };
}
