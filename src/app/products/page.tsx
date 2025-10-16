// app/products/page.tsx
import { fetchProducts, fetchCategories } from "@/services/catalog";
import ProductCard from "@/components/ProductCard";
import type { Product, Category } from "@/types";
import { Leaf, Search, Grid3x3, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const revalidate = 30;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  // Fetch all products (no pagination - show all)
  const [productsRes, categoriesRes] = await Promise.all([
    fetchProducts({
      limit: 100, // Large limit to show all products
      category: searchParams.category,
      q: searchParams.q,
    }),
    fetchCategories(),
  ]);

  const products: Product[] = productsRes.data ?? [];
  const categories: Category[] = categoriesRes.data ?? [];

  // Find active category
  const activeCategory = categories.find(
    (c) => c.slug === searchParams.category
  );

  // Empty state
  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <Search className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              কোনো পণ্য পাওয়া যায়নি
            </h2>
            <p className="text-gray-600 mb-8">
              {searchParams.q
                ? `"${searchParams.q}" এর জন্য কোনো ফলাফল নেই`
                : "শীঘ্রই নতুন জৈব পণ্য যোগ করা হবে"}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              সব পণ্য দেখুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-100 rounded-xl">
                <Grid3x3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {activeCategory?.title || "সকল পণ্য"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {products.length} টি তাজা জৈব পণ্য
                </p>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Link
                href="/products"
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  !searchParams.category
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-green-100 hover:border-green-300"
                }`}
              >
                সব পণ্য
              </Link>
              {categories.map((cat) => (
                <a
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    searchParams.category === cat.slug
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-green-100 hover:border-green-300"
                  }`}
                >
                  {cat.title}
                </a>
              ))}
            </div>
          )}

          {/* Search Info Banner */}
          {searchParams.q && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">
                  অনুসন্ধান: <strong>{searchParams.q}</strong>
                </span>
              </div>
              <Link
                href="/products"
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                ✕ মুছুন
              </Link>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {products.map((product, idx) => (
            <div
              key={product._id}
              className="animate-fade-in"
              style={{
                animationDelay: `${idx * 0.03}s`,
                animationFillMode: "backwards",
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Trust Badges Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              কেন শোধাইগ্রাম বেছে নেবেন?
            </h2>
            <p className="text-green-100">
              আমরা প্রতিশ্রুতিবদ্ধ সর্বোচ্চ মানের জৈব পণ্য সরবরাহে
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="font-bold text-lg mb-2">১০০% জৈব</h3>
              <p className="text-sm text-green-100">
                সম্পূর্ণ রাসায়নিক মুক্ত প্রাকৃতিক পণ্য
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚜</div>
              <h3 className="font-bold text-lg mb-2">সরাসরি খামার থেকে</h3>
              <p className="text-sm text-green-100">
                মধ্যস্বত্বভোগী ছাড়াই কৃষক থেকে আপনার ঘরে
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏡</div>
              <h3 className="font-bold text-lg mb-2">ফ্রি ডেলিভারি</h3>
              <p className="text-sm text-green-100">
                সকল অর্ডারে বিনামূল্যে হোম ডেলিভারি
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold text-lg mb-2">তাজা পণ্য</h3>
              <p className="text-sm text-green-100">
                প্রতিদিন সতেজ পণ্যের নিশ্চয়তা
              </p>
            </div>
          </div>
        </div>

        {/* Category Showcase (Only if not filtered) */}
        {!searchParams.category && !searchParams.q && categories.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                ক্যাটাগরি অনুযায়ী পণ্য খুঁজুন
              </h2>
              <p className="text-gray-600">
                আপনার পছন্দের ক্যাটাগরি থেকে পণ্য বেছে নিন
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat) => (
                <a
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  className="group bg-white rounded-xl p-6 border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-lg"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 mb-1">
                    {cat.title}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-gray-600 text-center line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}
