// src/app/page.tsx (or src/app/(public)/page.tsx)
"use client";

import { useEffect, useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import DiscountedGrid from "@/components/home/DiscountedGrid";
import LatestGrid from "@/components/home/LatestGrid";
import CategoryQuick from "@/components/home/CategoryQuick";
import { fetchCategories, fetchProducts } from "@/services/catalog";
import type { Product, Category } from "@/types";

export default function LandingPage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [cats, disc, rec] = await Promise.all([
          fetchCategories(),
          fetchProducts({ discounted: "true", limit: 8, sort: "-createdAt" }),
          fetchProducts({ limit: 9, sort: "-createdAt" }),
        ]);
        if (!mounted) return;
        setCategories(cats.data);
        setFeatured(disc.data);
        setRecent(rec.data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <HeroBanner />
      </section>

      <DiscountedGrid products={featured} loading={loading} />
      <LatestGrid products={recent} loading={loading} />
      <CategoryQuick categories={categories} loading={loading} />
    </div>
  );
}
