"use client";
import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShoppingBag, ChevronRight } from "lucide-react";
import type { Category } from "@/lib/schemas";

interface Props {
  categories: Category[];
}

function MobileCategoriesBase({ categories }: Props) {
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="text-[#167389]" size={16} />
          <h3 className="text-sm font-semibold text-[#167389]">Categories</h3>
        </div>
        <Link
          href="/products"
          className="text-xs text-[#167389] hover:text-rose-600 flex items-center gap-0.5"
        >
          All <ChevronRight size={14} />
        </Link>
      </div>
      <div className="overflow-x-auto scrollbar-hide -mx-3 px-3">
        <div className="flex gap-2.5 min-w-max pb-1">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/c/${cat.slug}`}
              className="mobile-category-card"
            >
              <div className="mobile-category-card__image">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="70px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center">
                    <ShoppingBag className="text-[#167389]" size={20} />
                  </div>
                )}
              </div>
              <p className="mobile-category-card__title">{cat.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
export const MobileCategories = memo(MobileCategoriesBase);
