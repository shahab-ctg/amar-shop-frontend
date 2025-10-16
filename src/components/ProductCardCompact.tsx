// components/ProductCardCompact.tsx
import Link from "next/link";
import type { Product } from "@/types";
import Image from "next/image";

export default function ProductCardCompact({ p }: { p: Product }) {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <div className="relative w-full h-40">
        <Image
          src={p.image || "https://via.placeholder.com/400x300"}
          alt={p.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium line-clamp-1">{p.title}</h3>
        <div className="mt-1 text-sm font-semibold">৳{p.price}</div>
        <Link
          href={`/products/${p.slug}`}
          className="mt-3 block text-center rounded-xl border px-3 py-2 hover:bg-gray-50"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
