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
    <div className="relative w-full h-[160px] sm:h-[280px] lg:h-full overflow-hidden border border-red-200 bg-white shadow-sm">
      <div className="relative w-full h-full">
        {BANNER_IMAGES.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt={`Banner ${i + 1}`}
            fill
            priority={i === 0}
            className={`object-cover transition-all duration-700 ease-in-out ${
              i === index
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="absolute bottom-4 left-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 text-rose-700 px-3 py-1.5 text-xs sm:text-sm font-medium shadow hover:shadow-md hover:-translate-y-0.5 transition"
        >
          Shop now <ChevronRight size={14} />
        </Link>
      </div>

      {/* Dots */}
      <div className="absolute bottom-2 right-3 flex gap-1.5">
        {BANNER_IMAGES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition ${
              i === index ? "bg-rose-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
export const BannerCarousel = memo(BannerCarouselBase);
