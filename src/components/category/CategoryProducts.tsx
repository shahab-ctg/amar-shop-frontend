"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

type Props = {
  initialProducts: Product[]; // first batch (8)
  categorySlug: string;
};

export default function CategoryProducts({
  initialProducts,
  categorySlug,
}: Props) {
  const PAGE_SIZE = 8;
  const [items, setItems] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    (initialProducts?.length || 0) >= PAGE_SIZE
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if category changed, reset list
    setItems(initialProducts || []);
    setHasMore((initialProducts?.length || 0) >= PAGE_SIZE);
    setError(null);
  }, [categorySlug, initialProducts]);

  async function loadMore() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const skip = items.length;
      const url = new URL(`${API}/products`);
      url.searchParams.set("category", categorySlug);
      url.searchParams.set("limit", String(PAGE_SIZE));
      url.searchParams.set("page", String(Math.floor(skip / PAGE_SIZE) + 1));
      // your backend may support skip/limit or page/limit; adjust if needed:
      // we attempt page param; if backend expects skip, change accordingly.

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
      const json = await res.json().catch(() => ({}));
      // backend shape may be { data: [...] } or direct array
      const nextItems: Product[] = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
          ? json
          : json?.results || json?.items || [];

      if (!nextItems || nextItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((s) => [...s, ...nextItems]);
        // if returned < PAGE_SIZE then no more
        if (nextItems.length < PAGE_SIZE) setHasMore(false);
      }
    } catch (err: any) {
      console.error("loadMore error", err);
      setError("Failed to load more products");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {items.map((p) => (
          <div key={p._id} className="min-w-0">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex justify-center mt-4">
        {hasMore ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-5 py-2.5 bg-[#167389] text-white rounded-xl shadow hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Loading..." : "View more"}
          </button>
        ) : (
          <div className="text-sm text-gray-500">No more products</div>
        )}
      </div>
    </div>
  );
}
