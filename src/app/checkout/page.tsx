// app/checkout/page.tsx
"use client";

import { useState } from "react";
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

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      address: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "নাম লিখুন";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "ফোন নাম্বার লিখুন";
    } else if (!/^01[0-9]{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "সঠিক বাংলাদেশি নাম্বার লিখুন (01XXXXXXXXX)";
    }

    if (!formData.address.trim()) {
      newErrors.address = "ঠিকানা লিখুন";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone && !newErrors.address;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setOrderSuccess(true);

    // Reset after showing success
    setTimeout(() => {
      setOrderSuccess(false);
      alert("অর্ডার সিস্টেম শীঘ্রই আসছে। এখন হটলাইনে কল করুন।");
    }, 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Empty cart state
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
            আপনার কার্ট খালি
          </h2>
          <p className="text-gray-600 mb-6">
            চেকআউট করার জন্য প্রথমে পণ্য যোগ করুন
          </p>
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
          >
            পণ্য দেখুন
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
            চেকআউট
          </h1>
          <p className="text-gray-600">
            আপনার অর্ডার সম্পূর্ণ করতে তথ্য পূরণ করুন
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                আপনার তথ্য
              </h2>

              <div className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পুরো নাম <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="আপনার নাম লিখুন"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors ${
                        errors.name
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-green-500"
                      } outline-none`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ফোন নাম্বার <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors ${
                        errors.phone
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-green-500"
                      } outline-none`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Address Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ঠিকানা <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                      rows={4}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors resize-none ${
                        errors.address
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-green-500"
                      } outline-none`}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || orderSuccess}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting || orderSuccess
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      প্রসেসিং...
                    </>
                  ) : orderSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      অর্ডার সফল!
                    </>
                  ) : (
                    <>অর্ডার করুন (শীঘ্রই আসছে)</>
                  )}
                </motion.button>

                {/* Call to Order */}
                <div className="text-center pt-4 border-t">
                  <p className="text-gray-600 mb-3">অথবা</p>
                  <a
                    href="tel:+8801700000000"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
                  >
                    <Phone className="w-5 h-5" />
                    কল করে অর্ডার করুন: 01700-000000
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                অর্ডার সামারি
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                {items.map((item, idx) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        পরিমাণ: {item.quantity}
                      </p>
                    </div>
                    <div className="font-bold text-green-600">
                      ৳{item.price * item.quantity}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4" />

              {/* Subtotal */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>সাবটোটাল</span>
                  <span>৳{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    মোট
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    ৳{getTotalPrice()}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-3 bg-green-50 rounded-xl">
                <p className="text-xs text-center text-green-800">
                  🔒 নিরাপদ এবং সুরক্ষিত চেকআউট
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
