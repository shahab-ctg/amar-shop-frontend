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
  title?: string; // optional
};

export default function MobileCategoriesGrid({
  categories,
  loading = false,
  title = "Shop by Categories",
}: Props) {
  // মোবাইলে শুধু ৮টা দেখাবো
  const items = Array.isArray(categories) ? categories.slice(0, 8) : [];

  return (
    <section className="lg:hidden block bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#167389]" size={18} />
          <h2 className="text-base font-semibold text-[#167389]">{title}</h2>
        </div>

        {!loading && (
          <Link
            href="/categories"
            className="text-sm text-[#167389] hover:text-rose-600 transition flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* 4×2 grid */}
      <div className="grid grid-cols-4 gap-2">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="mobile-category-card animate-pulse bg-gray-100 border border-gray-200"
              >
                <div className="mobile-category-card__image bg-gray-200" />
                <p className="mobile-category-card__title w-16 h-3 bg-gray-200 rounded" />
              </div>
            ))
          : items.map((cat, i) => (
              <Link
                key={cat._id || `cat-m-${i}`}
                href={`/c/${cat.slug}`}
                className="mobile-category-card"
              >
                <div className="mobile-category-card__image">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  ) : (
                    <ShoppingBag className="text-[#167389]" size={22} />
                  )}
                </div>
                <p className="mobile-category-card__title">{cat.title}</p>
              </Link>
            ))}
      </div>

      {/* নিচে View More (যদি ৮টার বেশি থাকে) */}
      {!loading && categories.length > 8 && (
        <div className="mt-3 flex justify-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:border-[#167389] hover:text-[#167389] transition"
          >
            View More <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </section>
  );
}
