"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import clsx from "clsx";
import {
  Search,
  ShoppingCart,
  Phone,
  Menu,
  X,
  Sparkles,
  User,
  Image,
  Link2,
  Home,
} from "lucide-react";

type Category = { _id: string; slug: string; title: string };

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState<string>(sp.get("q") ?? "");
  const [cat, setCat] = useState<string>(sp.get("category") ?? "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const cartItems = useCartStore((s) => s.items);
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const brand = process.env.NEXT_PUBLIC_BRAND || "AmarShopBD";
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "01700-000000";
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE;

  const placeholders = [
    { icon: Image, text: "Search by image..." },
    { icon: Link2, text: "Search by link..." },
    { icon: Search, text: "Search by keyword..." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

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
        if (err.name !== "AbortError") {
          setCategoriesError(err.message || "Failed to fetch categories");
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

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qTrim = q.trim();
    const params = new URLSearchParams();
    if (qTrim) params.set("q", qTrim);
    if (cat) params.set("category", cat);
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    setMobileMenuOpen(false);
  };

  const CurrentIcon = placeholders[0].icon; // fixed icon on left

  return (
    <>
      {/* ======= FIXED TOP NAVBAR ======= */}
      <header
        className={clsx(
          "fixed top-0 w-full z-50 transition-all duration-300",
          scrolled
            ? "bg-[#167389]/95 backdrop-blur-lg shadow-lg"
            : "bg-[#167389] border-b border-[#1a8ba5]"
        )}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 h-[120px] lg:h-[100px]">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3 md:gap-4 py-2.5 sm:py-3 md:py-4 items-cente ">
            {/* Left: Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group"
              aria-label="Go to homepage"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="hidden sm:block text-lg font-bold text-white">
                {brand}
              </div>
            </Link>

            {/* ✅ Center: Search (Desktop only, perfectly centered) */}
            <form
              onSubmit={onSearch}
              className="hidden lg:flex items-center justify-center w-full"
            >
              <div className="relative flex w-full max-w-2xl items-stretch">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  {/* Camera icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-cyan-600"
                  >
                    <path d="M23 19V7a2 2 0 0 0-2-2h-3.17a2 2 0 0 1-1.41-.59l-.83-.82A2 2 0 0 0 14.17 3H9.83a2 2 0 0 0-1.41.59l-.83.82A2 2 0 0 1 6.17 5H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2ZM12 9a4 4 0 1 1-4 4 4 4 0 0 1 4-4Z" />
                  </svg>
                </div>
                <input
                  placeholder={placeholders[placeholderIndex].text}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-xl border-2 border-cyan-200 bg-white text-[#167389] placeholder:text-cyan-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200/40 text-sm"
                />

                <Search className="absolute bg-cyan-600 text-white right-0 top-1/2 -translate-y-1/2 w-8 p-2 rounded-r-full h-10  pointer-events-none" />
               
              </div>
            </form>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-2">
              <Link href="/profile" aria-label="Profile">
                <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition">
                  <User className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/cart" aria-label="Cart" className="relative">
                <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition">
                  <ShoppingCart className="w-5 h-5" />
                </button>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
              <a
                href={`tel:${hotline}`}
                className="md:hidden p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl"
              >
                <Phone className="w-5 h-5" />
              </a>
              {/* <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button> */}
            </div>
          </div>

          <form
            onSubmit={onSearch}
            className="lg:hidden items-center justify-center top-0"
          >
            <div className="flex w-full max-w-2xl items-stretch gap-2">
              <div className="relative  flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  {/* Replace icon with Camera */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-cyan-600"
                  >
                    <path d="M23 19V7a2 2 0 0 0-2-2h-3.17a2 2 0 0 1-1.41-.59l-.83-.82A2 2 0 0 0 14.17 3H9.83a2 2 0 0 0-1.41.59l-.83.82A2 2 0 0 1 6.17 5H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2ZM12 9a4 4 0 1 1-4 4 4 4 0 0 1 4-4Z" />
                  </svg>
                </div>
                <input
                  placeholder={placeholders[placeholderIndex].text}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-xl border-2 border-cyan-200 bg-white text-[#167389] placeholder:text-cyan-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200/40 text-sm"
                />
                <Search className="absolute bg-cyan-600 text-white right-0 top-1/2 -translate-y-1/2 w-8 p-2 rounded-r-full h-10  pointer-events-none" />
              </div>
            </div>
          </form>
        </div>
      </header>
      {/* ===== MOBILE MENU OVERLAY (works with fixed navbar) ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed top-[64px] sm:top-[72px] md:top-[80px] left-0 w-full bg-[#167389] border-t border-white/20 z-40 overflow-hidden shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-2">
              <div className="pt-2">
                <div className="text-[10px] sm:text-xs font-semibold text-white/70 uppercase tracking-wider px-1 mb-2">
                  Categories
                </div>
                <Link
                  href="/products"
                  className="block px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white hover:bg-white/10 rounded-lg sm:rounded-xl font-medium"
                >
                  All Products
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c._id}
                    href={`/products?category=${c.slug}`}
                    className="block px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white hover:bg-white/10 rounded-lg sm:rounded-xl"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-white/20 pb-[calc(env(safe-area-inset-bottom,0)+4px)]">
                <a
                  href={`tel:${hotline}`}
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border-2 border-white/30 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-white/20 transition-all text-sm"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <div>
                    <div className="text-[10px] sm:text-xs text-white/70">
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

      {/* ======= MOBILE BOTTOM NAVBAR ======= */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2 text-[#167389]">
          <Link href="/" className="flex flex-col items-center text-xs">
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            href="/cart"
            className="flex flex-col items-center text-xs relative"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart
            {cartCount > 0 && (
              <span className="absolute top-0 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center text-xs"
          >
            <Menu className="w-5 h-5" />
            Menu
          </button>
          <a
            href={`tel:${hotline}`}
            className="flex flex-col items-center text-xs"
          >
            <Phone className="w-5 h-5" />
            Contact
          </a>
        </div>
      </nav>

      {/* Spacer to avoid overlap */}
      <div className="h-[64px] sm:h-[72px] md:h-[80px] lg:h-[96px]" />
    </>
  );
}
