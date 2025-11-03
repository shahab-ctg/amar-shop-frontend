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

/** URL safe helper:
 * - absolute (http/https) বা app public path (/) হলে 그대로 নেয়
 * - রিলেটিভ হলে NEXT_PUBLIC_IMG_BASE_URL বা API root দিয়ে বেইস করে
 * - invalid হলে null ফেরত দেয় => fallback icon দেখাই
 */
function normalizeImg(src?: string | null): string | null {
  if (!src || typeof src !== "string") return null;
  const s = src.trim();
  if (s === "") return null;
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"))
    return s;

  // চেষ্টা করি একটি base খুঁজতে
  const imgBase =
    process.env.NEXT_PUBLIC_IMG_BASE_URL ||
    // API_BASE_URL থেকে "/api/..." কেটে host টা বার করি
    (process.env.NEXT_PUBLIC_API_BASE_URL
      ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/.*/i, "/")
      : "");

  try {
    return imgBase
      ? new URL(s, imgBase).toString()
      : `/${s.replace(/^\/+/, "")}`;
  } catch {
    return null;
  }
}

export default function MobileCategoriesGrid({
  categories,
  loading = false,
  title = "Shop by Categories",
}: Props) {
  const items = Array.isArray(categories) ? categories.slice(0, 6) : [];

  return (
    // 👉 ছোট স্ক্রিনেই দেখাও
    <section className="lg:hidden block bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
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
          : items.map((cat, i) => {
              const src = normalizeImg(cat.image);
              return (
                <Link
                  key={`cat-${cat._id ?? cat.slug ?? i}`}
                  href={cat?.slug ? `/c/${cat.slug}` : "#"}
                  aria-label={cat?.title ?? "Category"}
                  className="mcg-card group h-[156px] rounded-md border border-gray-200 bg-white p-2 flex flex-col items-stretch justify-start hover:shadow-md hover:border-cyan-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                >
                  <div className="mcg-img relative basis-[80%] rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                    {src ? (
                      <Image
                        src={src}
                        alt={cat.title}
                        fill
                        sizes="(max-width: 640px) 33vw, 80px"
                        className="object-cover"
                        priority={i < 3}
                      />
                    ) : (
                      <ShoppingBag className="text-[#167389]" size={26} />
                    )}
                  </div>

                  <p className="basis-[20%] flex items-center justify-center text-[13px] font-extrabold text-gray-800 text-center px-1 leading-tight line-clamp-2">
                    {cat.title}
                  </p>
                </Link>
              );
            })}
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
