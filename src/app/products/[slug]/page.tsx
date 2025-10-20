// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchProduct, fetchProducts } from "@/services/catalog";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { Check, Phone, Truck, Shield } from "lucide-react";
import ProductActions from "@/components/product/ProductActions";

export const revalidate = 0; // live; services already no-store
export const dynamic = "force-dynamic";

// NOTE: আপনার টাইপ 그대로 রাখলাম (Promise). চাইলে নিচে type-only fix।
export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "01700-000000";
  const { slug } = await params;

  // Load product
  const res = await fetchProduct(slug).catch(() => null);
  if (!res?.data) return notFound();
  const product = res.data as Product;

  // Load related (same category), exclude self
  let related: Product[] = [];
  if (product.categorySlug) {
    const rel = await fetchProducts({
      category: product.categorySlug,
      limit: 8,
      sort: "-createdAt",
    }).catch(() => ({ data: [] as Product[] }));
    related = (rel?.data || []).filter((p) => p.slug !== product.slug);
  }

  const hasDiscount =
    (product.compareAtPrice ?? 0) > product.price || product.isDiscounted;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Top layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
          {/* Image */}
          <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 md:p-5">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  📦
                </div>
              )}
            </div>
          </div>

          {/* Info + actions */}
          <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
              {product.title}
            </h1>

            {/* Price block */}
            <div className="mt-3 flex flex-wrap items-end gap-2.5 sm:gap-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                ৳{product.price.toFixed(2)}
              </div>
              {hasDiscount && product.compareAtPrice ? (
                <div className="text-lg text-gray-400 line-through">
                  ৳{product.compareAtPrice.toFixed(2)}
                </div>
              ) : null}
              {hasDiscount ? (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                  Discount
                </span>
              ) : null}
            </div>

            {/* Small details */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Check
                  className="w-4 h-4 text-emerald-600"
                  aria-hidden="true"
                />
                {product.stock && product.stock > 0 ? "স্টকে আছে" : "স্টক শেষ"}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Truck
                  className="w-4 h-4 text-emerald-600"
                  aria-hidden="true"
                />
                ফ্রি ডেলিভারি
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Shield
                  className="w-4 h-4 text-emerald-600"
                  aria-hidden="true"
                />
                ১০০% জৈব পণ্য
              </div>
            </div>

            {/* Actions (client) */}
            <div className="mt-6">
              <ProductActions product={product} hotline={hotline} />
            </div>

            {/* Extra info */}
            <div className="mt-6 text-gray-700 leading-relaxed">
              <p>
                আমাদের পণ্যগুলো সরাসরি খামার থেকে সংগ্রহ করা হয়। সর্বোচ্চ মানের
                নিশ্চয়তা ও সতেজতা বজায় রেখে ডেলিভারি করা হয়।
              </p>
              <div className="mt-3 text-sm text-gray-600 break-words">
                ক্যাটাগরি:{" "}
                {product.categorySlug ? (
                  <Link
                    className="text-emerald-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                    href={`/products?category=${product.categorySlug}`}
                  >
                    {product.categorySlug}
                  </Link>
                ) : (
                  "N/A"
                )}
              </div>
            </div>

            {/* Hotline */}
            <div className="mt-6">
              <a
                href={`tel:${hotline}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-200 text-green-700 font-semibold rounded-xl hover:bg-green-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                হটলাইন: {hotline}
              </a>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-10 md:mt-12">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                আরও মিলযুক্ত পণ্য
              </h2>
              <Link
                href={
                  product.categorySlug
                    ? `/products?category=${product.categorySlug}`
                    : "/products"
                }
                className="text-emerald-700 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                aria-label="See all related products"
              >
                সব দেখুন →
              </Link>
            </div>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6"
              aria-label="Related products"
            >
              {related.map((p) => (
                <div key={p._id} className="min-w-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------- Optional type-only fix (চাইলে নিন) --------
export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  ...
}
------------------------------------------------------ */
