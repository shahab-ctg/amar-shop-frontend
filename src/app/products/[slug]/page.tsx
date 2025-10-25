import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchProduct, fetchProducts } from "@/services/catalog";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { Check, Phone, Truck, Shield, Sparkles } from "lucide-react";
import ProductActions from "@/components/product/ProductActions";
import ProductGallery from "@/components/product/ProductGallery";
import ProductThumbs from "@/components/product/ProductThumbs";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "01700-000000";
  const { slug } = await params;

  const res = await fetchProduct(slug).catch(() => null);
  if (!res?.data) return notFound();
  const product = res.data as Product;

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
    const galleryImages =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((product as any)?.images as string[] | undefined)?.filter(Boolean) ??
      (product.image ? [product.image] : []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Top layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
          {/* Image */}
          {/* <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-pink-100 p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 shadow-inner">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-pink-300" />
                </div>
              )}
            </div>
          </div> */}

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-pink-100 p-3 sm:p-4 md:p-6 lg:p-8">
            {/* 👇 এই id-টা যোগ করুন */}
            <div
              id={`main-img-box-${product._id}`}
              className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 shadow-inner"
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-pink-300" />
                </div>
              )}
            </div>

            {/* ✅ থাম্বনেইল বার (main image-এর ঠিক নিচে) */}
            <ProductThumbs
              title={product.title}
              mainBoxId={`main-img-box-${product._id}`}
              images={galleryImages}
            />
          </div>

          {/* Info + actions */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-pink-100 p-5 sm:p-6 md:p-7 lg:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] font-bold text-gray-900 break-words leading-tight tracking-tight">
              {product.title}
            </h1>

            {/* Price block */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-end gap-2.5 sm:gap-3">
              <div className="text-3xl sm:text-4xl md:text-4xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                ৳{product.price.toFixed(2)}
              </div>
              {hasDiscount && product.compareAtPrice ? (
                <div className="text-lg sm:text-xl md:text-2xl text-gray-400 line-through font-semibold">
                  ৳{product.compareAtPrice.toFixed(2)}
                </div>
              ) : null}
              {hasDiscount ? (
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-2 border-pink-300 shadow-sm">
                  Special Offer
                </span>
              ) : null}
            </div>

            {/* Small details */}
            <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-sm sm:text-base">
              <div className="flex items-center gap-2 sm:gap-2.5 text-gray-700 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-pink-200 shadow-sm">
                <Check
                  className="w-5 h-5 sm:w-5 sm:h-5 text-pink-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="font-semibold text-sm sm:text-base">
                  {product.stock && product.stock > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 text-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-purple-200 shadow-sm">
                <Truck
                  className="w-5 h-5 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="font-semibold text-sm sm:text-base">
                  Free Delivery
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 text-gray-700 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-rose-200 shadow-sm">
                <Shield
                  className="w-5 h-5 sm:w-5 sm:h-5 text-rose-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="font-semibold text-sm sm:text-base">
                  100% Authentic
                </span>
              </div>
            </div>

            {/* Actions (client) */}
            <div className="mt-6 sm:mt-7">
              <ProductActions product={product} hotline={hotline} />
            </div>

            {/* Extra info */}
            <div className="mt-6 sm:mt-7 p-4 sm:p-5 bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 rounded-xl sm:rounded-2xl border-2 border-pink-200 shadow-sm">
              <div className="flex items-start gap-2 sm:gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base font-medium">
                  All our products are 100% authentic and of premium quality.
                  Specially curated collection for your beauty and care needs.
                </p>
              </div>
              <div className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 break-words">
                <span className="font-semibold text-gray-800">Category:</span>{" "}
                {product.categorySlug ? (
                  <Link
                    className="text-pink-600 hover:text-pink-700 font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded inline-block"
                    href={`/products?category=${product.categorySlug}`}
                  >
                    {product.categorySlug}
                  </Link>
                ) : (
                  <span className="text-gray-500">Not Available</span>
                )}
              </div>
            </div>

            {/* Hotline */}
            <div className="mt-6 sm:mt-7">
              <a
                href={`tel:${hotline}`}
                className="inline-flex items-center justify-center gap-2 sm:gap-2.5 w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl sm:rounded-2xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 text-sm sm:text-base"
              >
                <Phone className="w-5 h-5 sm:w-5 sm:h-5" aria-hidden="true" />
                <span>Hotline: {hotline}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12 sm:mt-14 md:mt-16 lg:mt-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-gray-900 leading-tight">
                  Related Products
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2 font-medium">
                  Your Favorite Collections
                </p>
              </div>
              <Link
                href={
                  product.categorySlug
                    ? `/products?category=${product.categorySlug}`
                    : "/products"
                }
                className="text-pink-600 font-bold hover:text-pink-700 transition-colors flex items-center gap-1.5 sm:gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded text-sm sm:text-base"
                aria-label="See all related products"
              >
                <span>See All</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
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
