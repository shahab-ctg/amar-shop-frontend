"use client";
import { useRef } from "react";
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
}

export default function CategoriesScroll({ categories }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollByOne = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const itemW = scrollRef.current.querySelector("a")?.clientWidth || 120;
    scrollRef.current.scrollBy({
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
        <Link
          href="/categories"
          className="text-sm text-[#167389] hover:text-rose-600 transition flex items-center gap-1"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {/* Arrows */}
      <button
        onClick={() => scrollByOne("left")}
        aria-label="Scroll Left"
        className="cat-arrow absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-100 active:scale-95 flex items-center justify-center"
      >
        <ChevronLeft className="text-[#167389]" size={20} />
      </button>
      <button
        onClick={() => scrollByOne("right")}
        aria-label="Scroll Right"
        className="cat-arrow absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-100 active:scale-95 flex items-center justify-center"
      >
        <ChevronRight className="text-[#167389]" size={20} />
      </button>

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="cat-track overflow-x-auto scrollbar-hide -mx-2 px-2 scroll-smooth relative"
        style={{ overscrollBehaviorX: "contain" }}
      >
        <div className="flex gap-3 min-w-max pb-1">
          {categories.map((cat) => (
            <Link
              key={cat._id}
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
          ))}
        </div>
      </div>

      {/* fade edges */}
      <div className="cat-fade-left absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="cat-fade-right absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      {/* Local hard override to beat globals without touching them */}
      <style jsx>{`
        .cat-scroll {
          overflow: visible !important;
        }
        .cat-track {
          overflow-y: visible;
        }
        .cat-arrow {
          z-index: 60;
        }
        .cat-fade-left,
        .cat-fade-right {
          z-index: 40;
        }
      `}</style>
    </section>
  );
}
