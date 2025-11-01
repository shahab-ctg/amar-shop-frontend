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
  const items = Array.isArray(categories) ? categories.slice(0, 6) : [];

  return (
    <section className="lg:hidden block bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#167389]" size={20} />
          <h2 className="text-lg font-bold text-[#167389]">{title}</h2>
        </div>

        {!loading && (
          <Link
            href="/categories"
            aria-label="View all categories"
            className="text-sm font-semibold text-[#167389] hover:text-rose-600 transition flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded"
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
                className="mcg-card h-[156px] rounded-md border border-gray-200 bg-white p-3 flex flex-col items-center justify-start"
              >
                <div className="mcg-img relative w-[76px] h-[76px] rounded-full bg-gray-100 animate-pulse" />
                <div className="mt-2 w-20 h-3 rounded bg-gray-100 animate-pulse" />
              </div>
            ))
          : items.map((cat, i) => (
              <Link
                key={cat._id || `cat-m-${i}`}
                href={`/c/${cat.slug}`}
                aria-label={cat.title}
                className="mcg-card group h-[156px] rounded-md border border-gray-200 bg-white p-1 flex flex-col items-center justify-start hover:shadow-md hover:border-cyan-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              >
                <div className="mcg-img relative w-[80px] h-[76px] rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="76px"
                      className="object-cover"
                      priority={i < 3}
                    />
                  ) : (
                    <ShoppingBag className="text-[#167389]" size={26} />
                  )}
                </div>

                <p className="mcg-title mt-2 text-[16px] font-bold text-gray-800 text-center leading-tight line-clamp-2 min-h-[36px] px-1">
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
