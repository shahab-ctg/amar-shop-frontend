"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import clsx from "clsx";
import { Search, ShoppingCart, Phone, Menu, X, Leaf } from "lucide-react";

type Category = { _id: string; slug: string; title: string };

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState<string>(sp.get("q") ?? "");
  const [cat, setCat] = useState<string>(sp.get("category") ?? "");
  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setCat(sp.get("category") ?? "");
   
  }, [sp]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const cartItems = useCartStore((s) => s.items);
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const brand = process.env.NEXT_PUBLIC_BRAND || "ShodaiGram";
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "01700-000000";
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const ac = new AbortController();
    async function load() {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");
        const res = await fetch(`${API_BASE}/categories`, {
          signal: ac.signal,
          headers: { "content-type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok)
          throw new Error(`Failed to load categories (${res.status})`);
        const json = await res.json();
        setCategories((json?.data ?? []) as Category[]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {

        if (err?.name !== "AbortError") {
          setCategoriesError(err?.message || "Failed to fetch categories");
          setCategories([]);
        }
      } finally {
        setCategoriesLoading(false);
      }
    }
    load();
    return () => ac.abort();
  }, [API_BASE]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qTrim = q.trim();
    const params = new URLSearchParams();
    if (qTrim) params.set("q", qTrim);
    if (cat) params.set("category", cat);
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    setMobileMenuOpen(false);
  };

  const _onClear = () => {
    setQ("");
    setCat("");
    router.push("/products");
  };

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg"
            : "bg-white border-b border-green-100"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Banner - Desktop only */}
          <div className="hidden md:block border-b border-green-100">
            <div className="flex items-center justify-between py-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Leaf className="w-4 h-4 text-green-600" />
                <span>১০০% জৈব পণ্য • সরাসরি খামার থেকে</span>
              </div>
              <a
                href={`tel:${hotline}`}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                aria-label="Call hotline"
              >
                <Phone className="w-4 h-4" />
                <span>হটলাইন: {hotline}</span>
              </a>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-4 py-3 md:py-4">
            {/* Left: Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 md:gap-3 shrink-0 group"
              aria-label="Go to homepage"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
              >
                <Leaf
                  className="w-6 h-6 md:w-7 md:h-7 text-white"
                  strokeWidth={2.5}
                />
              </motion.div>
              <div className="hidden sm:block">
                <div className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600">
                  {brand}
                </div>
                <div className="text-xs text-green-600 font-medium -mt-1">
                  জৈব পণ্যের বিশ্বস্ত ঠিকানা
                </div>
              </div>
            </Link>

            {/* Center: Search (Desktop only) */}
            <form
              onSubmit={onSearch}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="flex w-full max-w-2xl items-stretch gap-2">
                {/* Category select with relevant green bg */}
                <select
                  aria-label="Filter by category"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  disabled={categoriesLoading}
                  className={clsx(
                    "px-3 sm:px-4 py-2.5 rounded-xl border-2 min-w-[150px]",
                    "bg-green-50 border-green-200 text-green-700",
                    "focus:outline-none focus:border-green-500 transition-all"
                  )}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading..."
                      : categoriesError
                        ? "Retry: Categories"
                        : "All Category"}
                  </option>
                  {categories.map((c) => (
                    <option className="" key={c._id} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>

                {/* Search input */}
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500"
                    aria-hidden="true"
                  />
                  <input
                    aria-label="Search products"
                    placeholder="Search Products..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className={clsx(
                      "w-full pl-10 pr-4 py-2.5 rounded-xl border-2",
                      "bg-white border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100",
                      "transition-all text-gray-900 placeholder:text-gray-400"
                    )}
                  />
                </div>

                {/* Search button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  Search
                </motion.button>
              </div>
            </form>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-2">
              {/* Cart Button */}
              <Link href="/cart" aria-label="Open cart">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 md:p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all"
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* Call Button - Mobile Only */}
              <a
                href={`tel:${hotline}`}
                className="md:hidden p-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all"
                aria-label="Call hotline"
              >
                <Phone className="w-5 h-5" />
              </a>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>

          {/*  Mobile search block removed as requested (small screens will NOT show search UI) */}
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-green-100 bg-white overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                {/* Categories quick links (optional) */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-2">
                    Categories
                  </div>
                  <Link
                    href="/products"
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-medium"
                  >
                    All Products
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c._id}
                      href={`/products?category=${c.slug}`}
                      className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl"
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>

                {/* Hotline */}
                <div className="pt-2 mt-2 border-t border-green-100">
                  <a
                    href={`tel:${hotline}`}
                    className="flex items-center gap-3 px-4 py-3 bg-green-50 border-2 border-green-200 text-green-700 font-semibold rounded-xl hover:bg-green-100 transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    <div>
                      <div className="text-xs text-gray-600">হটলাইন</div>
                      <div>{hotline}</div>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Secondary Category Bar - Desktop Only */}
      <div className="hidden lg:block bg-gradient-to-r from-green-600 to-emerald-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            <Link
              href="/products"
              className={clsx(
                "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all",
                !sp.get("category")
                  ? "bg-white text-green-700 shadow-md"
                  : "text-white hover:bg-white/20"
              )}
            >
              All Products
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/products?category=${c.slug}`}
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all",
                  sp.get("category") === c.slug
                    ? "bg-white text-green-700 shadow-md"
                    : "text-white hover:bg-white/20"
                )}
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
