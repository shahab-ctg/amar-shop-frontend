"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Category } from "@/lib/schemas";

type Props = {
  categories: Category[];
};

export default function CategorySidebar({ categories }: Props) {
  return (
    <aside className="hidden lg:block w-[280px] shrink-0">
      <div className="rounded-2xl border border-rose-100 bg-white/80 backdrop-blur shadow-sm">
        <div className="px-4 py-3 border-b border-rose-100">
          <h3 className="font-semibold text-rose-700">Categories</h3>
        </div>

        {/* দুইটা ছোট কার্ড প্রতি সারি */}
        <nav className="p-3">
          <div
            className="grid grid-cols-2 gap-3 overflow-auto pr-1"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {categories.length > 0
              ? categories.map((c) => (
                  <Link
                    key={c._id}
                    href={`/products?category=${encodeURIComponent(c.slug)}`}
                    aria-label={`Browse ${c.title}`}
                    className="group rounded-xl border border-rose-100 bg-white hover:bg-white shadow-sm hover:shadow transition p-2 flex items-center gap-2"
                  >
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-rose-50">
                      {c.image ? (
                        <Image
                          src={c.image}
                          alt={c.title}
                          fill
                          sizes="40px"
                          className="object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-rose-500">
                          <ShoppingBag size={16} />
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-medium text-gray-700 line-clamp-2">
                      {c.title}
                    </div>
                  </Link>
                ))
              : Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[56px] rounded-xl border border-rose-100 bg-rose-50/50 animate-pulse"
                  />
                ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
