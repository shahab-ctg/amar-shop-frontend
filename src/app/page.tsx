// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { fetchCategories, fetchProducts } from "@/services/catalog";
import type { Product, Category } from "@/lib/schemas";
import {
  ShoppingBag,
  ChevronRight,
  Camera,
  Heart,
  Sparkles,
} from "lucide-react";

/** ---- Fallback images ---- */
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

/** ---- Helpers ---- */
function pickImage(p: Partial<Product> & { images?: string[] }): string {
  if (typeof p.image === "string" && p.image.length > 3) return p.image;
  if (Array.isArray(p.images) && p.images[0]) return p.images[0]!;
  return "";
}

function SectionHeader({
  title,
  href,
  subtitle,
}: {
  title: string;
  href?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-3 sm:mb-4">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-rose-700">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        ) : null}
      </div>
      <Link
        href={href || "#"}
        className="inline-flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700"
      >
        View more <ChevronRight size={16} />
      </Link>
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  const img = pickImage(p) || FALLBACK_PROMO;
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group block rounded-2xl border border-rose-100 bg-white/80 shadow hover:shadow-md transition overflow-hidden"
    >
      <div className="relative h-40 sm:h-44">
        <Image
          src={img}
          alt={p.title}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition"
        />
        <button
          aria-label="Wishlist"
          className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow"
        >
          <Heart size={16} />
        </button>
      </div>
      <div className="p-3">
        <div className="line-clamp-1 text-sm font-medium text-gray-800">
          {p.title}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="text-rose-600 font-semibold">
            ৳{Number(p.price || 0).toFixed(0)}
          </div>
          {typeof p.compareAtPrice === "number" &&
          p.compareAtPrice > (p.price || 0) ? (
            <div className="text-xs text-gray-400 line-through">
              ৳{p.compareAtPrice.toFixed(0)}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function CategoryCard({ c }: { c: Category }) {
  return (
    <Link
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
          <div className="h-full w-full grid place-items-center text-rose-500">
            <ShoppingBag size={16} />
          </div>
        )}
      </div>
      <div className="text-sm text-gray-700">{c.title}</div>
    </Link>
  );
}

