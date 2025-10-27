"use client";
import { useState, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const BANNER_IMAGES = [
  "/hero1.webp",
  "/hero2.webp",
  "/hero3.webp",
  "/hero4.webp",
  "/hero6.webp",
  "/hero7.webp",
];

function BannerCarouselBase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % BANNER_IMAGES.length),
      3000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden border border-gray-200 bg-white shadow-sm h-full w-full">
      <div className="relative h-[180px] sm:h-[250px] lg:h-[360px]">
        {BANNER_IMAGES.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt={`Banner ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width:1024px) 100vw, 70vw"
            className={`object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute bottom-3 left-3 sm:left-5">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 text-rose-700 px-3 py-1.5 text-xs sm:text-sm font-medium shadow hover:shadow-md hover:-translate-y-0.5 transition"
          >
            Shop now <ChevronRight size={14} />
          </Link>
        </div>
      </div>
      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex gap-1.5">
        {BANNER_IMAGES.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
export const BannerCarousel = memo(BannerCarouselBase);
