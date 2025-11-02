"use client";
import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ChevronRight, ShoppingBag } from "lucide-react";
import type { Category } from "@/lib/schemas";

interface Props {
  categories: Category[];
}

function MobileCategoriesBase({ categories }: Props) {
  if (!categories?.length) return null;

  return (
    <div className="sm:hidden">
      {" "}
      {/* <= 639px only */}
      {/* Header */}
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="text-[#167389]" size={16} />
          <h3 className="text-xl font-bold text-[#167389]">Categories</h3>
        </div>
        <Link
          href="/categories"
          className="flex items-center gap-0.5 text-sm font-semibold text-[#167389] hover:text-rose-600"
        >
          View All <ChevronRight size={14} />
        </Link>
      </div>
      {/* Strip */}
      <div className="-mx-3 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-2.5 pb-1">
          {categories.map((cat, i) => (
            <Link
              key={cat._id || `mcat-${i}`}
              href={`/c/${cat.slug}`}
              aria-label={cat.title}
              /* ✅ fixed same size card; no old class names => no conflicts */
              className="
                shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm
                w-[108px] h-[160px] p-2 flex flex-col
                max-[374px]:w-[96px] max-[374px]:h-[150px]
                hover:border-cyan-300 hover:shadow transition
              "
            >
              {/* ✅ image = 80% of card height, full width */}
              <div className="relative w-full h-[80%] rounded-lg overflow-hidden bg-gray-50">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="108px"
                    className="object-cover"
                    priority={i < 6}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <ShoppingBag className="text-[#167389]" size={22} />
                  </div>
                )}
              </div>

              {/* ✅ title = 20% area, bold */}
              <div className="h-[20%] flex items-center justify-center px-1">
                <p className="text-[12px] font-extrabold leading-tight text-gray-800 text-center line-clamp-2">
                  {cat.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export const MobileCategories = memo(MobileCategoriesBase);
