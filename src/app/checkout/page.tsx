"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import {
  ShoppingBag,
  Phone,
  User,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Plus,
  Minus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createOrder } from "@/services/orders";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

const HOTLINE = process.env.NEXT_PUBLIC_HOTLINE || "01700-000000";

// number-safe helpers
const toNum = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const money = (n: number) => `৳${toNum(n).toFixed(2)}`;

// stock helper
const getStock = (it: unknown): number => {
  const item = it as {
    stock?: number;
    availableQty?: number;
    stockQty?: number;
  };
  const s =
    toNum(item?.stock, NaN) ??
    toNum(item?.availableQty, NaN) ??
    toNum(item?.stockQty, NaN);
  return Number.isFinite(s) ? s : Infinity;
};

/* ---------------- Row (memoized) ---------------- */
type RowProps = {
  item: {
    _id: string;
    title?: string;
    price?: number;
    quantity?: number;
    stock?: number;
    image?: string;
  };
};

const ItemRow = React.memo<RowProps>(function ItemRow({ item }) {
  const price = toNum(item?.price);
  const qty = Math.max(1, toNum(item?.quantity, 1));
  const stock = getStock(item);
  const outOfStock = stock === 0;
  const atMax = qty >= stock;
  const lineTotal = price * qty;

  const dec = () => {
    const currentQty =
      useCartStore.getState().items.find((i) => i._id === item._id)?.quantity ||
      1;
    if (currentQty > 1 && !outOfStock) {
      useCartStore.getState().updateQuantity(item._id, currentQty - 1);
    }
  };

  const inc = () => {
    const currentQty =
      useCartStore.getState().items.find((i) => i._id === item._id)?.quantity ||
      1;
    if (!outOfStock && !atMax) {
      useCartStore.getState().updateQuantity(item._id, currentQty + 1);
    }
  };

  return (
    <motion.div
      key={item._id}
      initial={false}
      className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#F5FDF8] to-[#F5FDF8] rounded-xl border border-pink-100"
    >
      {/* Image */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-100 rounded-lg flex-shrink-0 overflow-hidden relative">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title ? `${item.title} product image` : "Product image"}
            className="object-cover"
            fill
            sizes="56px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-pink-400">
            💄
          </div>
        )}
        {outOfStock && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow">
            OOS
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-800 text-sm truncate mb-1">
          {item?.title ?? "Product"}
        </h3>

        {/* Qty controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={dec}
            disabled={qty <= 1 || outOfStock}
            className="w-6 h-6 flex items-center justify-center rounded bg-pink-100 hover:bg-pink-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
            aria-label="Decrease quantity"
            title="Decrease quantity"
          >
            <Minus className="w-3 h-3 text-pink-700" />
          </button>

          <span className="text-xs text-gray-600 min-w-4 text-center font-medium">
            {qty}
          </span>

          <button
            onClick={inc}
            disabled={outOfStock || atMax}
            className="w-6 h-6 flex items-center justify-center rounded bg-pink-100 hover:bg-pink-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
            aria-label={atMax ? "Reached stock limit" : "Increase quantity"}
            title={atMax ? "Reached stock limit" : "Increase quantity"}
          >
            <Plus className="w-3 h-3 text-pink-700" />
          </button>

          {Number.isFinite(stock) && stock !== Infinity && (
            <span className="ml-1 text-[11px] text-gray-500">
              (Stock: {stock})
            </span>
          )}
        </div>
      </div>

      {/* Line Total */}
      <div className="font-bold text-pink-600">{money(lineTotal)}</div>
    </motion.div>
  );
});

/* ---------------- Summary (memoized) ---------------- */
type SummaryProps = {
  items: RowProps["item"][];
  subtotal: number;
  total: number;
};

