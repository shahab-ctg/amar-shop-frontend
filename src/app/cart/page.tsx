/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  X,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

// helpers
const toNum = (v: unknown, f = 0) =>
  Number.isFinite(Number(v)) ? Number(v) : f;
const money = (n: number) => `৳${toNum(n).toFixed(2)}`;
const getStock = (it: any): number => {
  const s =
    toNum(it?.stock, NaN) ??
    toNum((it as any)?.availableQty, NaN) ??
    toNum((it as any)?.stockQty, NaN);
  return Number.isFinite(s) ? s : Infinity;
};

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  const total = useMemo(() => money(getTotalPrice?.() ?? 0), [getTotalPrice]);

  // empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-white text-center px-4 sm:px-6 py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-cyan-50 rounded-full mb-6">
          <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-[#167389]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6 max-w-xs sm:max-w-md mx-auto text-sm sm:text-base">
          Add Original products to your bag and start a healthy lifestyle
          today!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#167389] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-cyan-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base font-medium"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          Shop Products
        </Link>
      </div>
    );
  }

  // ✅ summary panel
  const SummaryPanel = () => (
    <div className="bg-white rounded-2xl border border-cyan-100 p-5 sm:p-6 shadow-md sm:shadow-lg text-sm sm:text-base">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-cyan-600" />
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>Items ({items.length})</span>
          <span className="font-semibold">{total}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Delivery</span>
          <span className="font-semibold text-cyan-600">FREE</span>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-semibold text-gray-800">
              Grand Total
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#167389]">
              {total}
            </span>
          </div>
        </div>
      </div>

      <Link href="/checkout" className="block">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-[#167389] to-[#167389]  hover:from-cyan-200 hover:to-cyan-600 text-white py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base hover:bg-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          Proceed to Checkout
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </Link>

      <button
        onClick={clearCart}
        className="hidden lg:flex w-full items-center justify-center gap-2 mt-4 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-medium text-sm sm:text-base"
      >
        <Trash2 className="w-4 h-4" />
        Clear All
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-8">
      <div className="mx-auto max-w-6xl px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#167389]" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Your Shopping Bag
            </h1>
          </div>
        </div>

        {/* Items + Summary grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence initial={false} mode="popLayout">
              {items.map((item) => {
                const price = toNum(item.price);
                const qty = Math.max(1, toNum(item.quantity, 1));
                const line = price * qty;
                const stock = getStock(item);
                const outOfStock = stock === 0;
                const atMax = qty >= stock;

                return (
                  <motion.div
                    key={item._id}
                    layout="position"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="bg-white rounded-2xl border border-cyan-100 p-3 sm:p-4 md:p-5 shadow-sm 
             flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5"
                  >
                    {/* 🖼 Product Image */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl overflow-hidden 
                    bg-gray-50 ring-1 ring-cyan-100 flex items-center justify-center"
                      >
                        <Image
                          src={item.image || "https://via.placeholder.com/112"}
                          alt={item.title}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      {outOfStock && (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow">
                          Out
                        </span>
                      )}
                    </div>

                    {/* 📄 Item Details */}
                    <div className="flex-1 w-full min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start w-full mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg mb-1 line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-gray-700">
                            <span className="font-semibold text-cyan-700">
                              {money(price)}
                            </span>
                            <span className="text-gray-400">×</span>
                            <span className="font-medium">{qty}</span>
                            {Number.isFinite(stock) && stock !== Infinity && (
                              <span className="ml-1 text-[11px] sm:text-xs text-gray-500">
                                (Stock: {stock})
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {/* ➕ Quantity & total */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 mt-1">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-cyan-50 rounded-xl px-1 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(item._id, Math.max(1, qty - 1))
                            }
                            disabled={qty <= 1 || outOfStock}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-white 
                     border border-cyan-200 text-cyan-700 hover:bg-cyan-100 
                     transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <div className="min-w-[2rem] text-center font-semibold text-gray-800 text-sm sm:text-base">
                            {qty}
                          </div>
                          <button
                            onClick={() => updateQuantity(item._id, qty + 1)}
                            disabled={outOfStock || atMax}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-white 
                     border border-cyan-200 text-cyan-700 hover:bg-cyan-100 
                     transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>

                        {/* Line total */}
                        <div className="text-right flex-1">
                          <div className="text-[10px] sm:text-xs text-gray-500 leading-none">
                            Total
                          </div>
                          <div className="text-sm sm:text-base md:text-lg font-bold text-cyan-700">
                            {money(line)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* ✅ Clear cart - mobile */}
            <button
              onClick={clearCart}
              className="w-full lg:hidden flex items-center justify-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition text-sm sm:text-base font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>

            {/* ✅ Order summary below items (mobile) */}
            <div className="block lg:hidden mt-4 sm:mt-6">
              <SummaryPanel />
            </div>
          </div>

          {/* ✅ Desktop Summary Panel */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-4">
              <SummaryPanel />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
