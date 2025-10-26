"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchCategories, fetchProducts } from "@/services/catalog";
import type { Product, Category } from "@/lib/schemas";
import { ShoppingBag, ChevronRight, Camera, Sparkles } from "lucide-react";

/** ---- Fallback images ---- */
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
    BannerCarousel
---------------------------------------------------------- */
function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm h-full">
      <div className="relative h-[180px] sm:h-[250px] lg:h-[360px]">
        {BANNER_IMAGES.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt={`Banner ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width:1024px) 100vw, 70vw"
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-3 sm:left-5 bottom-3 sm:bottom-5 text-white drop-shadow max-w-[80%] pointer-events-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-600/90 px-2.5 py-1 text-[10px] sm:text-xs mb-1.5 sm:mb-2">
              <Camera size={12} /> Beauty Week
            </div>
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold leading-tight">
              Glow like never before
            </h1>
            <p className="text-[10px] sm:text-xs opacity-90 mt-0.5 sm:mt-1">
              Makeup • Skincare • Fragrance
            </p>
            <div className="mt-2 sm:mt-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 text-rose-700 px-3 py-1.5 text-xs sm:text-sm font-medium shadow hover:shadow-md hover:-translate-y-0.5 transition pointer-events-auto"
              >
                Shop now <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex gap-1.5">
          {BANNER_IMAGES.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition ${
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
    Desktop Categories Scroll Carousel (Below Banner) - FIXED
---------------------------------------------------------- */
function CategoriesScrollCarousel({ categories }: { categories: Category[] }) {
  const [isPaused, setIsPaused] = useState(false);
  const duplicatedCategories = [...categories, ...categories];

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#167389]" size={18} />
          <h2 className="text-base font-semibold text-[#167389]">
            Shop by Categories
          </h2>
        </div>
        <Link
          href="/products"
          className="text-sm text-[#167389] hover:text-rose-600 transition flex items-center gap-1"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="overflow-hidden">
          <div
            className={`flex gap-3 ${isPaused ? "" : "animate-scroll-desktop"}`}
            style={{
              width: `${duplicatedCategories.length * 120}px`,
            }}
          >
            {duplicatedCategories.map((cat, idx) => (
              <Link
                key={`${cat._id}-${idx}`}
                href={`/c/${cat.slug}`}
                className="desktop-category-scroll-card"
              >
                <div className="desktop-category-scroll-card__image-wrapper">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="110px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center">
                      <ShoppingBag className="text-[#167389]" size={28} />
                    </div>
                  )}
                </div>
                <p className="desktop-category-scroll-card__title">
                  {cat.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>

      <style jsx>{`
        @keyframes scroll-desktop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-desktop {
          animation: scroll-desktop 40s linear infinite;
        }
      `}</style>
    </section>
  );
}

/* ---------------------------------------------------------
    Mobile Categories Scroll (4 cards visible)
---------------------------------------------------------- */
function MobileCategoriesScroll({ categories }: { categories: Category[] }) {
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="text-[#167389]" size={16} />
          <h3 className="text-sm font-semibold text-[#167389]">Categories</h3>
        </div>
        <Link
          href="/products"
          className="text-xs text-[#167389] hover:text-rose-600 transition flex items-center gap-0.5"
        >
          All <ChevronRight size={14} />
        </Link>
      </div>
      <div className="overflow-x-auto scrollbar-hide -mx-3 px-3">
        <div className="flex gap-2.5 min-w-max pb-1">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/c/${cat.slug}`}
              className="mobile-category-card"
            >
              <div className="mobile-category-card__image">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="70px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center">
                    <ShoppingBag className="text-[#167389]" size={20} />
                  </div>
                )}
              </div>
              <p className="mobile-category-card__title">{cat.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
    Main HomePage
---------------------------------------------------------- */
export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hotDeals, setHotDeals] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

        const catRes = await safeFetch("categories", fetchCategories);
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
          setCategories(catRes?.data || []);
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-2.5 sm:px-3 lg:px-5 pt-0 pb-1.5 sm:pb-2 lg:py-3">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-2 lg:gap-3">
          {/* ---------- LEFT SIDEBAR (Desktop Only) ---------- */}
          <aside className="hidden lg:block">
            <div className="sticky top-[72px]">
              <div className="desktop-sidebar">
                <div className="desktop-sidebar__header">
                  <Sparkles size={18} /> Categories
                </div>
                <div className="desktop-sidebar__content">
                  {loading
                    ? Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="desktop-sidebar__skeleton" />
                      ))
                    : categories.map((c) => (
                        <Link
                          key={c._id}
                          href={`/c/${c.slug}`}
                          className="desktop-sidebar__card"
                        >
                          <div className="desktop-sidebar__card-image">
                            {c.image ? (
                              <Image
                                src={c.image}
                                alt={c.title}
                                fill
                                sizes="50px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full grid place-items-center text-[#167389]">
                                <ShoppingBag size={18} />
                              </div>
                            )}
                          </div>
                          <div className="desktop-sidebar__card-title">
                            {c.title}
                          </div>
                        </Link>
                      ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ---------- MAIN CONTENT ---------- */}
          <main className="space-y-2.5 lg:space-y-3 min-w-0">
            {/* Banner + Right Promo (Desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-2 lg:gap-3">
              <BannerCarousel />

              {/* Right Promo (Desktop Only) */}
              <div className="hidden lg:block">
                <div className="desktop-promo">
                  <div className="desktop-promo__header">
                    <Sparkles size={16} /> Featured
                  </div>
                  <div className="desktop-promo__content">
                    {promoBanners.map((promo, idx) => (
                      <PromoCard key={idx} {...promo} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Promo Cards (Below Banner) */}
            <div className="lg:hidden grid grid-cols-2 gap-2">
              {promoBanners.map((promo, idx) => (
                <Link key={idx} href={promo.href} className="mobile-promo-card">
                  <Image
                    src={promo.img || FALLBACK_PROMO}
                    alt={promo.title}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                  <div className="mobile-promo-card__gradient" />
                  <div className="mobile-promo-card__content">
                    <div className="mobile-promo-card__title">
                      {promo.title}
                    </div>
                    {promo.subtitle && (
                      <div className="mobile-promo-card__subtitle">
                        {promo.subtitle}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Categories Scroll (4 cards visible) */}
            {!loading && categories.length > 0 && (
              <MobileCategoriesScroll categories={categories} />
            )}

            {/* Desktop Categories Scroll (Below Banner) */}
            {!loading && categories.length > 0 && (
              <div className="hidden lg:block">
                <CategoriesScrollCarousel categories={categories} />
              </div>
            )}

            {/* Product Sections */}
            <ProductSection
              title="🔥 Hot Deals"
              subtitle="Limited time beauty steals"
              products={hotDeals}
              loading={loading}
              href="/search?discounted=true"
            />
            <ProductSection
              title="✨ New Arrivals"
              subtitle="Fresh drops in makeup & skincare"
              products={newArrivals}
              loading={loading}
              href="/search?sort=new"
            />
            <ProductSection
              title="💎 Editor's Picks"
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
    Product Section component
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
    <section className="product-section">
      <div className="product-section__header">
        <div>
          <h2 className="product-section__title">{title}</h2>
          {subtitle && <p className="product-section__subtitle">{subtitle}</p>}
        </div>
        <Link href={href} className="product-section__link">
          View more <ChevronRight size={16} />
        </Link>
      </div>

      <div className="product-section__grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-section__skeleton" />
            ))
          : products.map((p) => (
              <Link
                key={p._id}
                href={`/products/${p.slug}`}
                className="product-card"
              >
                <div className="product-card__image">
                  <Image
                    src={pickImage(p) || FALLBACK_PROMO}
                    alt={p.title}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    className="product-card__img"
                  />
                </div>
                <div className="product-card__content">
                  <div className="product-card__title">{p.title}</div>
                  <div className="product-card__price-group">
                    <div className="product-card__price">
                      ${Number(p.price || 0).toFixed(0)}
                    </div>
                    {typeof p.compareAtPrice === "number" &&
                      p.compareAtPrice > (p.price || 0) && (
                        <div className="product-card__compare-price">
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
    PromoCard (for desktop sidebar)
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
    <Link href={href} className="promo-card">
      <Image
        src={src}
        alt={title}
        fill
        sizes="200px"
        className="promo-card__image"
      />
      <div className="promo-card__gradient" />
      <div className="promo-card__content">
        <div className="promo-card__title">{title}</div>
        {subtitle && <div className="promo-card__subtitle">{subtitle}</div>}
      </div>
    </Link>
  );
}