const OrderSummaryCard = React.memo<SummaryProps>(function OrderSummaryCard({
  items,
  subtotal,
  total,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-pink-100">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-5 sm:mb-6 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-pink-600" />
        Order Summary
      </h2>

      <div className="space-y-3 mb-5 sm:mb-6 max-h-[50vh] sm:max-h-[400px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it) => (
          <ItemRow key={it._id} item={it} />
        ))}
      </div>

      <div className="border-t border-pink-200 my-4" />
      <div className="space-y-2 mb-4 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="text-pink-600 font-medium">FREE</span>
        </div>
      </div>
      <div className="border-t-2 border-pink-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">Total</span>
          <span className="text-2xl font-bold text-pink-600">
            {money(total)}
          </span>
        </div>
      </div>
      <div className="mt-6 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
        <p className="text-xs text-center text-pink-800">
          🔒 Secure & protected checkout
        </p>
      </div>
    </div>
  );
});

export default function CheckoutPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = useSearchParams();

  // cart store
  const items = useCartStore((s) => s.items);
  const getTotalPriceFromStore = useCartStore((s) => s.getTotalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  // subtotal
  const subtotal = useMemo(() => {
    try {
      const v = getTotalPriceFromStore?.();
      if (typeof v === "number" && Number.isFinite(v)) return v;
    } catch {}
    return items.reduce((sum, it) => {
      const p = toNum(it?.price);
      const q = Math.max(1, toNum(it?.quantity, 1));
      return sum + p * q;
    }, 0);
  }, [items, getTotalPriceFromStore]);

  const delivery = 0;
  const total = subtotal + delivery;

  // form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    area: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    area: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // validation
  const validateForm = () => {
    const e = { name: "", email: "", phone: "", address: "", area: "" };

    if (!formData.name.trim()) e.name = "Please enter your full name.";
    if (!formData.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      e.email = "Enter a valid email address.";
    if (!formData.phone.trim()) e.phone = "Please enter your phone number.";
    else if (!/^01[0-9]{9}$/.test(formData.phone.trim()))
      e.phone = "Enter a valid Bangladeshi number (01XXXXXXXXX).";
    if (!formData.address.trim()) e.address = "Please enter your address.";
    if (!formData.area.trim()) e.area = "Please enter your area.";

    setErrors(e);
    return !e.name && !e.email && !e.phone && !e.address && !e.area;
  };

  // submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }
    if (!items.length) {
      toast.error("Your cart is empty. Please add products first.");
      return;
    }

    const payload = {
      customer: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        area: formData.area.trim(),
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
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    } catch (err: unknown) {
      toast.dismiss();

      const error = err as {
        code?: string;
        name?: string;
        errors?: { path?: string; message?: string }[];
        message?: string;
        data?: {
          code?: string;
          message?: string;
        };
        status?: number;
        statusCode?: number;
      };

      const code = error?.code || error?.name;
      const serverErrors: { path?: string; message?: string }[] =
        error?.errors || [];

      if (code === "VALIDATION_ERROR" && Array.isArray(serverErrors)) {
        const e = { name: "", email: "", phone: "", address: "", area: "" };
        for (const se of serverErrors) {
          const p = se.path || "";
          if (p.startsWith("customer.name"))
            e.name = se.message || "Invalid name";
          else if (p.startsWith("customer.email"))
            e.email = se.message || "Invalid email";
          else if (p.startsWith("customer.phone"))
            e.phone = se.message || "Invalid phone";
          else if (p.startsWith("customer.address"))
            e.address = se.message || "Invalid address";
          else if (p.startsWith("customer.area"))
            e.area = se.message || "Invalid area";
        }
        setErrors(e);
        toast.error("Please check your form details");
      } else if (
        code === "OUT_OF_STOCK" ||
        error?.data?.code === "OUT_OF_STOCK"
      ) {
        toast.error(
          "Some products in your cart are out of stock. Please update your cart."
        );
        setTimeout(() => router.push("/cart"), 2000);
      } else if (
        code === "PRODUCT_MISSING" ||
        error?.data?.code === "PRODUCT_MISSING"
      ) {
        toast.error(
          "Some products are no longer available. Please update your cart."
        );
        setTimeout(() => router.push("/cart"), 2000);
      } else {
        const errorMessage =
          error?.message ||
          error?.data?.message ||
          "Failed to place order. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((s) => ({ ...s, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  // Empty cart UI
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-gradient-to-br  bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-16 h-16 mx-auto text-pink-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Please add items to proceed to checkout.
          </p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-[#167389] to-[#167389] text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          >
            Browse products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 min-h-screen py-8 px-4 xs:px-5 sm:px-6 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#167389] via-[#167389] to-purple-600 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Fill in your details to complete the order.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-5 sm:gap-6 lg:gap-8">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 border border-pink-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-5 sm:mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-pink-600" />
                Your Information
              </h2>

              <div className="space-y-4 sm:space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-2 transition-colors outline-none bg-white text-gray-900 placeholder:text-gray-400 ${
                        errors.name
                          ? "border-red-300 focus:border-red-500"
                          : "border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                      }`}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-colors outline-none bg-white text-gray-900 placeholder:text-gray-400 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500"
                        : "border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                    }`}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-2 transition-colors outline-none bg-white text-gray-900 placeholder:text-gray-400 ${
                        errors.phone
                          ? "border-red-300 focus:border-red-500"
                          : "border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                      }`}
                      autoComplete="tel"
                      inputMode="numeric"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => handleChange("area", e.target.value)}
                    placeholder="e.g. Dhanmondi, Gulshan"
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-colors outline-none bg-white text-gray-900 placeholder:text-gray-400 ${
                      errors.area
                        ? "border-red-300 focus:border-red-500"
                        : "border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                    }`}
                    autoComplete="address-level2"
                  />
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.area}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="House, road, area, city"
                      rows={4}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors resize-none outline-none bg-white text-gray-900 placeholder:text-gray-400 ${
                        errors.address
                          ? "border-red-300 focus:border-red-500"
                          : "border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                      }`}
                      autoComplete="street-address"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || orderSuccess}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full py-3.5 sm:py-4 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-2 focus-visible:outline-none shadow-lg ${
                    isSubmitting || orderSuccess
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#167389] to-[#167389] hover:from-pink-600 hover:to-rose-700 focus-visible:ring-2 focus-visible:ring-pink-500"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : orderSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Order placed!
                    </>
                  ) : (
                    <>Place Order</>
                  )}
                </motion.button>

                {/* Call to Order */}
                <div className="text-center pt-4 border-t border-pink-100">
                  <p className="text-gray-600 mb-3 text-sm">Or</p>
                  <a
                    href={`tel:${HOTLINE}`}
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-pink-700 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded text-sm sm:text-base"
                  >
                    <Phone className="w-5 h-5" />
                    Call to order: {HOTLINE}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Order Summary (Desktop) */}
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

      {/* Mobile bottom bar */}
      <div className="fixed md:hidden left-0 right-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-pink-200 pb-[env(safe-area-inset-bottom,0)]">
        <div className="max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <div className="text-sm">
            <div className="text-gray-600">Total</div>
            <div className="text-lg font-bold text-pink-700">
              {money(total)}
            </div>
          </div>
          <button
            onClick={() => setShowMobileSummary(true)}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#167389] to-[#167389] text-white font-semibold hover:from-pink-600 hover:to-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 shadow-lg text-sm"
          >
            View Order Summary
          </button>
        </div>
      </div>

      {/* Mobile Summary Modal */}
      {showMobileSummary && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileSummary(false)}
            aria-label="Close summary"
            title="Close summary"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="absolute left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-white p-4 pb-[calc(env(safe-area-inset-bottom,0)+16px)] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Order Summary"
          >
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <button
                onClick={() => setShowMobileSummary(false)}
                className="p-2 rounded-lg hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
                aria-label="Close summary"
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
