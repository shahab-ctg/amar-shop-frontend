"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShoppingBag,
  ChevronRight as ArrowRight,
} from "lucide-react";
import type { Category } from "@/lib/schemas";

type Props = {
  categories: Category[];
  loading?: boolean;
  title?: string;
};

export default function MobileCategoriesGrid({
  categories,
  loading = false,
  title = "Shop by Categories",
}: Props) {
  // 3x2 গ্রিড: প্রথম ৬টা
  const items = Array.isArray(categories) ? categories.slice(0, 6) : [];

  return (
    // ❗️এই কম্পোনেন্ট নিজে থেকে lg:hidden দিচ্ছে না — parent (CategoriesScroll) কন্ডিশনাল রেন্ডার করবে
    <section className="block bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#167389]" size={20} />
          <h2 className="text-lg font-bold text-[#167389]">{title}</h2>
        </div>

        {!loading && (
          <Link
            href="/categories"
            aria-label="View all categories"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#167389] hover:text-rose-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded"
          >
            View All <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* 3 × 2 grid */}
      <div className="grid grid-cols-3 gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="h-[156px] rounded-md border border-gray-200 bg-white p-3 flex flex-col items-center justify-start"
              >
                <div className="relative w-full h-[80%] rounded-md bg-gray-100 animate-pulse" />
                <div className="mt-2 h-3 w-20 rounded bg-gray-100 animate-pulse" />
              </div>
            ))
          : items.map((cat) => (
              // MobileCategoriesGrid.tsx (শুধু এই ৩টা পরিবর্তন নিশ্চিত করো)
              <Link
                key={`cat-${cat._id ?? cat.slug}`} // ✅ stable key, index fallback নয়
                href={`/c/${cat.slug}`}
                className="mcg-card group h-[156px] rounded-md border border-gray-200 bg-white p-2
             flex flex-col items-stretch justify-start hover:shadow-md hover:border-cyan-300
             transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              >
                <div className="mcg-img relative basis-[80%] rounded-md overflow-hidden bg-gray-50">
                  {/* Image fill */}
                </div>
                <p
                  className="basis-[20%] flex items-center justify-center text-[13px] font-extrabold
                text-gray-800 text-center px-1 leading-tight line-clamp-2"
                >
                  {cat.title}
                </p>
              </Link>
            ))}
      </div>

      {!loading && categories.length > 6 && (
        <div className="mt-4 flex justify-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:border-[#167389] hover:text-[#167389] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          >
            View More <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </section>
  );
}
