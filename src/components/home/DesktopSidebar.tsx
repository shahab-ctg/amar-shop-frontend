"use client";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShoppingBag } from "lucide-react";
import type { Category } from "@/lib/schemas";
import { memo, useState, useEffect, useRef } from "react";

interface Props {
  categories: Category[];
  loading: boolean;
}

function DesktopSidebarBase({ categories, loading }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <aside className="hidden lg:block">
        <div className="desktop-sidebar h-full">
          <div className="desktop-sidebar__header">
            <Sparkles size={18} /> Categories
          </div>
          <div className="desktop-sidebar__content">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`safe-${i}`} className="desktop-sidebar__skeleton" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

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
                  <div
                    key={`load-${i}`}
                    className="desktop-sidebar__skeleton"
                  />
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
                    <div className="desktop-sidebar__card-title font-bold text-[32px]">{c.title}</div>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export const DesktopSidebar = memo(DesktopSidebarBase);
