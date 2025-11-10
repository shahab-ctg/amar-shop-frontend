/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ProductsGridClient.tsx
"use client";
import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";
import { fetchProducts } from "@/services/catalog";


interface Meta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface Props {
  initialItems: Product[];
  initialMeta: Meta;
  category?: string | null;
  q?: string | null;
}

export default function ProductsGridClient({
  initialItems,
  initialMeta,
  category,
  q,
}: Props) {
  const [items, setItems] = useState<Product[]>(initialItems ?? []);
  const [meta, setMeta] = useState<Meta>(
    initialMeta ?? { total: 0, page: 1, limit: 20, pages: 1 }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allLoaded = items.length >= meta.total;

  async function loadMore() {
    if (loading || allLoaded) return;
    setLoading(true);
    setError(null);

    const nextPage = meta.page + 1;

    try {
      // Use your centralized helper — it builds correct backend URL & normalizes response
      const res = await fetchProducts({
        page: nextPage,
        limit: meta.limit,
        category: category ?? undefined,
        q: q ?? undefined,
      });

      // res expected shape from our helper: { ok: true, data: { items, total, page, limit, pages } }
      if (!res || !res.ok) throw new Error("Bad response from API");

      const newItems = Array.isArray(res.data.items)
        ? (res.data.items as Product[])
        : [];
      const newMeta: Meta = {
        total: Number(res.data.total ?? meta.total),
        page: Number(res.data.page ?? nextPage),
        limit: Number(res.data.limit ?? meta.limit),
        pages: Number(res.data.pages ?? meta.pages),
      };

      // append new items with dedupe
      setItems((prev) => {
        const ids = new Set(prev.map((p) => p._id));
        const merged = [...prev];
        for (const it of newItems) {
          if (!ids.has(it._id)) {
            merged.push(it);
            ids.add(it._id);
          }
        }
        return merged;
      });

      setMeta(newMeta);
    } catch (err: any) {
      console.error("Load more error", err);
      setError("Unable to load more products. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6"
        aria-label="Products"
      >
        {items.map((product) => (
          <div key={product._id} className="min-w-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center">
        {error && <div className="text-sm text-red-600 mb-2 mr-4">{error}</div>}

        {!allLoaded ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-[#167389] text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            aria-label="Load more products"
          >
            {loading ? "Loading..." : "View more"}
          </button>
        ) : (
          <div className="text-sm text-gray-600">All products loaded</div>
        )}
      </div>
    </div>
  );
}
