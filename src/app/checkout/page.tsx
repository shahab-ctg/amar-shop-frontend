"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import {
  ShoppingBag,
  Phone,
  User,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createOrder } from "@/services/orders";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const HOTLINE = process.env.NEXT_PUBLIC_HOTLINE || "01700-000000";

// number-safe helpers
const toNum = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const money = (n: number) => `৳${toNum(n).toFixed(2)}`;

export default function CheckoutPage() {
  const router = useRouter();

  // cart store
  const items = useCartStore((s) => s.items);
  const getTotalPriceFromStore = useCartStore((s) => s.getTotalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  // subtotal (number-safe)
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

  // local validation (backend schema mirror)
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



// Inside your Checkout component, update handleSubmit:
const handleSubmit = async () => {
  // Validate form first
  if (!validateForm()) {
    toast.error("Please fix the form errors before submitting");
    return;
  }

  // Check if cart is empty
  if (!items.length) {
    toast.error("Your cart is empty. Please add products first.");
    return;
  }

  // Prepare payload aligned with your backend OrderCreateDTO
  const payload = {
    customer: {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      area: formData.area.trim(),
    },
    lines: items.map((it) => ({
      productId: String(it._id), // Backend expects productId
      qty: Math.max(1, toNum(it.quantity, 1)), // Backend expects qty
    })),
  };

  try {
    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Placing your order...");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _res = await createOrder(payload);

    // Success
    toast.dismiss(loadingToast);
    toast.success("Order placed successfully!");
    setOrderSuccess(true);

    // Clear cart and redirect
    clearCart();
    setTimeout(() => {
      router.push("/products");
    }, 2000);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // Dismiss loading toast
    toast.dismiss();

    const code = err?.code || err?.name;
    const serverErrors: { path?: string; message?: string }[] =
      err?.errors || [];

    // Handle specific error cases based on your backend
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
    } else if (code === "OUT_OF_STOCK" || err?.data?.code === "OUT_OF_STOCK") {
      toast.error(
        "Some products in your cart are out of stock. Please update your cart."
      );
      setTimeout(() => router.push("/cart"), 2000);
    } else if (
      code === "PRODUCT_MISSING" ||
      err?.data?.code === "PRODUCT_MISSING"
    ) {
      toast.error(
        "Some products are no longer available. Please update your cart."
      );
      setTimeout(() => router.push("/cart"), 2000);
    } else {
      const errorMessage =
        err?.message ||
        err?.data?.message ||
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
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Please add items to proceed to checkout.
          </p>
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
          >
            Browse products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">
            Fill in your details to complete the order.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Your Information
              </h2>

              <div className="space-y-5">
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
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors outline-none bg-white text-gray-900 placeholder:text-gray-400 ${errors.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors outline-none bg-white text-gray-900 placeholder:text-gray-400 ${errors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
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
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors outline-none bg-white text-gray-900 placeholder:text-gray-400 ${errors.phone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors outline-none bg-white text-gray-900 placeholder:text-gray-400 ${errors.area ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
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
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors resize-none outline-none bg-white text-gray-900 placeholder:text-gray-400 ${errors.address ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
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
                  className={`w-full py-4 rounded-2xl font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting || orderSuccess
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
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
                <div className="text-center pt-4 border-t">
                  <p className="text-gray-600 mb-3">Or</p>
                  <a
                    href={`tel:${HOTLINE}`}
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
                  >
                    <Phone className="w-5 h-5" />
                    Call to order: {HOTLINE}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                Order Summary
              </h2>

              {/* Order Summary Items */}
              <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                {items.map((item, idx: number) => {
                  const price = toNum(item?.price);
                  const quantity = Math.max(1, toNum(item?.quantity, 1));
                  const lineTotal = price * quantity;

                  return (
                    <motion.div
                      key={item._id ?? idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            fill
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            📦
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 text-sm truncate mb-1">
                          {item?.title ?? "Product"}
                        </h3>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const currentQty =
                                useCartStore
                                  .getState()
                                  .items.find((i) => i._id === item._id)
                                  ?.quantity || 1;
                              if (currentQty > 1) {
                                useCartStore
                                  .getState()
                                  .updateQuantity(item._id, currentQty - 1);
                              }
                            }}
                            className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="text-xs text-gray-600 min-w-4 text-center font-medium">
                            {quantity}
                          </span>

                          <button
                            onClick={() => {
                              const currentQty =
                                useCartStore
                                  .getState()
                                  .items.find((i) => i._id === item._id)
                                  ?.quantity || 1;
                              useCartStore
                                .getState()
                                .updateQuantity(item._id, currentQty + 1);
                            }}
                            className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="font-bold text-green-600">
                        {money(lineTotal)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 my-4" />
              <div className="space-y-2 mb-4 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              </div>
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {money(total)}
                  </span>
                </div>
              </div>
              <div className="mt-6 p-3 bg-green-50 rounded-xl">
                <p className="text-xs text-center text-green-800">
                  🔒 Secure & protected checkout
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
