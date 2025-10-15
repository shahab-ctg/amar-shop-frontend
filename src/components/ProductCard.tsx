
"use client";
import type { Product } from "@/types";
import { useCart } from "@/context/cart";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const isOff = p.compareAtPrice && p.compareAtPrice > p.price;
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <Image
        src={p.image || "https://via.placeholder.com/400x300?text=Product"}
        alt={p.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-medium line-clamp-1">{p.title}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold">৳{p.price}</span>
          {isOff && (
            <span className="text-sm line-through text-gray-500">
              ৳{p.compareAtPrice}
            </span>
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => add(p, 1)}
            className="rounded-xl border px-3 py-2 hover:bg-gray-50"
          >
            Add to cart
          </button>
          <Link
            href={`/products/${p.slug}`}
            className="rounded-xl border px-3 py-2 text-center hover:bg-gray-50"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
