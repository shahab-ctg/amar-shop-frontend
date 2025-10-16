// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Phone, Menu, X, Leaf } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import api from "@/lib/api";

interface Category {
  _id: string;
  title: string;
  slug: string;
}

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Zustand cart store
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetchCategories();

    // Scroll listener for sticky navbar effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md"
              >
                <Leaf
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                  strokeWidth={2.5}
                />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-green-600">
                  সোদাইগ্রাম
                </h1>
                <p className="text-xs text-emerald-600 font-medium -mt-1">
                  Organic Products
                </p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl mx-8"
            >
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="পণ্য খুঁজুন..."
                  className="w-full pl-12 pr-32 py-3 border-2 border-emerald-200 rounded-full focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="absolute right-14 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm border-l-2 border-emerald-200 bg-transparent focus:outline-none"
                >
                  <option value="">সব</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.title}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Call Button - Desktop */}
              <a
                href="tel:01700000000"
                className="hidden lg:flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full hover:bg-emerald-200 transition-colors"
              >
                <Phone size={18} className="text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  কল করুন
                </span>
              </a>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative p-2 sm:p-3 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পণ্য খুঁজুন..."
                className="w-full pl-12 pr-4 py-3 border-2 border-emerald-200 rounded-full focus:outline-none focus:border-emerald-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-white p-2 rounded-full"
              >
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Secondary Navigation - Categories */}
        <div className="hidden md:block bg-emerald-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-6 py-3 overflow-x-auto scrollbar-hide">
              <Link
                href="/products"
                className="whitespace-nowrap hover:text-yellow-300 transition-colors font-medium"
              >
                সব পণ্য
              </Link>
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="whitespace-nowrap hover:text-yellow-300 transition-colors font-medium"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-emerald-100 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 hover:bg-emerald-50 rounded-xl transition-colors font-medium"
              >
                সব পণ্য
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  {category.title}
                </Link>
              ))}
              <a
                href="tel:01700000000"
                className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-xl font-medium text-emerald-700"
              >
                <Phone size={18} />
                <span>কল করুন: ০১৭০০০০০০০০</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
