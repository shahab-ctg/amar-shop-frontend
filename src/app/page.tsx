"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchCategories, fetchProducts } from "@/services/catalog";
import type { Product, Category } from "@/lib/schemas";
import {
  ShoppingBag,
  ChevronRight,
  Camera,

  Sparkles,
} from "lucide-react";

/** ---- Fallback images ---- */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FALLBACK_BANNER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='600'><rect width='100%' height='100%' fill='#fde2e8'/><text x='50%' y='50%' text-anchor='middle' fill='#c24165' font-size='26' font-family='Arial' dy='.3em'>Beauty & Cosmetics</text></svg>`
  );

const FALLBACK_PROMO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect width='100%' height='100%' fill='#fbe7f3'/><text x='50%' y='50%' text-anchor='middle' fill='#db2777' font-size='20' font-family='Arial' dy='.3em'>Promo</text></svg>`
  );

/** ---- Local banner images ---- */
const BANNER_IMAGES = [
  "/hero1.webp",
  "/hero2.webp",
  "/hero3.webp",
  "/hero4.webp",
  "/hero6.webp",
  "/hero7.webp",
];

/** ---- Helpers ---- */
function pickImage(p: Partial<Product> & { images?: string[] }): string {
  if (typeof p.image === "string" && p.image.length > 3) return p.image;
  if (Array.isArray(p.images) && p.images[0]) return p.images[0]!;
  return "";
}

