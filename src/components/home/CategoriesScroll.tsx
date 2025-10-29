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
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // skeleton (শুধু লোডিং ভিউতে ইউজ হবে; data টাইপের সাথে মিক্স না)
  const skeletonItems = useMemo(
    () => Array.from({ length: 8 }, (_, i) => i),
    []
  );

  // navbar overlap হলে arrows হাইড করার জন্য
  const [inView, setInView] = useState(true);

  // স্ক্রল পজিশন অনুযায়ী arrows auto-hide
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // এক কার্ড করে স্ক্রল
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

  const updateArrowState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const handleScroll = () => updateArrowState();

  useEffect(() => {
    // navbar height ~100px ধরে
    const target = containerRef.current;
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    updateArrowState();
    const onResize = () => updateArrowState();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    
  }, []);

  useEffect(() => {
    // data/skeleton থেকে বাস্তব width/scrollWidth আসতে একটু দেরি হয়
    const id = setTimeout(updateArrowState, 0);
    return () => clearTimeout(id);
    
  }, [categories, loading]);

  return (
    <section
      ref={containerRef}
      className="cat-scroll relative bg-white rounded-xl border border-gray-200 shadow-sm p-4"
    >
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
            if (loading) {
              return (
                <div
                  key={`sk-${i}`}
                  className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 bg-white p-2"
                >
                  <div className="relative w-[60px] h-[60px] rounded-full bg-gray-100 animate-pulse" />
                  <div className="w-12 h-3 rounded bg-gray-100 animate-pulse" />
                </div>
              );
            }

            const cat = item as Category;
            return (
              <Link
                key={cat._id || `cat-m-${i}`}
                href={`/c/${cat.slug}`}
                className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 hover:border-[#167389] hover:shadow transition"
              >
                <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
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
                <p className="text-[11px] font-medium text-gray-700 text-center line-clamp-2 leading-tight">
                  {cat.title}
                </p>
              </Link>
            );
          })}
        </div>

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

      {/* ============ Tablet+ / Desktop: Horizontal scroll (>=sm) ============ */}
      <div className="hidden sm:block relative isolate overflow-hidden">
        {/* Arrows (lg+) */}
        {!loading && categories.length > 0 && (
          <>
            <button
              onClick={() => scrollByOne("left")}
              aria-label="Scroll Left"
              className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 left-2 z-10
                   h-10 w-10 rounded-full bg-white border border-gray-300 shadow
                   hover:bg-gray-100 active:scale-95 items-center justify-center transition-opacity ${
                     (!inView || !canLeft) && "opacity-0 pointer-events-none"
                   }`}
            >
              <ChevronLeft className="text-[#167389]" size={18} />
            </button>

            <button
              onClick={() => scrollByOne("right")}
              aria-label="Scroll Right"
              className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 right-2 z-10
                   h-10 w-10 rounded-full bg-white border border-gray-300 shadow
                   hover:bg-gray-100 active:scale-95 items-center justify-center transition-opacity ${
                     (!inView || !canRight) && "opacity-0 pointer-events-none"
                   }`}
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
          onScroll={handleScroll}
        >
          <div className="flex gap-3 min-w-max pb-1">
            {loading
              ? skeletonItems.map((i) => (
                  <div
                    key={`sk-d-${i}`}
                    className="w-[120px] shrink-0 rounded-xl border border-gray-200 bg-white p-2"
                  >
                    <div className="w-full h-[72px] rounded-lg bg-gray-100 animate-pulse" />
                    <div className="h-3 w-16 mt-2 rounded bg-gray-100 animate-pulse" />
                  </div>
                ))
              : categories.map((cat, index) => (
                  <Link
                    key={cat._id || `cat-${index}`}
                    href={`/c/${cat.slug}`}
                    className="w-[120px] shrink-0 rounded-xl border border-gray-200 bg-white hover:border-cyan-300 hover:shadow transition"
                  >
                    <div className="relative w-full h-[72px] rounded-t-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={cat.title}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      ) : (
                        <ShoppingBag className="text-[#167389]" size={24} />
                      )}
                    </div>
                    <p className="px-2 py-2 text-center text-[12px] font-medium text-gray-700 line-clamp-2 leading-tight">
                      {cat.title}
                    </p>
                  </Link>
                ))}
          </div>
        </div>

        {/* Fades */}
        {!loading && categories.length > 0 && (
          <>
            <div className="absolute inset-y-0 left-0 w-10 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-10 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </>
        )}
      </div>
    </section>
  );
}
