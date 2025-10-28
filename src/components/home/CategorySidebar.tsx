"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Category } from "@/lib/schemas";

type Props = { categories: Category[] };

export default function CategorySidebar({ categories }: Props) {
  return (
    <aside className="category-sidebar hidden lg:flex flex-col w-[260px] shrink-0 bg-transparent">
      {/* Header */}
      <div className="px-4 py-3">
        <h3 className="font-semibold text-[#167389] text-lg">Categories</h3>
      </div>

      {/* Dynamic, full-height, no scrollbar */}
      <div className="flex-1 px-4 pb-6">
        <div className="grid grid-cols-2 gap-3 h-auto">
          {categories.length > 0
            ? categories.map((c) => (
                <Link
                  key={c._id}
                  href={`/products?category=${encodeURIComponent(c.slug)}`}
                  aria-label={`Browse ${c.title}`}
                  className="group rounded-xl bg-white hover:bg-cyan-50 transition-all duration-200 p-2 flex items-center gap-2"
                >
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-cyan-50 flex-shrink-0">
                    {c.image ? (
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        sizes="40px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-[#167389]">
                        <ShoppingBag size={16} />
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-medium text-gray-700 line-clamp-2 leading-tight">
                    {c.title}
                  </div>
                </Link>
              ))
            : Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[56px] rounded-xl bg-cyan-50/50 animate-pulse"
                />
              ))}
        </div>
      </div>

      {/* Hard overrides so NO inner scrollbars or fixed heights leak in */}
      <style jsx global>{`
        .category-sidebar,
        .category-sidebar * {
          max-height: none !important;
          overflow: visible !important;
        }
        /* Plain look: no border/shadow if any inherited */
        .category-sidebar {
          box-shadow: none !important;
          border: 0 !important;
        }
      `}</style>
    </aside>
  );
}
