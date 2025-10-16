// src/app/category/[slug]/page.tsx - FIXED VERSION
"use client"; // ✅ ADD THIS AT THE TOP

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchCategories, fetchProducts } from "@/services/catalog";
import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@/types";
import { Leaf, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Remove this line - not needed in client component
// export const revalidate = 30;

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<Category | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
          fetchCategories(),
          fetchProducts({ category: slug, limit: 12 }),
        ]);

        const categoriesData: Category[] = catsRes.data ?? [];
        const productsData: Product[] = prodsRes.data ?? [];

        setCategories(categoriesData);
        setProducts(productsData);
        setCurrent(
          categoriesData.find((c: Category) => c.slug === slug) || null
        );
      } catch (error) {
        console.error("Failed to load category data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 mx-auto animate-pulse">
              <Leaf className="w-10 h-10 text-green-600" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-8 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <ShoppingBag className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              এই ক্যাটাগরিতে কোনো পণ্য নেই
            </h2>
            <p className="text-gray-600 mb-8">
              শীঘ্রই নতুন জৈব পণ্য যোগ করা হবে
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              সব পণ্য দেখুন
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-green-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Category Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-green-100 rounded-xl">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {current?.title || "ক্যাটাগরি"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {products.length} টি তাজা জৈব পণ্য
              </p>
            </div>
          </div>

          {/* Category Description (if available) */}
          {current?.description && (
            <div className="bg-white rounded-xl p-4 border border-green-100 mt-4">
              <p className="text-gray-700 text-sm md:text-base">
                {current.description}
              </p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* See All Button */}
        <div className="mt-8 md:mt-12 flex justify-center">
          <Link
            href={`/products?category=${slug}`}
            className="group inline-flex items-center gap-2 bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-full hover:bg-green-600 hover:text-white transition-all shadow-md hover:shadow-lg font-semibold"
          >
            সব পণ্য দেখুন
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-green-100 text-center">
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="font-semibold text-gray-800 mb-2">১০০% জৈব</h3>
            <p className="text-sm text-gray-600">
              রাসায়নিক মুক্ত প্রাকৃতিক পণ্য
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-green-100 text-center">
            <div className="text-3xl mb-3">🚜</div>
            <h3 className="font-semibold text-gray-800 mb-2">
              সরাসরি খামার থেকে
            </h3>
            <p className="text-sm text-gray-600">
              তাজা ও মানসম্পন্ন পণ্যের নিশ্চয়তা
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-green-100 text-center">
            <div className="text-3xl mb-3">🏡</div>
            <h3 className="font-semibold text-gray-800 mb-2">হোম ডেলিভারি</h3>
            <p className="text-sm text-gray-600">
              দ্রুত ও নিরাপদ ডেলিভারি সেবা
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
