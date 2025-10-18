"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

export default function LatestGrid({
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.25 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-green-600"
        >
          Latest Products
        </motion.h2>

        <Link
          href="/products"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-colors"
        >
          See All <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : products.length ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </motion.div>
      ) : (
        <div className="bg-white rounded-2xl p-6 text-center text-gray-600">
          No products found.
        </div>
      )}

      <div className="sm:hidden mt-6 flex justify-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl"
        >
          See All <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
