"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@/lib/schemas";

interface Props {
  categories: Category[];
}

export default function CategoriesScroll({ categories }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Left scroll handler
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
    }
  };

  // Right scroll handler
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#167389]" size={18} />
          <h2 className="text-base sm:text-lg font-semibold text-[#167389]">
            Shop by Categories
          </h2>
        </div>
        <Link
          href="/products?categories=true"
          className="text-sm text-[#167389] hover:text-rose-600 transition flex items-center gap-1"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      {/* Scroll buttons */}
      <button
        onClick={scrollLeft}
        aria-label="Scroll Left"
        className="hidden lg:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-100 transition"
      >
        <ChevronLeft className="text-[#167389]" size={22} />
      </button>

      <button
        onClick={scrollRight}
        aria-label="Scroll Right"
        className="hidden lg:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-100 transition"
      >
        <ChevronRight className="text-[#167389]" size={22} />
      </button>

      {/* Scroll area */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide -mx-2 px-2"
      >
        <div className="flex gap-3 min-w-max pb-1">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/c/${cat.slug}`}
              className="flex flex-col items-center justify-start gap-2 bg-white border border-gray-200 rounded-lg p-3 w-[110px] sm:w-[130px] flex-shrink-0 hover:border-[#167389] hover:shadow-md transition"
            >
              <div className="relative w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="90px"
                    className="object-cover"
                  />
                ) : (
                  <ShoppingBag className="text-[#167389]" size={28} />
                )}
              </div>
              <p className="text-[11px] sm:text-sm font-medium text-gray-700 text-center line-clamp-2 leading-tight">
                {cat.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Gradient edges */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </section>
  );
}
