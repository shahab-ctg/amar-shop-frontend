/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ZCategoriesResponse,
  ZProductsResponse,
  ZOkProduct,
  ZProduct,
  ZCategory,
} from "@/lib/schemas";

/* ----------------------------- API Base Setup ---------------------------- */
const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

const API_BASE =
  API ||
  "https://amar-shop-backend-3tkvvjwfb-shahabs-projects-5a60f0e3.vercel.app";

if (!API) {
  console.warn("⚠️ API URL missing — using fallback");
}

/* -------------------------- URL builder util ----------------------------- */
type Query =
  | Record<string, string | number | boolean | undefined | null>
  | null
  | undefined;

function buildURL(path: string, params?: Query) {
  const usp = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && String(v).length > 0) {
        usp.set(k, String(v));
      }
    }
  }
  return `${API_BASE}${path}${usp.toString() ? `?${usp.toString()}` : ""}`;
}

/* -------------------------------------------------------------------------- */
/* ⚙️ OPTIMIZED FETCH: global in-memory cache + request deduplication + retry */
/* -------------------------------------------------------------------------- */

const requestCache = new Map<string, Promise<any>>();
const cacheTTL = 5000; // 5 sec short-term memory to prevent bursts

async function getJSON<T>(path: string, params?: Query): Promise<T> {
  const url = buildURL(path, params);

  // Avoid duplicate calls instantly
  if (requestCache.has(url)) {
    return requestCache.get(url)!;
  }

  // Actual network request
  const fetchPromise = (async () => {
    let attempt = 0;
    while (attempt < 2) {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          next: { revalidate: 0 },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error(`❌ API Error [${res.status}] ${url} - ${text}`);
          throw new Error(`${path} failed: ${res.status}`);
        }

        const data = (await res.json()) as T;
        return data;
      } catch (err) {
        attempt++;
        if (attempt >= 2) {
          console.error(`Network Error: ${url}`, err);
          throw err;
        }
        // small retry delay
        await new Promise((r) => setTimeout(r, 300));
      }
    }
    throw new Error("Unreachable");
  })();

  requestCache.set(url, fetchPromise);

  // Auto-expire cache after TTL
  setTimeout(() => requestCache.delete(url), cacheTTL);

  return fetchPromise;
}

/* --------------------------- Normalizers (untouched) --------------------------- */
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

/* ------------------------------ API functions ----------------------------- */

export async function fetchCategories() {
  try {
    const raw = await getJSON<unknown>("/categories");

    try {
      const parsed = ZCategoriesResponse.parse(raw);
      const data = parsed.data.filter((c) => c.status === "ACTIVE");
      return { ok: true as const, data };
    } catch {
      const arr = normalizeCategoriesShape(raw);
      const validated: Array<ReturnType<typeof ZCategory.parse>> = [];
      for (const item of arr) {
        const res = ZCategory.safeParse(item);
        if (res.success) validated.push(res.data);
      }
      const data = validated.filter((c) => c.status === "ACTIVE");
      return { ok: true as const, data };
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { ok: true as const, data: [] };
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
  sort?: string;
};

export async function fetchProducts(query?: ProductsQuery) {
  try {
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

    const validated: Array<ReturnType<typeof ZProduct.parse>> = [];
    for (const item of arr) {
      const res = ZProduct.safeParse(item);
      if (res.success) validated.push(res.data);
    }

    let data = validated.filter((p) => p.status === "ACTIVE");

    if (query?.discounted === "true") {
      data = data.filter(
        (p) =>
          p.isDiscounted === true ||
          (typeof p.compareAtPrice === "number" && p.compareAtPrice > p.price)
      );
    }

    if (!query?.sort && data.length > 0 && "createdAt" in data[0]) {
      data = [...data].sort((a, b) => {
        const aDate = (a as { createdAt?: string }).createdAt ?? "";
        const bDate = (b as { createdAt?: string }).createdAt ?? "";
        return aDate > bDate ? -1 : 1;
      });
    }

    if (limit && data.length > limit) data = data.slice(0, limit);

    data = data.map((p) => {
      const cover =
        p.image ?? (Array.isArray(p.images) ? p.images[0] : undefined);
      return cover ? { ...p, image: cover } : p;
    });

    return { ok: true as const, data, pageInfo };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { ok: true as const, data: [], pageInfo: undefined };
  }
}

export async function fetchProduct(slug: string) {
  try {
    const raw = await getJSON<unknown>(`/products/${slug}`);
    const parsed = ZOkProduct.parse(raw);
    const p = parsed.data;
    const cover =
      p.image ?? (Array.isArray(p.images) ? p.images[0] : undefined);
    return { ok: true as const, data: cover ? { ...p, image: cover } : p };
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    return { ok: false as const, data: null };
  }
}

// export async function fetchBanners(position?: "hero" | "side") {
//   try {
//     const params: Query = position ? { position } : {};
//     const raw = await getJSON<unknown>("/banners", params);

//     let dataUnknown: unknown[] = [];
//     if (
//       raw &&
//       typeof raw === "object" &&
//       "data" in (raw as Record<string, unknown>)
//     ) {
//       const obj = raw as { data?: unknown };
//       dataUnknown = Array.isArray(obj.data) ? obj.data : [];
//     } else if (Array.isArray(raw)) {
//       dataUnknown = raw as unknown[];
//     } else {
//       const arrLike =
//         raw && typeof raw === "object"
//           ? Object.values(raw as Record<string, unknown>).find((v) =>
//               Array.isArray(v)
//             )
//           : undefined;
//       dataUnknown = Array.isArray(arrLike) ? (arrLike as unknown[]) : [];
//     }

//     type BannerLoose = { status?: string };
//     const banners = dataUnknown.filter((b) => {
//       const status = (b as BannerLoose)?.status;
//       return !status || status.toUpperCase() === "ACTIVE";
//     });

//     return { ok: true as const, data: banners };
//   } catch (error) {
//     console.error("Failed to fetch banners:", error);
//     return { ok: true as const, data: [] };
//   }
// }
