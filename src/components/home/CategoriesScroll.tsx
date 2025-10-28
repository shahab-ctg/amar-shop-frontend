"use client";
import { useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ArrowRight,
} from "lucide-react";
import type { Category } from "@/lib/schemas";

interface Props {
  categories: Category[];
  loading?: boolean;
}

export default function CategoriesScroll({
  categories,
  loading = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ✅ Prevent re-renders of skeletons
  const skeletonItems = useMemo(
    () => Array.from({ length: 8 }, (_, i) => i),
    []
  );

  // ✅ Defensive scroll handler (fix crash)
  const scrollByOne = (dir: "left" | "right") => {
    const node = scrollRef.current;
    if (!node || !node.isConnected) return;
    const itemW = node.querySelector("a")?.clientWidth || 120;
    node.scrollBy({
      left: dir === "left" ? -itemW : itemW,
      behavior: "smooth",
    });
  };

  return (
    <section className="cat-scroll relative bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#167389]" size={18} />
          <h2 className="text-base sm:text-lg font-semibold text-[#167389]">
            Shop by Categories
          </h2>
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

      {/* ✅ Arrows always visible on all screens */}
      {!loading && categories.length > 0 && (
        <>
          <button
            onClick={() => scrollByOne("left")}
            aria-label="Scroll Left"
            className="cat-arrow left-2 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-100 active:scale-95"
          >
            <ChevronLeft className="text-[#167389] mx-auto" size={18} />
          </button>
          <button
            onClick={() => scrollByOne("right")}
            aria-label="Scroll Right"
            className="cat-arrow right-2 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-100 active:scale-95"
          >
            <ChevronRight className="text-[#167389] mx-auto" size={18} />
          </button>
        </>
      )}

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="cat-track overflow-x-auto scrollbar-hide -mx-2 px-2 scroll-smooth relative"
        style={{ overscrollBehaviorX: "contain" }}
      >
        <div className="flex gap-3 min-w-max pb-1">
          {loading ? (
            // Skeleton Loading
            <div className="categories-skeleton">
              {skeletonItems.map((i) => (
                <div key={i} className="skeleton-category-card">
                  <div className="skeleton-image" />
                  <div className="skeleton-text" />
                </div>
              ))}
            </div>
          ) : (
            categories.map((cat, index) => (
              <Link
                key={cat._id || `cat-${index}`}
                href={`/c/${cat.slug}`}
                className="flex flex-col items-center justify-start gap-2 bg-white border border-gray-200 rounded-lg p-3 w-[100px] sm:w-[120px] flex-shrink-0 hover:border-[#167389] hover:shadow-md transition"
              >
                <div className="relative w-[65px] h-[65px] sm:w-[75px] sm:h-[75px] rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="90px"
                      className="object-cover"
                    />
                  ) : (
                    <ShoppingBag className="text-[#167389]" size={26} />
                  )}
                </div>
                <p className="text-[11px] sm:text-sm font-medium text-gray-700 text-center line-clamp-2 leading-tight">
                  {cat.title}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* ✅ fade edges - always after scroll area */}
      {!loading && categories.length > 0 && (
        <>
          <div className="cat-fade-left absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="cat-fade-right absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </>
      )}
    </section>
  );
}
