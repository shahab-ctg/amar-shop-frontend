"use client";
import { useRef, useMemo, useEffect, useState } from "react";
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

  // skeleton (শুধু লোডিং ভিউতে ইউজ হবে; data টাইপের সাথে মিক্স না)
  const skeletonItems = useMemo(
    () => Array.from({ length: 8 }, (_, i) => i),
    []
  );

  // ডেস্কটপ স্ক্রলে এক কার্ড করে সরানো
  const scrollByOne = (dir: "left" | "right") => {
    const node = scrollRef.current;
    if (!node || !node.isConnected) return;
    const itemW =
      (node.querySelector("a") as HTMLAnchorElement | null)?.clientWidth || 120;
    node.scrollBy({
      left: dir === "left" ? -itemW : itemW,
      behavior: "smooth",
    });
  };

  // component top
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        root: null,
        threshold: 0, // যতটুকু দেখলেই true
        rootMargin: "-100px 0px 0px 0px", // ~ navbar height
      }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

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

      {/* ============ Mobile: 8 cards, 4×2 grid (<=sm) ============ */}
      <div className="sm:hidden">
        <div className="grid grid-cols-4 gap-2">
          {(loading ? skeletonItems : categories.slice(0, 8)).map((item, i) => {
            // লোডিং অবস্থায় skeleton; ডাটা অবস্থায় ক্যাটাগরি
            if (loading) {
              return (
                <div
                  key={`sk-${i}`}
                  className="mobile-category-card animate-pulse bg-gray-100 border border-gray-200"
                >
                  <div className="mobile-category-card__image bg-gray-200" />
                  <p className="mobile-category-card__title w-12 h-3 bg-gray-200 rounded" />
                </div>
              );
            }

            const cat = item as Category; // এখানে আর number নেই, তাই TS safe
            return (
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
            );
          })}
        </div>

        {/* Mobile নিচে “View All” বাটন (ঐচ্ছিক) */}
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
      </div>

      {/* ============ Tablet+ / Desktop: Original scroll UI (>=sm) ============ */}
      <div className="hidden sm:block relative isolate overflow-hidden">
        {/* Arrows */}
        {!loading && categories.length > 0 && (
          <>
            <button
              onClick={() => scrollByOne("left")}
              aria-label="Scroll Left"
              className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-2 z-10
                   h-10 w-10 rounded-full bg-white border border-gray-300 shadow
                   hover:bg-gray-100 active:scale-95 items-center justify-center"
            >
              <ChevronLeft className="text-[#167389]" size={18} />
            </button>

            <button
              onClick={() => scrollByOne("right")}
              aria-label="Scroll Right"
              className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-2 z-10
                   h-10 w-10 rounded-full bg-white border border-gray-300 shadow
                   hover:bg-gray-100 active:scale-95 items-center justify-center"
            >
              <ChevronRight className="text-[#167389]" size={18} />
            </button>
          </>
        )}

        {/* Track */}
        <div
          ref={scrollRef}
          className="cat-track overflow-x-auto scrollbar-hide -mx-2 px-2 scroll-smooth relative"
          style={{ overscrollBehaviorX: "contain" }}
          onScroll={handleScroll} // নিচের স্টেপ–৩ এ ইউজ হবে
        >
          <div className="flex gap-3 min-w-max pb-1">{/* ...items... */}</div>
        </div>

        {/* Fades */}
        {!loading && categories.length > 0 && (
          <>
            <div
              className="absolute inset-y-0 left-0 w-10 z-10
                      bg-gradient-to-r from-white to-transparent pointer-events-none"
            />
            <div
              className="absolute inset-y-0 right-0 w-10 z-10
                      bg-gradient-to-l from-white to-transparent pointer-events-none"
            />
          </>
        )}
      </div>
    </section>
  );
}
