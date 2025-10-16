
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Flame } from "lucide-react";
import Image from "next/image";

import ProductCard from "@/components/ProductCard";
import { fetchCategories, fetchProducts } from "@/services/catalog";
import type { Product, Category } from "@/types";
import HeroBanner from '@/components/HeroBanner';

export default function LandingPage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [cats, disc, rec] = await Promise.all([
        fetchCategories(),
        fetchProducts({ discounted: "true", limit: 4 }),
        fetchProducts({ limit: 9 }),
      ]);
      setCategories(cats.data);
      setFeatured(disc.data);
      setRecent(rec.data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <HeroBanner />
      </section>

      {/* Featured (discounted) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-green-600 flex items-center gap-3">
            <Flame className="w-8 h-8 text-red-500" /> ছাড়যুক্ত পণ্য
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-80 animate-pulse"
                />
              ))
            : featured.map((p) => (
                <ProductCard key={p._id} product={p} showDiscount />
              ))}
        </div>
      </section>

      {/* Recent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-green-600">
            🆕 নতুন পণ্য
          </h2>
          <Link
            href="/products"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl"
          >
            সব দেখুন <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-72 animate-pulse"
                />
              ))
            : recent.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* Category Quick Access */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-green-600 mb-8">
          ক্যাটাগরি অনুযায়ী কিনুন
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c._id}
              href={`/category/${c.slug}`}
              className="group block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="relative aspect-square bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl mb-3 overflow-hidden">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
              
               
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-4xl">
                    📦
                  </span>
                )}
              </div>
              <h3 className="text-center font-semibold text-gray-800 group-hover:text-emerald-600">
                {c.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
