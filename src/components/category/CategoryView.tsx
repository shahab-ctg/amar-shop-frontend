
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {  ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

import { fetchCategories, fetchProducts } from "@/services/catalog";
import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@/types";

export default function CategoryView({ slug }: { slug: string }) {
  const [_categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<Category | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
          fetchCategories(),
          fetchProducts({ category: slug, limit: 12 }),
        ]);
        if (!active) return;
        const cats = catsRes.data ?? [];
        const prods = prodsRes.data ?? [];
        setCategories(cats);
        setProducts(prods);
        setCurrent(cats.find((c) => c.slug === slug) || null);
      } catch (e) {
        console.error("Category load failed:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  // Loading state with improved responsive skeleton
  if (loading) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4 sm:mb-6 mx-auto animate-pulse">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
            </div>
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-36 sm:w-48 mx-auto mb-3 sm:mb-4 animate-pulse" />
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32 mx-auto mb-6 sm:mb-8 animate-pulse" />

            {/* Skeleton Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mt-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-2xl aspect-[3/4] animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state with responsive design
  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4 sm:mb-6">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3 px-4">
              There is no products in this Category
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4">
              Soon add new products
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full transition-colors  sm:text-base   hover:shadow-lg   bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold hover:from-pink-600 hover:to-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 shadow-lg text-sm"
            >
              Sell All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main UI with full responsive design
  return (
    <div className=" bg-gradient-to-r from-pink-100 to-rose-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Category Header - Fully Responsive */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-2.5 bg-green-100 rounded-lg sm:rounded-xl shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight break-words">
                {current?.title || "Category"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                {products.length} more products
              </p>
            </div>
          </div>

          {/* Category Description - Responsive */}
          {current?.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-100 mt-3 sm:mt-4"
            >
              <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                {current.description}
              </p>
            </motion.div>
          )}
        </div>

        {/* Products Grid - Fully Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="w-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* See All Button - Responsive */}
        <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 flex justify-center px-3 sm:px-0">
          <Link
            href={`/products?category=${encodeURIComponent(slug)}`}
            className="group inline-flex items-center justify-center gap-2 bg-white border-2 border-pink-600  px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full hover:bg-green-600 hover:text-white transition-all  hover:shadow-lg  sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none  bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold hover:from-pink-600 hover:to-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 shadow-lg text-sm"
          >
            See All Products
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trust Badges - Fully Responsive */}
        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 sm:p-5 md:p-6 border border-green-100 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🌱</div>
            <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
              100 % Original
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Trusted Original Products
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 sm:p-5 md:p-6 border border-green-100 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🚜</div>
            <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
              Collectected From Company
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              New & Trusted Proudcts
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 sm:p-5 md:p-6 border border-green-100 text-center hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1"
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🏡</div>
            <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
              Home Delivery
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Safe & Quick Delivery
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