/** Small square icon style for the horizontal rail */
function CategoryTiny({ c }: { c: Category }) {
  return (
    <Link
      href={`/c/${c.slug}`}
      className="group flex flex-col items-center gap-2 min-w-[72px]"
    >
      <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-rose-100 bg-white/80 shadow-sm group-hover:shadow transition">
        {c.image ? (
          <Image
            src={c.image}
            alt={c.title}
            fill
            sizes="56px"
            className="object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-rose-500">
            <ShoppingBag size={18} />
          </div>
        )}
      </div>
      <div className="text-[11px] text-gray-700 line-clamp-1">{c.title}</div>
    </Link>
  );
}

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
        sizes="(max-width:1024px) 50vw, 25vw"
        className="object-cover group-hover:scale-105 transition"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute left-3 bottom-3 text-white drop-shadow">
        <div className="text-sm font-semibold">{title}</div>
        {subtitle ? <div className="text-xs opacity-90">{subtitle}</div> : null}
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [{ ok: cOk, data: categories }, hot, fresh, picks] = await Promise.all([
    fetchCategories(),
    fetchProducts({ discounted: "true", limit: 12 }),
    fetchProducts({ limit: 12 }),
    fetchProducts({ limit: 12 }),
  ]);

  const cats = (cOk ? categories : []).slice(0, 24);

  // Hero banner (product-first, then fallback)
  const heroCandidates = [...(fresh?.data || []), ...(hot?.data || [])]
    .map((p) => ({ p, img: pickImage(p as any) }))
    .filter((x) => x.img && x.img.length > 3)
    .slice(0, 5);

  const heroSrc = heroCandidates[0]?.img || FALLBACK_BANNER;
  const heroTitle = heroCandidates[0]?.p?.title || "Glow like never before";
  const heroSub =
    "Makeup • Skincare • Fragrance — curated for your unique look";

  // Right-side promos (match hero height by stacking flex items)
  const promoProducts = (fresh?.data || [])
    .map((p) => ({ title: p.title, img: pickImage(p as any) }))
    .filter((x) => x.img && x.img.length > 3)
    .slice(1, 3);

  const promoA = promoProducts[0] || {
    title: "Flat 20% Off",
    img: FALLBACK_PROMO,
  };
  const promoB = promoProducts[1] || {
    title: "New Collection",
    img: FALLBACK_PROMO,
  };

  // Sections (4 cards each)
  const hotDeals = (hot?.data || []).slice(0, 8);
  const newArrivals = (fresh?.data || []).slice(0, 8);
  const editorsPicks = (picks?.data || []).slice(0, 8);

  return (
    <main className="mx-auto max-w-8xl px-3 sm:px-4 lg:px-6 py-4">
      {/* ================== TOP ROW (lg: Left Fixed Sidebar • Center Hero • Right Promos) ================== */}
      <div className="grid grid-cols-16 gap-4">
        {/* ---------- LEFT: Fixed Category Sidebar (lg+) ---------- */}
        <aside className="hidden lg:block col-span-3">
          {/* Topbar height approx 84~96px → keep space using sticky top */}
          <div className="lg:sticky lg:top-[88px]">
            <div
              className="rounded-2xl border border-rose-100 bg-white/80 backdrop-blur shadow-sm p-3"
              style={{ maxHeight: "calc(100vh - 110px)" }}
            >
              <div className="mb-2 flex items-center gap-2 text-rose-700 font-semibold">
                <Sparkles size={16} /> Categories
              </div>
              {/* 2 cards per row, full vertical scroll */}
              <div
                className="grid grid-cols-2 gap-3 overflow-auto pr-1"
                style={{ maxHeight: "calc(100vh - 160px)" }}
              >
                {cats.length > 0
                  ? cats.map((c) => <CategoryCard key={c._id} c={c} />)
                  : Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[56px] rounded-xl border border-rose-100 bg-rose-50/50 animate-shimmer"
                      />
                    ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ---------- CENTER: Hero Banner ---------- */}
        <section className="col-span-12 lg:col-span-10 order-1 lg:order-none">
          <div className="relative rounded-2xl overflow-hidden border border-rose-100 bg-white">
            <div className="relative h-[220px] sm:h-[300px] lg:h-[480px]">
              <Image
                src={heroSrc}
                alt={heroTitle}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover animate-scale-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute left-4 sm:left-6 bottom-4 sm:bottom-6 text-white drop-shadow max-w-[80%]">
                <div className="inline-flex items-center gap-2 rounded-full bg-rose-600/90 px-2 py-1 text-xs mb-2">
                  <Camera size={14} /> Beauty Week
                </div>
                <h1 className="text-xl sm:text-3xl font-bold">{heroTitle}</h1>
                <p className="text-xs sm:text-sm opacity-90">{heroSub}</p>
                <div className="mt-3">
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/95 text-rose-700 px-3 py-2 text-sm font-medium shadow hover:shadow-md hover:-translate-y-0.5 transition"
                  >
                    Shop now <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- RIGHT: Two Promos (equal height) ---------- */}
        <aside className="hidden lg:flex col-span-3">
          <div
            className="flex lg:flex-col  gap-4 w-full"
            style={{ height: "480px" }}
          >
            <div className="flex-1">
              <PromoCard title={promoA.title} img={promoA.img} />
            </div>
            <div className="flex-1">
              <PromoCard title={promoB.title} img={promoB.img} />
            </div>
          </div>
        </aside>

        {/* ---------- Tablet (md→lg): Left hidden, promos under banner side-by-side ---------- */}
        <div className="col-span-12 lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="h-40 sm:h-48">
            <PromoCard title={promoA.title} img={promoA.img} />
          </div>
          <div className="h-40 sm:h-48">
            <PromoCard title={promoB.title} img={promoB.img} />
          </div>
        </div>
      </div>

      {/* ================== CATEGORY RAIL (horizontal, small icon cards) ================== */}
      <section className="mt-6">
        <div className="mb-2 flex items-center gap-2 text-rose-700 font-semibold">
          <Sparkles size={16} /> Explore Categories
        </div>
        <div className="-mx-3 px-3 overflow-x-auto">
          <div className="flex gap-3 pr-4">
            {(cOk ? categories : []).length > 0
              ? (cOk ? categories : []).map((c) => (
                  <CategoryTiny key={c._id} c={c} />
                ))
              : Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 w-60 lg:h-34 lg:w-[150px] rounded-xl border border-rose-100 bg-rose-50/50 animate-shimmer"
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ================== PRODUCT SECTIONS (4 cards each) ================== */}
      <section className="mt-8 sm:mt-10">
        <SectionHeader
          title="Hot Deals"
          href="/search?discounted=true"
          subtitle="Limited time beauty steals"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {hotDeals.length > 0
            ? hotDeals.map((p) => <ProductCard key={p._id} p={p} />)
            : Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-2xl border border-rose-100 bg-rose-50/50 animate-shimmer"
                />
              ))}
        </div>
      </section>

      <section className="mt-8 sm:mt-10">
        <SectionHeader
          title="New Arrivals"
          href="/search?sort=new"
          subtitle="Fresh drops in makeup & skincare"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {newArrivals.length > 0
            ? newArrivals.map((p) => <ProductCard key={p._id} p={p} />)
            : Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-2xl border border-rose-100 bg-rose-50/50 animate-shimmer"
                />
              ))}
        </div>
      </section>

      <section className="mt-8 sm:mt-10">
        <SectionHeader
          title="Editor’s Picks"
          href="/search?tag=featured"
          subtitle="Curated by our beauty editors"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {editorsPicks.length > 0
            ? editorsPicks.map((p) => <ProductCard key={p._id} p={p} />)
            : Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-2xl border border-rose-100 bg-rose-50/50 animate-shimmer"
                />
              ))}
        </div>
      </section>

      {/* ================== MOBILE CATEGORY GRID (3 per row) — optional helper ================== */}
      {/* চাইলে নিচের ব্লকটা রেখে দিতে পারো; না চাইলে মুছে দাও */}
      <section className="lg:hidden mt-8">
        <SectionHeader title="Shop by category" href="/categories" />
        <div className="grid grid-cols-3 gap-3">
          {(cOk ? categories : []).slice(0, 12).map((c) => (
            <CategoryCard key={c._id} c={c} />
          ))}
        </div>
      </section>
    </main>
  );
}
