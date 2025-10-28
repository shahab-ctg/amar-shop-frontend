"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { useState } from "react";


import { X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/services/orders";
import CustomerInfoForm from "@/components/checkout/CustomerInfoForm";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";

const HOTLINE = process.env.NEXT_PUBLIC_HOTLINE || "01700-000000";

// helper
const toNum = (v: unknown, f = 0) =>
  Number.isFinite(Number(v)) ? Number(v) : f;
const money = (n: number) => `৳${toNum(n).toFixed(2)}`;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  const subtotal = getTotalPrice ? getTotalPrice() : 0;
  const delivery = 0;
  const total = subtotal + delivery;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // 🧾 handle order submit
  const handleSubmit = async (data: any) => {
    if (!items.length) {
      toast.error("Your cart is empty. Please add products first.");
      return;
    }

    const payload = {
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        houseOrVillage: data.houseOrVillage,
        roadOrPostOffice: data.roadOrPostOffice,
        blockOrThana: data.blockOrThana,
        district: data.district,
      },
      lines: items.map((it) => ({
        productId: String(it._id),
        qty: Math.max(1, toNum(it.quantity, 1)),
      })),
    };

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading("Placing your order...");
      await createOrder(payload);
      toast.dismiss(loadingToast);
      toast.success("Order placed successfully!");
      clearCart();
      setTimeout(() => router.push("/products"), 1500);
    } catch (err: any) {
      toast.dismiss();
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🛒 Empty cart view
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Please add items to proceed to checkout.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="inline-block bg-[#167389] text-white px-6 py-3 rounded-xl hover:bg-[#125f70] transition-all shadow-lg"
          >
            Browse Products
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#167389] to-[#125f70]">
            Checkout
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Fill in your details to complete the order.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
          {/* Left: Customer Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-pink-100">
              <CustomerInfoForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />

              {/* Call to Order */}
              <div className="text-center pt-6 border-t border-pink-100">
                <p className="text-gray-600 mb-3 text-sm">Or</p>
                <a
                  href={`tel:${HOTLINE}`}
                  className="inline-flex items-center gap-2 text-[#167389] hover:text-pink-700 font-semibold text-sm sm:text-base"
                >
                  📞 Call to order: {HOTLINE}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Summary (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 hidden md:block"
          >
            <div className="sticky top-4">
              <OrderSummaryCard
                items={items}
                subtotal={subtotal}
                total={total}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ✅ Mobile Bottom Bar */}
      <div className="fixed md:hidden left-0 right-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-pink-200">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="text-sm">
            <div className="text-gray-600">Total</div>
            <div className="text-lg font-bold text-pink-700">
              {money(total)}
            </div>
          </div>
          <button
            onClick={() => setShowMobileSummary(true)}
            className="px-4 py-2 rounded-xl bg-[#167389] text-white font-semibold hover:bg-[#125f70] shadow-lg text-sm"
          >
            View Summary
          </button>
        </div>
      </div>

      {/* ✅ Mobile Summary Modal */}
      {showMobileSummary && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileSummary(false)}
            aria-label="Close summary"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="absolute left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-white p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <button
                onClick={() => setShowMobileSummary(false)}
                className="p-2 rounded-lg hover:bg-pink-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="pt-3 overflow-y-auto">
              <OrderSummaryCard
                items={items}
                subtotal={subtotal}
                total={total}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
