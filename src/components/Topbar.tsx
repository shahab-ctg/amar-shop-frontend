
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import clsx from "clsx";
import { Search, ShoppingCart, Phone, Menu, X, Sparkles } from "lucide-react";

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

  const brand = process.env.NEXT_PUBLIC_BRAND || "AmarShop";
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "01700-000000";
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE;

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
      } catch (err: unknown) {
        if (
          err &&
          typeof err === "object" &&
          "name" in err &&
          err.name !== "AbortError"
        ) {
          const errorMessage =
            err &&
            typeof err === "object" &&
            "message" in err &&
            typeof err.message === "string"
              ? err.message
              : "Failed to fetch categories";
          setCategoriesError(errorMessage);
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

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg"
            : "bg-white border-b border-pink-100"
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Top Banner - Desktop only */}
          <div className="hidden md:block border-b border-pink-100">
            <div className="flex items-center justify-between py-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600" />
                <span className="text-xs sm:text-sm">
                  100% Authentic Products • Free Shipping Over $50
                </span>
              </div>
              <a
                href={`tel:${hotline}`}
                className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
                aria-label="Call hotline"
              >
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Hotline: {hotline}</span>
              </a>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3 md:gap-4 py-2.5 sm:py-3 md:py-4">
            {/* Left: Logo */}
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0 group"
              aria-label="Go to homepage"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
              >
                <Sparkles
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
                  strokeWidth={2.5}
                />
              </motion.div>
              <div className="hidden sm:block">
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-700 to-rose-600 leading-tight">
                  {brand}
                </div>
                <div className="text-[10px] sm:text-xs text-pink-600 font-medium -mt-0.5 sm:-mt-1">
                  Your Beauty Destination
                </div>
              </div>
            </Link>

            {/* Center: Search (Desktop only) */}
            <form
              onSubmit={onSearch}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="flex w-full max-w-2xl items-stretch gap-2">
                <select
                  aria-label="Filter by category"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  disabled={categoriesLoading}
                  className={clsx(
                    "px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 min-w-[132px] sm:min-w-[150px] text-sm",
                    "bg-pink-50 border-pink-200 text-pink-700",
                    "focus:outline-none focus:border-pink-500 transition-all"
                  )}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading..."
                      : categoriesError
                        ? "Category"
                        : "All Categories"}
                  </option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-pink-500"
                    aria-hidden="true"
                  />
                  <input
                    aria-label="Search products"
                    placeholder="Search for beauty products..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className={clsx(
                      "w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 text-sm",
                      "bg-white border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100",
                      "transition-all text-gray-900 placeholder:text-gray-400"
                    )}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg text-sm"
                >
                  Search
                </motion.button>
              </div>
            </form>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
              {/* Cart Button */}
              <Link href="/cart" aria-label="Open cart">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 sm:p-2.5 md:p-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg sm:rounded-xl transition-all"
                >
                  <ShoppingCart className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 min-w-4 min-h-4 sm:min-w-5 sm:min-h-5 md:min-w-6 md:min-h-6 px-0.5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* Call Button - Mobile Only */}
              <a
                href={`tel:${hotline}`}
                className="md:hidden p-2 sm:p-2.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg sm:rounded-xl transition-all"
                aria-label="Call hotline"
              >
                <Phone className="w-5 h-5" />
              </a>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 sm:p-2.5 text-pink-600 hover:bg-pink-50 rounded-lg sm:rounded-xl transition-all"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-pink-100 bg-white overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-2">
                <div className="pt-2">
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-2">
                    Categories
                  </div>
                  <Link
                    href="/products"
                    className="block px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-lg sm:rounded-xl font-medium"
                  >
                    All Products
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c._id}
                      href={`/products?category=${c.slug}`}
                      className="block px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-lg sm:rounded-xl"
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-pink-100 pb-[calc(env(safe-area-inset-bottom,0)+4px)]">
                  <a
                    href={`tel:${hotline}`}
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-pink-50 border-2 border-pink-200 text-pink-700 font-semibold rounded-lg sm:rounded-xl hover:bg-pink-100 transition-all text-sm"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <div className="text-[10px] sm:text-xs text-gray-600">
                        Hotline
                      </div>
                      <div className="text-sm">{hotline}</div>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Secondary Category Bar - Desktop Only */}
      <div className="hidden lg:block bg-gradient-to-r from-pink-600 to-rose-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
            <Link
              href="/products"
              className={clsx(
                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium whitespace-nowrap transition-all text-sm",
                !sp.get("category")
                  ? "bg-white text-pink-700 shadow-md"
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
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium whitespace-nowrap transition-all text-sm",
                  sp.get("category") === c.slug
                    ? "bg-white text-pink-700 shadow-md"
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
