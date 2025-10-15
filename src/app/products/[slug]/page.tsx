// app/products/[slug]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart";
import Image from "next/image";

export default function ProductDetails({
  params,
}: {
  params: { slug: string };
}) {
  const [data, setData] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/product-proxy/${params.slug}`); // নিচে proxy route নোট দেখো
      const json = await res.json();
      setData(json.data);
    })();
  }, [params.slug]);

  if (!data)
    return <div className="mx-auto max-w-6xl px-4 py-6">Loading...</div>;

  const relatedLink = `/products?category=${data.categorySlug || ""}`;
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6 md:grid-cols-2">
      <Image
        src={data.image || "https://via.placeholder.com/600x400"}
        alt={data.title}
        className="w-full h-80 object-cover rounded-2xl border"
      />
      <div>
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <div className="mt-2 text-xl font-semibold">৳{data.price}</div>

        {/* optional variants via tagSlugs */}
        {Array.isArray(data.tagSlugs) && data.tagSlugs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.tagSlugs.map((t: string) => (
              <span key={t} className="rounded-full border px-3 py-1 text-sm">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="rounded-lg border h-10 w-10"
          >
            -
          </button>
          <span className="w-10 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="rounded-lg border h-10 w-10"
          >
            +
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => add(data, qty)}
            className="rounded-xl border px-3 py-2 hover:bg-gray-50"
          >
            Add to cart
          </button>
          <a
            href="tel:+8801700000000"
            className="rounded-xl border px-3 py-2 text-center hover:bg-gray-50"
          >
            Order now (Call)
          </a>
        </div>

        <p className="mt-4 text-gray-600 text-sm">
          Small details about the product. Safe storage, origin, etc.
        </p>

        <div className="mt-6">
          <a href={relatedLink} className="underline">
            See related products
          </a>
        </div>
      </div>
    </div>
  );
}
