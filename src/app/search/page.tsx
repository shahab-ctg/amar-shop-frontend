/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useEffect, useState } from "react";
import {
  useGetProductsPaginatedQuery,
  useLazyGetProductsPaginatedQuery,
} from "@/services/catalog.api";
import { ZProduct, type Product } from "@/lib/schemas";
import type { ProductsQuery } from "@/services/catalog";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#fdf2f8'/><text x='50%' y='50%' text-anchor='middle' fill='#ec4899' font-size='20' font-family='Arial'>✨ Product</text></svg>`
  );

// Build queryArg same as before
function buildQueryArg(sp: URLSearchParams): ProductsQuery {
  const discounted: "true" | undefined =
    sp.get("discounted") === "true" ? "true" : undefined;
  const featured: "true" | undefined =
    sp.get("tag") === "featured" ? "true" : undefined;
  const tag = sp.get("tag") ?? undefined;
  const sortParam = sp.get("sort");
  const sort =
    sortParam === "new" || sortParam === "createdAt:desc"
      ? "createdAt:desc"
      : undefined;
  return { discounted, featured, tag, sort, limit: 24, page: 1 };
}

export default function SearchPageRTK() {
  const sp = useSearchParams();
  const queryArg = useMemo(() => buildQueryArg(sp), [sp]);

  // initial page fetch via RTK
  const { data: initial, isLoading: initialLoading } =
    useGetProductsPaginatedQuery(queryArg, {
      // pass the arg so RTK caches per-arg
    });

  // lazy query for subsequent pages
  const [trigger, { data: nextPageData, isFetching: isFetchingNext }] =
    useLazyGetProductsPaginatedQuery();

  // local merged items + pager
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // seed from initial RTK result
  useEffect(() => {
    if (!initial) {
      setItems([]);
      setPage(1);
      setPages(null);
      setHasMore(false);
      return;
    }
    setItems(initial.items ?? []);
    setPage(initial.page ?? 1);
    setPages(initial.pages ?? null);
    setHasMore(
      Boolean(
        initial.pages
          ? (initial.page ?? 1) < (initial.pages ?? 0)
          : (initial.items?.length ?? 0) >= (initial.limit ?? 24)
      )
    );
  }, [initial]);

  // when next page arrives from trigger, append
  useEffect(() => {
    if (!nextPageData) return;
    const nextItems = nextPageData.items ?? [];
    if (nextItems.length === 0) {
      setHasMore(false);
      return;
    }
    setItems((prev) => [...prev, ...nextItems]);
    setPage(nextPageData.page ?? ((p) => p + 1));
    setPages(nextPageData.pages ?? pages);
    setHasMore(
      Boolean(
        nextPageData.page && nextPageData.pages
          ? nextPageData.page < nextPageData.pages
          : nextItems.length >= (nextPageData.limit ?? 24)
      )
    );
  }, [nextPageData]);

  // load more handler using RTK lazy trigger
  const loadMore = async () => {
    setLoadError(null);
    try {
      const nextPage = (page || 1) + 1;
      const arg = { ...(queryArg || {}), page: nextPage };
      // trigger returns a Promise with the result when dispatched (RTK v1.9+)
      const res = await trigger(arg).unwrap();
      // appended via useEffect above
      // if res.items length < limit -> no more
      if (!res || (res.items?.length ?? 0) === 0) {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("RTK loadMore error", err);
      setLoadError(err?.message ?? "Failed to load more");
    }
  };

  const parsedProducts = items.map((p) => {
    try {
      return ZProduct.parse(p) as Product;
    } catch {
      return p as Product;
    }
  });

  return (
    <main className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Search
        </h1>
      </div>

      {initialLoading && parsedProducts.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[260px] bg-pink-50 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : parsedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {parsedProducts.map((p) => {
              const cover =
                p.image ??
                (Array.isArray(p.images) ? p.images[0] : undefined) ??
                FALLBACK_IMG;
              return (
                <Link
                  key={p._id}
                  href={`/products/${encodeURIComponent(p.slug)}`}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
                    <Image
                      src={cover}
                      alt={p.title}
                      fill
                      sizes="(max-width:640px)100vw,(max-width:1024px)50vw,25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug group-hover:text-pink-600 transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg sm:text-xl font-bold text-gray-900">
                        ৳{Number(p.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col items-center mt-8 gap-3">
            {loadError && (
              <div className="text-sm text-red-600">{loadError}</div>
            )}
            {hasMore ? (
              <button
                onClick={loadMore}
                disabled={isFetchingNext}
                className="px-6 py-3 rounded-full bg-[#167389] text-white font-semibold hover:opacity-95 disabled:opacity-60"
              >
                {isFetchingNext ? "Loading..." : "View more"}
              </button>
            ) : (
              <div className="text-sm text-gray-500">No more products</div>
            )}
            {pages ? (
              <div className="text-xs text-gray-500">
                Page {page} of {pages}
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">No products found.</p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 rounded-full bg-pink-600 text-white font-medium hover:bg-pink-700 transition"
          >
            Back to Home
          </Link>
        </div>
      )}
    </main>
  );
}
