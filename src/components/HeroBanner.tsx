"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

/** -------- Types -------- */
type Banner = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  discount?: string;
};

type Product = {
  _id: string;
  title: string;
  image?: string;
  price: number | string;
  compareAtPrice?: number | string;
  isDiscounted?: boolean;
  status?: "ACTIVE" | "DRAFT" | "HIDDEN";
};

const FALLBACK_BANNERS: Banner[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=500&fit=crop",
    title: "তাজা সবজি",
    subtitle: "সরাসরি খেত থেকে আপনার দরজায়",
    discount: "৩০% ছাড়",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&h=500&fit=crop",
    title: "অর্গানিক ফল",
    subtitle: "রাসায়নিক মুক্ত ১০০% প্রাকৃতিক",
    discount: "২৫% ছাড়",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&h=500&fit=crop",
    title: "দেশি মাছ",
    subtitle: "খাঁটি দেশি মাছ প্রতিদিন তাজা",
    discount: "১৫% ছাড়",
  },
];

/** শুদ্ধ ইমেজ URL কিনা চেক (http/https/relative) */
const isValidImageUrl = (u?: string) => {
  if (!u) return false;
  if (u.startsWith("/")) return true;
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/** শতাংশ হিসাব (optional) */
const pctOff = (price?: number, compareAt?: number) => {
  if (!price || !compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
};

export default function BannerSlider() {
  // UI states
  const [banners, setBanners] = useState<Banner[]>(FALLBACK_BANNERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  // slider states
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    "http://localhost:5000/api/v1";

  /** --- 1) আগে /banners থেকে ট্রাই, না পেলে /products থেকে বানান --- */
  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      setLoading(true);
      setErr(null);

      try {
        // A) banners endpoint
        const res1 = await fetch(`${API_BASE}/banners`, {
          signal: ac.signal,
          headers: { "content-type": "application/json" },
          cache: "no-store",
        });

        if (res1.ok) {
          const json1 = await res1.json();
          const data1 = (json1?.data ?? []) as Banner[];
          const normalized1 = Array.isArray(data1)
            ? data1
                .filter((b) => b && isValidImageUrl(b.image))
                .map((b, i) => ({
                  id: String(b.id ?? i),
                  image: b.image,
                  title: b.title ?? "",
                  subtitle: b.subtitle ?? "",
                  discount: b.discount,
                }))
            : [];

          if (normalized1.length > 0) {
            setBanners(normalized1);
            setLoading(false);
            return;
          }
        }

        // B) products endpoint (fallback source)
        const res2 = await fetch(
          `${API_BASE}/products?limit=8&discounted=false`,
          {
            signal: ac.signal,
            headers: { "content-type": "application/json" },
            cache: "no-store",
          }
        );

        if (!res2.ok) throw new Error(`Products load failed (${res2.status})`);

        const json2 = await res2.json();
        // আপনার API struct: { ok, data: { items, total, ... } } ধরে নেয়া
        const items = (json2?.data?.items ?? []) as Product[];

        // কেবল ACTIVE + valid image গুলো নিয়ে ব্যানার বানাই
        const normalized2: Banner[] = items
          .filter(
            (p) =>
              (p.status ?? "ACTIVE") === "ACTIVE" && isValidImageUrl(p.image)
          )
          .map((p, i) => {
            const price = Number(p.price);
            const compare =
              p.compareAtPrice != null ? Number(p.compareAtPrice) : undefined;
            const off = pctOff(price, compare);
            return {
              id: String(p._id ?? i),
              image: String(p.image),
              title: p.title ?? "Product",
              subtitle:
                compare && compare > price
                  ? `Before ৳${compare} → Now ৳${price}`
                  : `Price ৳${price}`,
              discount:
                off > 0 ? `${off}% OFF` : p.isDiscounted ? "Offer" : undefined,
            };
          });

        if (normalized2.length > 0) {
          setBanners(normalized2);
        } else {
          // কিছুই না পেলে fallback আগেই আছে
          setErr("No active product images found");
        }
      } catch (e: unknown) {
        if ((e as { name?: string })?.name !== "AbortError") {
          setErr((e as Error)?.message || "Failed to load banners/products");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, [API_BASE]);

  /** --- Auto play (pause on hover / visibility) --- */
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const clear = () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    if (autoPlay && banners.length > 1) {
      timerRef.current = window.setInterval(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
      }, 5000);
    }
    return clear;
  }, [autoPlay, banners.length]);

  useEffect(() => {
    const onVis = () => setAutoPlay(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const next = () => {
    setCurrent((c) => (c + 1) % banners.length);
    setAutoPlay(false);
  };
  const prev = () => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
    setAutoPlay(false);
  };

  /** CLS কমানোর জন্য প্রি-ডিফাইন্ড heights */
  const slideHeightClasses = useMemo(
    () => "h-56 xs:h-64 sm:h-80 lg:h-[420px] xl:h-[480px]",
    []
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Main Slider */}
      <div
        className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-2xl group"
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        <div className={`relative ${slideHeightClasses}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${current}-${banners[current]?.id}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={banners[current]?.image || ""}
                alt={banners[current]?.title || "Banner"}
                fill
                priority
                className="object-cover"
                unoptimized
              />

              {/* Overlay + Text */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-white px-4 sm:px-8 md:px-12 max-w-2xl"
                >
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-tight drop-shadow-md mb-2 sm:mb-3 lg:mb-4">
                    {banners[current]?.title}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/90 drop-shadow mb-3 sm:mb-4 lg:mb-6">
                    {banners[current]?.subtitle}
                  </p>

                  {banners[current]?.discount ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.35,
                        type: "spring",
                        stiffness: 220,
                        damping: 18,
                      }}
                      className="inline-block bg-yellow-400 text-emerald-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-extrabold text-sm sm:text-base lg:text-lg shadow-lg"
                    >
                      {banners[current].discount}
                    </motion.div>
                  ) : null}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous banner"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
        >
          <ChevronLeft className="text-emerald-600 w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={next}
          aria-label="Next banner"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
        >
          <ChevronRight className="text-emerald-600 w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => {
                setCurrent(idx);
                setAutoPlay(false);
              }}
              className={`transition-all ${
                idx === current
                  ? "w-8 h-2.5 bg-white rounded-full"
                  : "w-2.5 h-2.5 bg-white/60 rounded-full hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Badges */}
        {loading && (
          <div className="absolute top-3 right-3 text-[11px] sm:text-xs px-2 py-1 rounded bg-white/80 text-emerald-700 shadow">
            Loading…
          </div>
        )}
        {!loading && err && (
          <div className="absolute top-3 right-3 text-[11px] sm:text-xs px-2 py-1 rounded bg-white/80 text-red-600 shadow">
            Using fallback
          </div>
        )}
      </div>

      {/* Side cards (unchanged) */}
      <div className="hidden lg:flex flex-col gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl cursor-pointer flex-1"
        >
          <h3 className="text-2xl font-bold mb-2">বিশেষ অফার!</h3>
          <p className="mb-4">প্রথম অর্ডারে ৫০% ছাড়</p>
          <button className="bg-white text-orange-600 px-5 py-2.5 rounded-full font-bold hover:bg-orange-50 transition-colors">
            কিনুন এখনই
          </button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-6 text-white shadow-xl cursor-pointer flex-1"
        >
          <h3 className="text-xl font-bold mb-2">ফ্রি ডেলিভারি</h3>
          <p className="text-sm">৫০০ টাকার উপরে অর্ডারে</p>
        </motion.div>
      </div>
    </div>
  );
}
