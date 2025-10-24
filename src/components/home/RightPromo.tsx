// src/components/home/RightPromo.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/types/banner";

type Props = {
  banners: Banner[];
};

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='50%' text-anchor='middle' fill='#9ca3af' font-size='20'>Promo</text></svg>`
  );

export default function RightPromo({ banners }: Props) {
  // ডান পাশে ২টা কার্ড দেখাই
  const promo = banners.slice(0, 2);

  return (
    <aside className="hidden xl:flex w-64 shrink-0 flex-col gap-4">
      {promo.map((b) => {
        const src =
          typeof b.image === "string" && b.image.length > 3
            ? b.image
            : FALLBACK_IMG;
        return (
          <Link
            key={b._id}
            href="#"
            className="relative h-[130px] rounded-lg overflow-hidden shadow-sm group"
          >
            <Image
              src={src}
              alt={b.title}
              fill
              sizes="(max-width: 1280px) 256px, 256px"
              className="object-cover group-hover:scale-105 transition"
              priority={false}
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-2 left-2 text-white drop-shadow">
              <p className="text-sm font-medium">{b.title}</p>
              {b.discount ? (
                <span className="inline-block mt-1 text-xs bg-rose-600/90 rounded px-2 py-0.5">
                  {b.discount}
                </span>
              ) : null}
            </div>
          </Link>
        );
      })}
      {promo.length === 0 && (
        <div className="h-[130px] rounded-lg bg-gray-100 border flex items-center justify-center text-sm text-gray-500">
          No promo
        </div>
      )}
    </aside>
  );
}
