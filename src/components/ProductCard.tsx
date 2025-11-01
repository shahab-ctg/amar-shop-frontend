"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Star } from "lucide-react";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  showDiscount?: boolean;
}

export default function ProductCard({
  product,
  showDiscount = false,
}: ProductCardProps) {
  const img =
    product.image ?? "https://via.placeholder.com/600x400?text=Product";
  const stock = product.stock ?? 0;

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : 0;

  const isOutOfStock = stock === 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group relative border border-gray-100"
    >
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="product-card__image product-card__image--bleed rounded-t-md relative overflow-hidden">
          <Image
            src={product.image ?? "/placeholder.png"}
            alt={product.title}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 20vw"
            className="product-card__img product-card__img--cover"
            priority={false}
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 sm:p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors min-h-[3rem]">
            {product.title}
          </h3>
        </Link>

        {/* Mock Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < 4 ? "text-pink-400 fill-pink-400" : "text-gray-300"
              }
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            ৳{product.price}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              ৳{product.compareAtPrice}
            </span>
          )}
        </div>

        {/* View Details */}
        <Link href={`/products/${product.slug}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#167389] to-[#167389] hover:from-cyan-200 hover:to-cyan-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
            disabled={isOutOfStock}
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">See Details</span>
          </motion.button>
        </Link>

        {/* Stock Info */}
        <p className="text-xs text-gray-500 mt-2 text-center">
          {isOutOfStock ? (
            <span className="text-red-500 font-semibold">Out of Stock</span>
          ) : stock < 10 ? (
            <span className="text-orange-500 font-semibold">
              Only {stock} more left!
            </span>
          ) : (
            <span className="text-pink-600">In Stock</span>
          )}
        </p>
      </div>
    </motion.div>
  );
}
