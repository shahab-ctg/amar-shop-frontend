"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Flame } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

export default function DiscountedGrid({
  products,
  loading,
}: {
  products: Product[];
  loading: boolean;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-green-600 flex items-center gap-3"
        >
          <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
          Discounted Products
        </motion.h2>

        <Link
          href="/products?discounted=true"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-colors"
        >
          See All <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : products.length ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
        >
          {products.map((p) => (
            <ProductCard key={p._id} product={p} showDiscount />
          ))}
        </motion.div>
      ) : (
        <div className="bg-white rounded-2xl p-6 text-center text-gray-600">
          No discounted products right now.
        </div>
      )}

      <div className="sm:hidden mt-6 flex justify-center">
        <Link
          href="/products?discounted=true"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl"
        >
          See All <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
