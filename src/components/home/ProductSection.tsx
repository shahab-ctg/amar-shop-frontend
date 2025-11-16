/* src/components/ProductSection.tsx */
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { AppProduct } from "@/types/product";
import ProductCard from "../ProductCard";


interface ProductSectionProps {
  title: string;
  subtitle?: string;
  href: string;
  products: AppProduct[];
  loading?: boolean;
  variant?: "default" | "compact";
  showViewAll?: boolean;
}

export default function ProductSection({
  title,
  subtitle,
  href,
  products,
  loading = false,
  variant = "default",
  showViewAll = true,
}: ProductSectionProps) {
  // Loading skeleton
  if (loading) {
    return (
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-2xl animate-pulse aspect-[3/4]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products?.length) {
    return null;
  }

  return (
    <section className="py-8 lg:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="flex-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#167389] mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl line-clamp-2 font-extralight">{subtitle}</p>
            )}
          </div>

          {showViewAll && (
            <Link
              href={href}
              className="inline-flex w-30 h-10 items-center gap-2 px-3 py-2 bg-gradient-to-r bg-[#167389] text-white rounded-md font-semibold hover:shadow-lg transition-all duration-300 hover:gap-3 group"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product._id || `product-${index}`}
              product={product}
              variant={variant}
              compact={variant === "compact"}
              showDiscount={true}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        {showViewAll && (
          <div className="flex justify-center mt-8 lg:hidden">
            <Link
              href={href}
              className="w-full max-w-sm px-6 py-3 bg-cyan-700 text-white rounded-xl font-semibold text-center hover:bg-gray-800 transition-colors"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}