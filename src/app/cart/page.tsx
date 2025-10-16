// app/cart/page.tsx
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

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <ShoppingCart className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              আপনার ব্যাগ খালি
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              তাজা ও জৈব পণ্য দিয়ে আপনার ব্যাগ পূর্ণ করুন। স্বাস্থ্যকর জীবনযাপন
              শুরু করুন আজ থেকেই!
            </p>
            <a
              href="/products"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <ShoppingBag className="w-5 h-5" />
              পণ্য কিনুন
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              আপনার শপিং ব্যাগ
            </h1>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Leaf className="w-4 h-4 text-green-600" />
            <p className="text-sm">
              {items.length} টি জৈব পণ্য • তাজা ও স্বাস্থ্যকর
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border-2 border-green-100 p-4 md:p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden bg-green-50 ring-2 ring-green-200">
                        <Image
                          src={item.image || "https://via.placeholder.com/112"}
                          alt={item.title}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Organic Badge */}
                      <div className="absolute -top-2 -right-2 bg-green-600 rounded-full p-1.5 shadow-md">
                        <Leaf className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-1 line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium text-green-600">
                              ৳{item.price}
                            </span>
                            <span className="text-gray-400">×</span>
                            <span>{item.quantity}</span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>

                      {/* Quantity Controls & Price */}
                      <div className="flex items-center justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-green-50 rounded-xl p-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-green-200 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>

                          <div className="w-12 text-center font-semibold text-gray-800">
                            {item.quantity}
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-green-200 text-green-600 hover:bg-green-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {/* Item Total Price */}
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-0.5">
                            মোট
                          </div>
                          <div className="text-lg md:text-xl font-bold text-green-600">
                            ৳{item.price * item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart Button - Mobile */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearCart}
              className="w-full lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" />
              সব মুছে ফেলুন
            </motion.button>
          </div>

          {/* Order Summary Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl border-2 border-green-100 p-6 shadow-lg sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                অর্ডার সামারি
              </h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-gray-600">
                  <span>পণ্য ({items.length})</span>
                  <span className="font-medium">৳{getTotalPrice()}</span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>

                <div className="border-t-2 border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      সর্বমোট
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ৳{getTotalPrice()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <a href="/checkout">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  চেকআউট করুন
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </a>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="block text-center mt-4 text-green-600 hover:text-green-700 font-medium text-sm"
              >
                শপিং চালিয়ে যান →
              </Link>

              {/* Clear Cart - Desktop */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearCart}
                className="hidden lg:flex w-full items-center justify-center gap-2 mt-4 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
                সব মুছে ফেলুন
              </motion.button>

              {/* Organic Badge */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800 mb-1">
                      ১০০% জৈব পণ্য
                    </p>
                    <p className="text-xs text-green-700">
                      রাসায়নিক মুক্ত, তাজা ও স্বাস্থ্যকর পণ্যের নিশ্চয়তা
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-xl p-4 border border-green-100 text-center">
            <div className="text-2xl mb-2">🚚</div>
            <h3 className="font-semibold text-gray-800 mb-1">ফ্রি ডেলিভারি</h3>
            <p className="text-xs text-gray-600">
              সব অর্ডারে ফ্রি হোম ডেলিভারি
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-green-100 text-center">
            <div className="text-2xl mb-2">🌿</div>
            <h3 className="font-semibold text-gray-800 mb-1">১০০% জৈব</h3>
            <p className="text-xs text-gray-600">
              সম্পূর্ণ রাসায়নিক মুক্ত পণ্য
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-green-100 text-center">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-semibold text-gray-800 mb-1">তাজা পণ্য</h3>
            <p className="text-xs text-gray-600">সরাসরি খামার থেকে আপনার ঘরে</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
