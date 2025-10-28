"use client";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShoppingBag } from "lucide-react";
import type { Category } from "@/lib/schemas";
import { memo } from "react";

interface Props {
  categories: Category[];
  loading: boolean;
}

function DesktopSidebarBase({ categories, loading }: Props) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky">
        <div className="desktop-sidebar h-full">
          <div className="desktop-sidebar__header">
            <Sparkles size={18} /> Categories
          </div>
          <div className="desktop-sidebar__content">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="desktop-sidebar__skeleton" />
                ))
              : categories.map((c) => (
                  <Link
                    key={c._id}
                    href={`/c/${c.slug}`}
                    className="desktop-sidebar__card"
                  >
                    <div className="desktop-sidebar__card-image">
                      {c.image ? (
                        <Image
                          src={c.image}
                          alt={c.title}
                          fill
                          sizes="50px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-[#167389]">
                          <ShoppingBag size={18} />
                        </div>
                      )}
                    </div>
                    <div className="desktop-sidebar__card-title">{c.title}</div>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
export const DesktopSidebar = memo(DesktopSidebarBase);
