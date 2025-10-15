
import { z } from "zod";
const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, init);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export const ZCategory = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  image: z.string().optional(),
  status: z.enum(["ACTIVE", "HIDDEN"]),
});
export const ZProduct = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  image: z.string().optional(),
  price: z.number(),
  compareAtPrice: z.number().optional(),
  isDiscounted: z.boolean().optional(),
  stock: z.number().optional(),
  categorySlug: z.string().optional(),
  tagSlugs: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "DRAFT", "HIDDEN"]),
});
export const ZCategoriesResponse = z.object({
  ok: z.boolean(),
  data: z.array(ZCategory),
});
export const ZProductsResponse = z.object({
  ok: z.boolean(),
  data: z.array(ZProduct),
  pageInfo: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number().optional(),
      hasNext: z.boolean().optional(),
    })
    .optional(),
});
