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
  Leaf,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

// number-safe helpers
const toNum = (v: unknown, f = 0) =>
  Number.isFinite(Number(v)) ? Number(v) : f;
const money = (n: number) => `৳${toNum(n).toFixed(2)}`;

// ✅ স্টক বের করার helper (আপনার কার্ট আইটেমে যে প্রপার্টি আছে সেটাই ধরুন)
const getStock = (it: any): number => {
  // আপনার ব্যাকএন্ড/কার্ট-স্টোরে stock, availableQty, stockQty—যেটা আছে সেটাই ধরবে
  const s =
    toNum(it?.stock, NaN) ??
    toNum((it as any)?.availableQty, NaN) ??
    toNum((it as any)?.stockQty, NaN);
  return Number.isFinite(s) ? s : Infinity; // স্টক না থাকলে unlimited
};

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const total = useMemo(() => money(getTotalPrice?.() ?? 0), [getTotalPrice]);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <ShoppingCart className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Add fresh organic products to your bag and start a healthy lifestyle
            today!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-medium focus-visible:ring-2 focus-visible:ring-green-500"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop products
          </Link>
        </div>
      </div>
    );
  }

  const SummaryPanel = () => (
    <div className="bg-white rounded-2xl border-2 border-green-100 p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-green-600" />
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center text-gray-700">
          <span className="text-sm sm:text-base">Items ({items.length})</span>
          <span className="font-semibold">{total}</span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span className="text-sm sm:text-base">Delivery</span>
          <span className="font-semibold text-green-600">FREE</span>
        </div>
        <div className="border-t-2 border-gray-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">
              Grand Total
            </span>
            <span className="text-2xl font-bold text-green-600">{total}</span>
          </div>
        </div>
      </div>

      <Link href="/checkout" className="block">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-green-500"
        >
          Proceed to Checkout
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </Link>

      <button
        onClick={clearCart}
        className="hidden lg:flex w-full items-center justify-center gap-2 mt-4 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium focus-visible:ring-2 focus-visible:ring-red-300"
      >
        <Trash2 className="w-4 h-4" />
        Clear all
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 pb-24 lg:pb-8">
      <div className="mx-auto max-w-6xl px-4 xs:px-5 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Your Shopping Bag
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence initial={false} mode="popLayout">
              {items.map((item, idx) => {
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
                    className="bg-white rounded-2xl border-2 border-green-100 p-4 md:p-6 shadow-sm"
                  >
                    <div className="flex flex-row sm:flex-row gap-4 sm:gap-5">
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-green-50 ring-2 ring-green-200">
                          <Image
                            src={
                              item.image || "https://via.placeholder.com/112"
                            }
                            alt={item.title}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {outOfStock && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full shadow">
                            Out of stock
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-1 line-clamp-2">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <span className="font-semibold text-green-700">
                                {money(price)}
                              </span>
                              <span className="text-gray-400">×</span>
                              <span className="font-medium">{qty}</span>
                              {Number.isFinite(stock) && stock !== Infinity && (
                                <span className="ml-2 text-xs text-gray-500">
                                  (Stock: {stock})
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-red-300"
                            aria-label="Remove item"
                            title="Remove item"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          {/* Qty controls (স্টক-সেফ) */}
                          <div className="flex items-center gap-2 bg-green-50 rounded-xl p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, Math.max(1, qty - 1))
                              }
                              disabled={qty <= 1 || outOfStock}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-green-200 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-green-300"
                              aria-label="Decrease quantity"
                              title="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <div className="min-w-10 text-center font-semibold text-gray-800">
                              {qty}
                            </div>

                            <button
                              onClick={() => updateQuantity(item._id, qty + 1)}
                              disabled={outOfStock || atMax}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-green-200 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-green-300"
                              aria-label="Increase quantity"
                              title={
                                atMax && stock !== Infinity
                                  ? "Reached stock limit"
                                  : "Increase quantity"
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-0.5">
                              Total
                            </div>
                            <div className="text-lg md:text-xl font-bold text-green-600">
                              {money(line)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Clear cart – mobile */}
            <button
              onClick={clearCart}
              className="w-full lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium focus-visible:ring-2 focus-visible:ring-red-300"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          </div>

          {/* Summary (Desktop) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-4">
              <SummaryPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed lg:hidden left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 pb-[env(safe-area-inset-bottom,0)]">
        <div className="max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <div className="text-sm">
            <div className="text-gray-600">Total</div>
            <div className="text-lg font-bold text-green-700">{total}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileSummary(true)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-300"
            >
              View Summary
            </button>
            <Link
              href="/checkout"
              className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile summary drawer */}
      {showMobileSummary && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileSummary(false)}
            aria-label="Close summary"
          />
          <div className="absolute left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-white p-4 pb-[calc(env(safe-area-inset-bottom,0)+16px)] shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <button
                onClick={() => setShowMobileSummary(false)}
                className="p-2 rounded-lg hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-300"
                aria-label="Close summary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="pt-3 overflow-y-auto">
              <SummaryPanel />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
