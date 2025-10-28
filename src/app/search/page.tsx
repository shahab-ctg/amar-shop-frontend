"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/services/catalog";
import { ZProduct, type Product } from "@/lib/schemas";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
      <rect width='100%' height='100%' fill='#fdf2f8'/>
      <text x='50%' y='50%' text-anchor='middle' fill='#ec4899' font-size='20' font-family='Arial'>✨ Product</text>
    </svg>`
  );

export default function SearchPage() {
  const searchParams = useSearchParams();
  const discounted = searchParams.get("discounted");
  const featured = searchParams.get("tag");
  const sort = searchParams.get("sort");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const query: any = { limit: 24 };

      if (discounted === "true") query.discounted = "true";
      if (featured === "featured") query.featured = "true";
      if (sort === "new" || sort === "createdAt:desc")
        query.sort = "createdAt:desc";

      const res = await fetchProducts(query);
      const data = res.data.map((p) => ZProduct.parse(p)) as Product[];
      setProducts(data);
      setLoading(false);
    }
    load();
  }, [discounted, featured, sort]);

  return (
    <main className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          {discounted === "true"
            ? "Hot Deals"
            : featured === "featured"
              ? "Featured Products"
              : sort === "new"
                ? "New Arrivals"
                : "All Products"}
        </h1>
        <p className="text-gray-600 mt-2">
          Explore our collection of products tailored just for you
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[260px] bg-pink-50 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => {
            const cover =
              p.image ??
              (Array.isArray(p.images) ? p.images[0] : undefined) ??
              FALLBACK_IMG;
            const showCompare =
              p.compareAtPrice &&
              p.price &&
              Number(p.compareAtPrice) > Number(p.price);
            const discount = showCompare
              ? Math.round(
                  ((Number(p.compareAtPrice) - Number(p.price)) /
                    Number(p.compareAtPrice)) *
                    100
                )
              : 0;

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
                  {showCompare && discount > 0 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      {discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug group-hover:text-pink-600 transition-colors">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">
                      ৳{p.price.toLocaleString()}
                    </span>
                    {showCompare && (
                      <span className="text-sm text-gray-400 line-through">
                        ৳{p.compareAtPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
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