/* ---------------------------------------------------------
    BannerCarousel – fast, one-by-one image fade animation
---------------------------------------------------------- */
function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 3000); // ⏱ change every 3s fast, one by one
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-rose-100 bg-white shadow-lg h-full">
      <div className="relative h-[200px] sm:h-[300px] lg:h-[400px]">
        {BANNER_IMAGES.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt={`Banner ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width:1024px) 100vw, 66vw"
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Overlay text */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-4 sm:left-6 bottom-4 sm:bottom-6 text-white drop-shadow max-w-[80%] pointer-events-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-600/90 px-3 py-1 text-xs mb-2">
              <Camera size={14} /> Beauty Week
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Glow like never before
            </h1>
            <p className="text-xs sm:text-sm opacity-90 mt-1">
              Makeup • Skincare • Fragrance — curated for your unique look
            </p>
            <div className="mt-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-white/95 text-rose-700 px-4 py-2 text-sm font-medium shadow hover:shadow-md hover:-translate-y-0.5 transition pointer-events-auto"
              >
                Shop now <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {BANNER_IMAGES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
    Main HomePage (optimized data fetching, no infinite call)
---------------------------------------------------------- */
export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hotDeals, setHotDeals] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  //  fetch only once, not infinite
 useEffect(() => {
   let active = true;

  
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const cache: Record<string, any> = {};

   async function safeFetch<T>(key: string, fn: () => Promise<T>) {
     if (cache[key]) return cache[key];
     const res = await fn();
     cache[key] = res;
     return res;
   }

   async function loadData() {
     try {
       setLoading(true);

       // ⏳ Step 1: fetch categories first
       const catRes = await safeFetch("categories", fetchCategories);

       // ⏳ Step 2: stagger product fetches (100 ms gap between each)
       const hotRes = await safeFetch("hotDeals", () =>
         fetchProducts({ discounted: "true", limit: 12 })
       );
       await new Promise((r) => setTimeout(r, 100));

       const freshRes = await safeFetch("newArrivals", () =>
         fetchProducts({ limit: 12 })
       );
       await new Promise((r) => setTimeout(r, 100));

       const pickRes = await safeFetch("editorsPicks", () =>
         fetchProducts({ limit: 12 })
       );

       if (active) {
         setCategories(catRes?.data?.slice(0, 24) || []);
         setHotDeals(hotRes?.data?.slice(0, 8) || []);
         setNewArrivals(freshRes?.data?.slice(0, 8) || []);
         setEditorsPicks(pickRes?.data?.slice(0, 8) || []);
       }
     } catch (err) {
       console.error("Failed to load home data:", err);
     } finally {
       if (active) setLoading(false);
     }
   }

   loadData();
   return () => {
     active = false;
   };
 }, []);


  // ✅ promo banners remain same
  const promoBanners = [
    {
      title: "Surgical Products",
      subtitle: "Shop Now",
      img: "/surgical.png",
      href: "/products?category=surgical",
    },
    {
      title: "All Products",
      subtitle: "Explore All",
      img: "/order.png",
      href: "/products",
    },
  ];
  const promoA = promoBanners[0];
  const promoB = promoBanners[1];

  /* --- Same layout preserved --- */
  return (
    <div className="min-h-screen bg-gradient-to-br bg-white">
      <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* ---------- LEFT SIDEBAR ---------- */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24 h-full overflow-hidden">
              <div className="h-full rounded-2xl border border-rose-100 bg-white/80 backdrop-blur shadow-sm p-4 flex flex-col">
                <div className="mb-4 flex items-center gap-2 text-rose-700 font-semibold text-lg">
                  <Sparkles size={20} /> Categories
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                  {loading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-14 rounded-xl border border-rose-100 bg-rose-50/50 animate-pulse"
                        />
                      ))
                    : categories.map((c) => (
                        <Link
                          key={c._id}
                          href={`/c/${c.slug}`}
                          className="group rounded-xl border border-rose-100 bg-white/80 hover:bg-white shadow-sm hover:shadow transition p-2 flex items-center gap-2"
                        >
                          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-rose-50">
                            {c.image ? (
                              <Image
                                src={c.image}
                                alt={c.title}
                                fill
                                sizes="40px"
                                className="object-cover group-hover:scale-105 transition"
                              />
                            ) : (
                              <div className="h-full w-full grid place-items-center text-cyan-500">
                                <ShoppingBag size={16} />
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-700">{c.title}</div>
                        </Link>
                      ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ---------- MAIN CONTENT ---------- */}
          <main className="lg:col-span-10 space-y-6">
            {/* Banner + Promo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
              <div className="lg:col-span-8">
                <BannerCarousel />
              </div>
              <div className="lg:col-span-4 hidden lg:block">
                <div className="h-full rounded-2xl border border-rose-100 bg-white/80 shadow-sm p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-rose-700 font-semibold text-lg">
                    <Sparkles size={20} /> Featured
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    <PromoCard {...promoA} />
                    <PromoCard {...promoB} />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Sections */}
            <ProductSection
              title=" Hot Deals"
              subtitle="Limited time beauty steals"
              products={hotDeals}
              loading={loading}
              href="/search?discounted=true"
            />
            <ProductSection
              title=" New Arrivals"
              subtitle="Fresh drops in makeup & skincare"
              products={newArrivals}
              loading={loading}
              href="/search?sort=new"
            />
            <ProductSection
              title=" Editor's Picks"
              subtitle="Curated by our beauty editors"
              products={editorsPicks}
              loading={loading}
              href="/search?tag=featured"
            />
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
    Small reusable Product Section component
---------------------------------------------------------- */
function ProductSection({
  title,
  subtitle,
  href,
  products,
  loading,
}: {
  title: string;
  subtitle?: string;
  href: string;
  products: Product[];
  loading: boolean;
}) {
  return (
    <section className="bg-white/80 rounded-2xl border border-rose-100 p-4 sm:p-6 shadow-sm">
      <div className="flex items-end justify-between mb-3 sm:mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-rose-700">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm text-[#167389] hover:text-rose-700"
        >
          View more <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-2xl border border-rose-100 bg-rose-50/50 animate-pulse"
              />
            ))
          : products.map((p) => (
              <Link
                key={p._id}
                href={`/products/${p.slug}`}
                className="group block rounded-2xl border border-rose-100 bg-white/80 shadow hover:shadow-md transition overflow-hidden"
              >
                <div className="relative h-40 sm:h-44">
                  <Image
                    src={pickImage(p) || FALLBACK_PROMO}
                    alt={p.title}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-3">
                  <div className="line-clamp-1 text-sm font-medium text-gray-800">
                    {p.title}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="text-rose-600 font-semibold">
                      ${Number(p.price || 0).toFixed(0)}
                    </div>
                    {typeof p.compareAtPrice === "number" &&
                      p.compareAtPrice > (p.price || 0) && (
                        <div className="text-xs text-gray-400 line-through">
                          ${p.compareAtPrice.toFixed(0)}
                        </div>
                      )}
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   ✅ Simple PromoCard reused (unchanged layout)
---------------------------------------------------------- */
function PromoCard({
  title,
  subtitle,
  img,
  href = "#",
}: {
  title: string;
  subtitle?: string;
  img: string;
  href?: string;
}) {
  const src = img || FALLBACK_PROMO;
  return (
    <Link
      href={href}
      className="group relative block h-full w-full rounded-2xl overflow-hidden border border-rose-100 bg-white/70 shadow"
    >
      <Image
        src={src}
        alt={title}
        fill
        sizes="(max-width:1024px) 50vw, 16vw"
        className="object-cover group-hover:scale-105 transition"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute left-3 bottom-3 text-white drop-shadow">
        <div className="text-sm font-semibold">{title}</div>
        {subtitle && <div className="text-xs opacity-90">{subtitle}</div>}
      </div>
    </Link>
  );
}
