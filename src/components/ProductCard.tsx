/* eslint-disable @typescript-eslint/no-explicit-any */
/* src/components/ProductCard.tsx */
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { AppProduct } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

type Props = {
  product: AppProduct | any;
  showDiscount?: boolean;
  compact?: boolean;
  onAddToCart?: (p: any, qty?: number) => Promise<void> | void;
  onLocalStockChange?: (id: string, newStock: number) => void;
  variant?: "default" | "compact";
};

const formatPrice = (v?: number) =>
  `৳${Number(v ?? 0).toLocaleString("en-BD")}`;

export default function ProductCard({
  product,
  showDiscount = true,
  compact = false,
  onAddToCart,
  onLocalStockChange,
}: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const title = String(product?.title ?? product?.name ?? "Untitled");
  const slug = String(product?.slug ?? product?._id ?? "");
  const images = Array.isArray(product?.images)
    ? product.images
    : product?.image
      ? [product.image]
      : [];
  const image = images.length ? images[0] : "/images/placeholder.png";
  const price = Number(product?.price ?? 0);
  const compare = Number(product?.compareAtPrice ?? 0);
  const discount =
    compare > price && price > 0
      ? Math.round(((compare - price) / compare) * 100)
      : 0;

  // reserved quantity from cart (items already in cart)
  const reservedQty = useMemo(() => {
    const found = cartItems.find((c) => String(c._id) === String(product._id));
    return found?.quantity ?? 0;
  }, [cartItems, product._id]);

  // source-of-truth stock: prefer availableStock then stock then 0
  const sourceStock = Number(
    product?.availableStock ?? product?.stock ?? product?.inventory ?? 0
  );

  // local optimistic stock (starts from sourceStock)
  const [localStock, setLocalStock] = useState<number>(sourceStock);
  useEffect(() => {
    // if server/props change, sync localStock (but preserve local optimistic delta only when ids match)
    setLocalStock(sourceStock);
  }, [sourceStock, product._id]);

  // helper: notify parent/shelf about local stock change
  const notifyLocalStock = (newStock: number) => {
    setLocalStock(newStock);
    try {
      if (typeof onLocalStockChange === "function") {
        onLocalStockChange(String(product._id), newStock);
      }
    } catch (e) {
      console.error("onLocalStockChange callback error", e);
    }
  };

  // available (after reserved by cart)
  const available = Math.max(0, localStock - reservedQty);
  const isOut = available <= 0;
  const isLow = !isOut && available <= 5;

  const [adding, setAdding] = useState(false);

    const handleAdd = async (qty = 1) => {
      if (isOut) {
        toast.error("Out of stock");
        return;
      }
      if (qty > available) {
        toast.error(`Only ${available} left`);
        return;
      }

      try {
        setAdding(true);

        // **DO NOT** optimistic decrease localStock here.
        // Instead rely on cart store update which will change reservedQty,
        // and since available = localStock - reservedQty, UI will reflect the change.

        if (onAddToCart) {
          await Promise.resolve(onAddToCart(product, qty));
        } else {
          addItem({
            _id: String(product._id),
            title,
            slug,
            price,
            image,
            quantity: qty,
          });
        }

        toast.success(`${qty} × ${title} added to cart`);
      } catch (e) {
        console.error("Add to cart failed", e);
        toast.error("Failed to add to cart");
      } finally {
        setTimeout(() => setAdding(false), 250);
      }
    };


  const handleBuyNow = async () => {
    if (isOut) {
      toast.error("Out of stock");
      return;
    }
    try {
      await handleAdd(1);
      router.push("/checkout");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={`group bg-white rounded-2xl shadow-sm transition-shadow overflow-hidden border border-gray-100 flex flex-col ${
        compact ? "p-3" : ""
      }`}
    >
      <Link
        href={`/products/${slug}`}
        className="relative w-full h-44 sm:h-52 md:h-64 bg-white flex items-center justify-center overflow-hidden"
        aria-label={`View ${title}`}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />

        {/* TOP LEFT: discount / low / out badge */}
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          {showDiscount && discount > 0 && (
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {isOut ? (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              Out
            </span>
          ) : isLow ? (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              Low
            </span>
          ) : null}
        </div>

        {/* TOP RIGHT: small reserved indicator */}
        <div className="absolute top-3 right-3 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full shadow">
          {reservedQty > 0 ? `In cart: ${reservedQty}` : "Available"}
        </div>

        {/* BOTTOM LEFT: prominent Stock badge (visible) */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <div
            className={`text-xs px-2 py-1 rounded-full shadow-sm font-semibold ${
              isOut ? "bg-red-600 text-white" : "bg-white/95 text-gray-800"
            }`}
            aria-hidden
          >
            {isOut ? "Out of stock" : `Stock: ${available}`}
          </div>
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <Link href={`/products/${slug}`} className="mb-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>
        </Link>

        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              {formatPrice(price)}
            </div>
            {compare > price && (
              <div className="text-sm text-gray-400 line-through">
                {formatPrice(compare)}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-600">
            {isOut ? (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            ) : isLow ? (
              <span className="text-orange-500 font-semibold">
                Only {available} left
              </span>
            ) : (
              <span className="text-green-600 font-semibold">In Stock</span>
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row gap-2">
          {/* Add button */}
          <button
            onClick={() => handleAdd(1)}
            disabled={isOut || adding}
            aria-disabled={isOut || adding}
            className="flex-1 px-3 py-2 rounded-lg bg-[#167389] text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {adding ? "Adding..." : "Add"}
          </button>

          {/* Buy Now: on small screens this will be below (flex-col), on larger side-by-side */}
          <button
            onClick={handleBuyNow}
            disabled={isOut || adding}
            aria-disabled={isOut || adding}
            className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Buy</span>
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
