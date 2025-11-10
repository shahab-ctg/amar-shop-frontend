/* eslint-disable @typescript-eslint/no-explicit-any */


import CategoryView from "@/components/category/CategoryView";
import ProductsGridClient from "@/components/product/ProductsGridClient";
import { fetchProducts, fetchCategories } from "@/services/catalog";
import type { Product, Category } from "@/types";
import { Grid3x3, Search } from "lucide-react";
import Link from "next/link";

export const revalidate = 30;

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const { category, q } = params;

  if (category && !q) {
    return <CategoryView slug={decodeURIComponent(category)} />;
  }

  const initialLimit = 20;

  // server fetch first page only
  const [productsRes, categoriesRes] = await Promise.all([
    fetchProducts({
      page: 1,
      limit: initialLimit,
      category: category,
      q: q,
    }),
    fetchCategories(),
  ]);

  // --- Runtime type guards to support two shapes:
  // 1) productsRes.data === Product[] (older helper)
  // 2) productsRes.data === { items: Product[], total, page, limit, pages }
  const rawData: any = productsRes?.data;

  let products: Product[] = [];
  const defaultMeta = {
    total: 0,
    page: 1,
    limit: initialLimit,
    pages: 1,
  };
  let initialMeta = { ...defaultMeta };

  if (Array.isArray(rawData)) {
    // case: rawData is an array of products
    products = rawData as Product[];
    initialMeta = {
      total: products.length,
      page: 1,
      limit: products.length || initialLimit,
      pages: 1,
    };
  } else if (rawData && typeof rawData === "object") {
    // case: rawData is an object, possibly with items + meta
    const items = Array.isArray(rawData.items)
      ? (rawData.items as Product[])
      : [];
    products = items.length ? items : (rawData as Product[]); // fallback

    initialMeta = {
      total:
        typeof rawData.total === "number" ? rawData.total : products.length,
      page: typeof rawData.page === "number" ? rawData.page : 1,
      limit: typeof rawData.limit === "number" ? rawData.limit : initialLimit,
      pages:
        typeof rawData.pages === "number"
          ? rawData.pages
          : Math.max(
              1,
              Math.ceil(
                (rawData.total ?? products.length) /
                  (rawData.limit ?? initialLimit)
              )
            ),
    };
  } else {
    // unknown shape -> keep empty defaults
    products = [];
    initialMeta = { total: 0, page: 1, limit: initialLimit, pages: 1 };
  }

  const categories: Category[] = categoriesRes?.data ?? [];
  const activeCategory = categories.find((c) => c.slug === category);

  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from[#F5FDF8] to-[#F5FDF8]">
        <div className="mx-auto max-w-7xl px-4 xs:px-5 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-200 rounded-full mb-5 sm:mb-6">
              <Search className="w-10 h-10 text-[#167389]" aria-hidden="true" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2.5 sm:mb-3">
              No products found
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8">
              {q
                ? `No results found for "${q}"`
                : "New products will be added soon"}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#167389] text-white px-6 sm:px-7 py-3 rounded-full hover:bg-green-700 transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label="View all products"
            >
              View all products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 xs:px-5 sm:px-6 lg:px-8 py-8 md:py-12 pt-20">
        <div className="mb-6 md:mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#167389] text-white rounded-xl">
              <Grid3x3 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 truncate">
                {activeCategory?.title || "All Products"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {initialMeta.total} fresh original products
              </p>
            </div>
          </div>
        </div>

        <ProductsGridClient
          initialItems={products}
          initialMeta={initialMeta}
          category={category}
          q={q}
        />
      </div>
    </div>
  );
}
