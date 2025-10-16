// components/Topbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import clsx from "clsx";
import {
  Search,
  ShoppingCart,
  Phone,
  Menu,
  X,
  Leaf,
  Home,
  Package,
  ChevronDown,
} from "lucide-react";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState<string>(sp.get("q") ?? "");
  const [cat, setCat] = useState<string>(sp.get("category") ?? "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Cart items count from Zustand
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const brand = process.env.NEXT_PUBLIC_BRAND || "ShodaiGram";
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "01700-000000";

  // Fetch categories (dynamic integration ready)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        // Replace with your actual API call
        // const response = await fetch("/api/categories");
        // const data = await response.json();
        // setCategories(data.data ?? []);

        // Mock data for now
        setCategories([
          { _id: "1", slug: "vegetables", title: "Vegetables" },
          { _id: "2", slug: "fruits", title: "Fruits" },
          { _id: "3", slug: "rice", title: "Rice" },
          { _id: "4", slug: "oil", title: "Oil" },
          { _id: "5", slug: "spices", title: "Spices" },
        ]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (cat) params.set("category", cat);
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    setMobileMenuOpen(false);
  };

  const onClear = () => {
    setQ("");
    setCat("");
    router.push("/products");
  };

  const NAV_LINKS = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: Package },
  ];

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
          {/* Top Banner - Only on desktop */}
          <div className="hidden md:block border-b border-green-100">
            <div className="flex items-center justify-between py-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Leaf className="w-4 h-4 text-green-600" />
                <span>১০০% জৈব পণ্য • সরাসরি খামার থেকে</span>
              </div>
              <a
                href={`tel:${hotline}`}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>হটলাইন: {hotline}</span>
              </a>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center gap-4 py-3 md:py-4">
            {/* Logo & Brand */}
            <Link
              href="/"
              className="flex items-center gap-2 md:gap-3 shrink-0 group"
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

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-6">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Categories Dropdown - Desktop */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all">
                  <span>Category</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border-2 border-green-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <Link
                    href="/products"
                    className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium"
                  >
              All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/products?category=${cat.slug}`}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-700"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Search Bar - Desktop */}
            <form
              onSubmit={onSearch}
              className="hidden lg:flex items-center gap-2 ml-auto max-w-xl flex-1"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                <input
                  placeholder="Search Products..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all bg-white"
                />
              </div>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                disabled={categoriesLoading}
                className="px-4 py-2.5 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 transition-all bg-white text-green-500 min-w-[140px] cursor-pointer"
              >
                <option value="">
                  {categoriesLoading ? "Loading..." : "All Category"}
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              >
               Search
              </motion.button>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2 ml-auto lg:ml-4">
              {/* Cart Button */}
              <Link href="/cart">
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
              >
                <Phone className="w-5 h-5" />
              </a>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Search - Always Visible on Mobile */}
          <div className="lg:hidden pb-3">
            <form onSubmit={onSearch} className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                <input
                  placeholder="Search Products..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all bg-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  disabled={categoriesLoading}
                  className="flex-1 px-4 py-2.5 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 transition-all bg-white"
                >
                  <option value="">
                    {categoriesLoading ? "Loading..." : "All Category"}
                  </option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md"
                >
             Search
                </button>
              </div>
              {(q || cat) && (
                <button
                  type="button"
                  onClick={onClear}
                  className="w-full px-4 py-2.5 border-2 border-green-200 text-green-700 font-medium rounded-xl hover:bg-green-50 transition-all"
                >
                 Clear Filter
                </button>
              )}
            </form>
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
              className="lg:hidden border-t border-green-100 bg-white overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                {/* Navigation Links */}
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all",
                        isActive
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                {/* Categories Section */}
                <div className="pt-2 mt-2 border-t border-green-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
       Category
                  </div>
                  <Link
                    href="/products"
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-medium"
                  >
                  All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/products?category=${cat.slug}`}
                      className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl"
                    >
                      {cat.title}
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
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat.slug}`}
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all",
                  sp.get("category") === cat.slug
                    ? "bg-white text-green-700 shadow-md"
                    : "text-white hover:bg-white/20"
                )}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
