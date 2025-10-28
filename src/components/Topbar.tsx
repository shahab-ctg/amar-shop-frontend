"use client";

import Link from "next/link";
import Image from "next/image"; 
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
  Link2,
  
} from "lucide-react";
import { Category } from "@/lib/schemas";



export default function Topbar() {
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

  const brand = process.env.NEXT_PUBLIC_BRAND || "Amaar Shop";
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "+8801318319610";
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE;

  const placeholders = [
    { icon: Sparkles, text: "Search by Image..." },
    { icon: Link2, text: "Search by Company Name..." },
    { icon: Search, text: "Search by product..." },
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
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3 md:gap-4 py-2.5 sm:py-3 md:py-4">
            {/* ✅ Left: Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group"
              aria-label="Go to homepage"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl overflow-hidden bg-white shadow-md flex items-center justify-center">
                <Image
                  src="/logo-amar-shop.jpg"
                  alt="Amar Shop Logo"
                  fill
                  sizes="(max-width:768px) 36px, 48px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block text-lg font-bold text-white tracking-wide">
                {brand}
              </div>
            </Link>

            {/* ✅ Center: Search (Desktop only) */}
            <form
              onSubmit={onSearch}
              className="hidden lg:flex items-center justify-center w-full"
            >
              <div className="relative flex w-full max-w-2xl items-stretch">
                {/* ✅ Camera Icon Added */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
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

                <Search className="absolute bg-cyan-600 text-white right-0 top-1/2 -translate-y-1/2 w-8 p-2 rounded-r-full h-10 pointer-events-none" />
              </div>
            </form>

            {/* ✅ Right: Actions */}
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
            </div>
          </div>

          {/* ✅ Mobile Search below logo */}
          <form
            onSubmit={onSearch}
            className="lg:hidden flex items-center justify-center mt-2"
          >
            <div className="relative flex-1">
              {/* ✅ Camera Icon Added */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
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
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-cyan-600 text-white rounded-xl p-2 h-8 w-8 flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* ======= MOBILE BOTTOM NAVBAR ======= */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-between items-center px-5 py-2 text-[#167389] relative">
          {/* ✅ Left Side: Categories & Cart */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col items-center text-xs"
            >
              <Menu className="w-5 h-5" />
              <span>Categories</span>
            </button>

            <Link
              href="/cart"
              className="flex flex-col items-center text-xs relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* ✅ Center: Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 -top-5 bg-white rounded-full shadow-md p-2 border border-cyan-200 flex items-center justify-center"
            aria-label="Home"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/logo-amar-shop.jpg"
                alt="Logo"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
          </Link>

          {/* ✅ Right Side: WhatsApp & Call */}
          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/+8801318319610"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M16.006 2.667C8.64 2.667 2.667 8.64 2.667 16.006c0 2.886.88 5.61 2.546 7.96L3.36 29.333l5.546-1.84a13.3 13.3 0 0 0 7.1 2.027c7.366 0 13.34-5.973 13.34-13.34 0-7.366-5.974-13.346-13.34-13.346Zm0 24.64c-2.4 0-4.747-.68-6.78-1.974l-.48-.294-3.293 1.08 1.08-3.294-.307-.48a11.06 11.06 0 0 1-1.68-5.8c0-6.12 4.973-11.093 11.093-11.093 6.113 0 11.093 4.973 11.093 11.093 0 6.113-4.98 11.093-11.093 11.093Zm6.213-8.286c-.334-.173-1.987-.973-2.293-1.093-.307-.107-.533-.16-.76.16-.227.32-.867 1.093-1.067 1.307-.187.213-.4.24-.734.08-.334-.173-1.4-.52-2.667-1.667a10.003 10.003 0 0 1-1.84-2.293c-.187-.32-.02-.493.147-.667.16-.16.334-.4.507-.6.173-.2.227-.347.334-.573.107-.227.053-.427-.027-.6-.08-.173-.76-1.827-1.04-2.493-.267-.64-.534-.547-.76-.56h-.653c-.227 0-.6.087-.92.427s-1.213 1.18-1.213 2.867 1.24 3.32 1.414 3.547c.173.227 2.44 3.733 5.907 5.227.827.36 1.467.573 1.967.733.827.267 1.573.227 2.167.147.667-.107 1.987-.813 2.273-1.6.28-.787.28-1.453.2-1.6-.067-.147-.28-.24-.614-.414Z" />
              </svg>
              <span>Chat</span>
            </a>

            <a
              href={`tel:${hotline}`}
              className="flex flex-col items-center text-xs"
            >
              <Phone className="w-5 h-5" />
              <span>Call</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ======= Bottom Categories Sheet ======= */}
      {/* ======= MOBILE BOTTOM NAVBAR ======= */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-between items-center px-5 py-2 text-[#167389] relative">
          {/* ✅ Left: Categories & Cart */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col items-center text-xs"
            >
              <Menu className="w-5 h-5" />
              <span>Categories</span>
            </button>

            <Link
              href="/cart"
              className="flex flex-col items-center text-xs relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* ✅ Center: Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 -top-5 bg-white rounded-full shadow-md p-2 border border-cyan-200 flex items-center justify-center"
            aria-label="Home"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/logo-amar-shop.jpg"
                alt="Logo"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
          </Link>

          {/* ✅ Right: WhatsApp & Call */}
          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M16.006 2.667C8.64 2.667 2.667 8.64 2.667 16.006c0 2.886.88 5.61 2.546 7.96L3.36 29.333l5.546-1.84a13.3 13.3 0 0 0 7.1 2.027c7.366 0 13.34-5.973 13.34-13.34 0-7.366-5.974-13.346-13.34-13.346Zm0 24.64c-2.4 0-4.747-.68-6.78-1.974l-.48-.294-3.293 1.08 1.08-3.294-.307-.48a11.06 11.06 0 0 1-1.68-5.8c0-6.12 4.973-11.093 11.093-11.093 6.113 0 11.093 4.973 11.093 11.093 0 6.113-4.98 11.093-11.093 11.093Zm6.213-8.286c-.334-.173-1.987-.973-2.293-1.093-.307-.107-.533-.16-.76.16-.227.32-.867 1.093-1.067 1.307-.187.213-.4.24-.734.08-.334-.173-1.4-.52-2.667-1.667a10.003 10.003 0 0 1-1.84-2.293c-.187-.32-.02-.493.147-.667.16-.16.334-.4.507-.6.173-.2.227-.347.334-.573.107-.227.053-.427-.027-.6-.08-.173-.76-1.827-1.04-2.493-.267-.64-.534-.547-.76-.56h-.653c-.227 0-.6.087-.92.427s-1.213 1.18-1.213 2.867 1.24 3.32 1.414 3.547c.173.227 2.44 3.733 5.907 5.227.827.36 1.467.573 1.967.733.827.267 1.573.227 2.167.147.667-.107 1.987-.813 2.273-1.6.28-.787.28-1.453.2-1.6-.067-.147-.28-.24-.614-.414Z" />
              </svg>
              <span>Chat</span>
            </a>

            <a
              href={`tel:${hotline}`}
              className="flex flex-col items-center text-xs"
            >
              <Phone className="w-5 h-5" />
              <span>Call</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ======= Bottom Categories Sheet (Full Height, Same as DesktopSidebar) ======= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="fixed inset-0 z-[60] bg-white rounded-t-2xl shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white z-10">
              <h3 className="text-lg font-semibold text-[#167389]">
                Shop by Categories
              </h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-500 hover:text-rose-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-start gap-2 bg-white border border-gray-200 rounded-lg p-3 hover:border-[#167389] hover:shadow-md transition"
                >
                  <div className="relative w-[70px] h-[70px] rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                    {cat.image ? (
                      <Image
                        src={cat?.image}
                        alt={cat.title}
                        fill
                        sizes="90px"
                        className="object-cover"
                      />
                    ) : (
                      <ShoppingCart className="text-[#167389]" size={28} />
                    )}
                  </div>
                  <p className="text-[11px] sm:text-sm font-medium text-gray-700 text-center line-clamp-2 leading-tight">
                    {cat.title}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[64px] sm:h-[72px] md:h-[80px] lg:h-[96px]" />
    </>
  );
}
