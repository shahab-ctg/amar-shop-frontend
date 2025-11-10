/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/TrendingGrid.tsx */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";
import { useConfirmOrderMutation } from "@/services/catalog.api";
import type { AppProduct } from "@/types/product"; // <-- use shared type

interface TrendingGridProps {
  title?: string;
  subtitle?: string;
  products: AppProduct[]; // <-- strict AppProduct
  className?: string;
}

interface ComputedProduct {
  p: AppProduct;
  image: string;
  price: number;
  compare: number;
  discount: number;
  stock: number;
  qty: number;
  total: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

const DEFAULT_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#f8fafc'/><text x='50%' y='50%' text-anchor='middle' fill='#ec4899' font-size='20' font-family='Arial'>No image</text></svg>`
  );

const MOBILE_CARD_WIDTH = "w-[calc(50%-12px)]";

const formatPrice = (v: number) => `৳${Number(v || 0).toLocaleString("en-BD")}`;
const calculateDiscount = (price = 0, compare = 0) =>
  compare > price && price > 0
    ? Math.round(((compare - price) / compare) * 100)
    : 0;

const getSafeImageUrl = (image: any): string => {
  if (!image || image === "null" || image === "undefined" || image === "")
    return DEFAULT_IMAGE;
  if (typeof image === "string" && image.startsWith("data:")) return image;
  if (typeof image === "string" && /^https?:\/\//.test(image)) return image;
  if (
    typeof image === "string" &&
    image.startsWith("/") &&
    !image.includes("placeholder.png")
  )
    return image;
  return DEFAULT_IMAGE;
};

function ProductImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const initial = getSafeImageUrl(src);
  const [localSrc, setLocalSrc] = useState<string>(initial);
  const [errored, setErrored] = useState(false);
  const isData = localSrc.startsWith("data:");

  const handleError = () => {
    if (!errored) {
      setLocalSrc(DEFAULT_IMAGE);
      setErrored(true);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const t = e.target as HTMLImageElement;
    if (t.naturalWidth === 0 && !errored) {
      setLocalSrc(DEFAULT_IMAGE);
      setErrored(true);
    }
  };

  return (
    <Image
      src={localSrc}
      alt={alt}
      fill
      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
      className={className}
      quality={75}
      onError={handleError}
      onLoad={handleLoad}
      unoptimized={isData}
    />
  );
}

export default function TrendingGrid({
  title = "Trending",
  subtitle = "Best Deals Right Now - Select Quantity and Order Instantly",
  products,
  className,
}: TrendingGridProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [confirmOrder] = useConfirmOrderMutation();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!products?.length) return;
    setQuantities((prev) => {
      let changed = false;
      const next = { ...prev };
      products.forEach((p) => {
        if (!(p._id in next)) {
          next[p._id] = 1;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [products]);

  // stockMap considers reserved items in cart
  const stockMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const product of products) {
      const totalStock = Math.max(0, Number(product.stock ?? 0));
      const reserved =
        cartItems.find((ci) => ci._id === product._id)?.quantity || 0;
      map[product._id] = Math.max(0, totalStock - reserved);
    }
    return map;
  }, [products, cartItems]);

  const computedProducts = useMemo<ComputedProduct[]>(
    () =>
      products.map((p) => {
        let raw = "";
        if (p.image && p.image !== "null" && p.image !== "undefined")
          raw = p.image as string;
        else if (Array.isArray((p as any).images) && (p as any).images.length)
          raw = (p as any).images[0];

        const image = getSafeImageUrl(raw);
        const price = Number(p.price ?? 0);
        const compare = Number(p.compareAtPrice ?? 0);
        const discount = calculateDiscount(price, compare);
        const available = Math.max(0, stockMap[p._id] ?? 0);
        const qty = Math.min(
          Math.max(1, quantities[p._id] || 1),
          Math.max(1, available || 1)
        );
        const total = price * qty;
        const isOut = available === 0;
        const isLow = available > 0 && available <= 5;

        return {
          p,
          image,
          price,
          compare,
          discount,
          stock: available,
          qty,
          total,
          isOutOfStock: isOut,
          isLowStock: isLow,
        };
      }),
    [products, quantities, stockMap]
  );

  const updateQuantity = useCallback(
    (id: string, n: number) => {
      setQuantities((prev) => {
        const maxAllowed = Math.max(1, stockMap[id] ?? 1);
        const safe = Math.max(1, Math.min(n, maxAllowed));
        if (prev[id] === safe) return prev;
        return { ...prev, [id]: safe };
      });
    },
    [stockMap]
  );

  const incrementQuantity = useCallback(
    (id: string) => updateQuantity(id, (quantities[id] || 1) + 1),
    [updateQuantity, quantities]
  );
  const decrementQuantity = useCallback(
    (id: string) => updateQuantity(id, (quantities[id] || 1) - 1),
    [updateQuantity, quantities]
  );

  const setLoadingOn = useCallback(
    (id: string) =>
      setLoadingStates((prev) => (prev[id] ? prev : { ...prev, [id]: true })),
    []
  );
  const setLoadingOff = useCallback(
    (id: string) =>
      setLoadingStates((prev) => {
        if (!prev[id]) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }),
    []
  );

  const handleAddToCart = useCallback(
    async (cprod: ComputedProduct) => {
      const { p, qty, stock, image, price } = cprod;
      if (qty <= 0) {
        toast.error("Please select a valid quantity");
        return;
      }
      if (qty > stock) {
        toast.error(`Only ${stock} items available in stock`);
        return;
      }

      if (loadingStates[p._id]) return;
      try {
        setLoadingOn(p._id);
        // use store's addItem (idempotent)
        addItem({
          _id: p._id,
          title: p.title,
          slug: p.slug || "",
          price,
          image,
          quantity: qty,
        });
        toast.success(`${qty} × ${p.title} added to cart`);
        setQuantities((prev) =>
          prev[p._id] === 1 ? prev : { ...prev, [p._id]: 1 }
        );
      } catch (err) {
        console.error("Add to cart failed", err);
        toast.error("Failed to add to cart");
      } finally {
        setTimeout(() => setLoadingOff(p._id), 200);
      }
    },
    [addItem, loadingStates, setLoadingOn, setLoadingOff]
  );

  // Buy now -> create order (server) then invalidate products cache (handled by RTK mutation)
  const handleBuyNow = useCallback(
    async (cprod: ComputedProduct) => {
      const { p, qty, stock } = cprod;
      if (qty <= 0) {
        toast.error("Please select a valid quantity");
        return;
      }
      if (qty > stock) {
        toast.error(`Only ${stock} items available in stock`);
        return;
      }

      try {
        // simple flow: add to cart then call confirmOrder mutation to create order
        addItem({
          _id: p._id,
          title: p.title,
          slug: p.slug || "",
          price: Number(cprod.price),
          image: cprod.image,
          quantity: qty,
        });

        // call backend to create order (this will reduce stock server-side)
        const payload = { items: [{ _id: p._id, quantity: qty }] };
        const resp = await confirmOrder(payload).unwrap(); // throws on error

        if (resp && resp.ok) {
          toast.success("Order placed");
          // RTK invalidation will refetch products because confirmOrder invalidates product tags
          // optionally clear cart or remove ordered items
        } else {
          toast.success("Order created (response uncertain)");
        }

        router.push("/checkout");
      } catch (err) {
        console.error("Buy Now failed:", err);
        toast.error("Could not place order");
      }
    },
    [addItem, confirmOrder, router]
  );

  function ProductCard({ productData }: { productData: ComputedProduct }) {
    const {
      p,
      image,
      qty,
      price,
      total,
      discount,
      stock,
      isOutOfStock,
      isLowStock,
    } = productData;
    const loading = !!loadingStates[p._id];

    return (
      <div
        className={`group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${isOutOfStock ? "opacity-60 grayscale" : "hover:shadow-md hover:border-gray-300"} transition-all duration-300 h-full flex flex-col`}
      >
        <div className="relative w-full h-44 sm:h-52 md:h-64 bg-white flex-shrink-0 flex items-center justify-center">
          <Link
            href={`/products/${p.slug}`}
            className="block w-full h-full"
            aria-label={`View ${p.title}`}
          >
            <ProductImage
              src={image}
              alt={p.title}
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-none">
            <div>
              {discount > 0 && (
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  {discount}% OFF
                </span>
              )}
            </div>
            <div>
              {isOutOfStock ? (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  Out
                </span>
              ) : (
                isLowStock && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    Low
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="p-3 flex flex-col flex-1">
          <Link
            href={`/products/${p.slug}`}
            className="block mb-2 group-hover:text-pink-600 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight min-h-[2.5rem]">
              {p.title}
            </h3>
          </Link>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-gray-900">
                {formatPrice(total)}
              </span>
              {discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(price * qty)}
                </span>
              )}
            </div>
            {!isOutOfStock && stock < 20 && (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {stock} left
              </span>
            )}
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Qty:</span>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => decrementQuantity(p._id)}
                  disabled={qty <= 1 || loading || isOutOfStock}
                  className="w-7 h-7 rounded-md bg-white border border-gray-300"
                >
                  −
                </button>
                <span className="w-7 text-center font-bold text-gray-800 text-sm">
                  {qty}
                </span>
                <button
                  onClick={() => incrementQuantity(p._id)}
                  disabled={loading || isOutOfStock || qty >= stock}
                  className="w-7 h-7 rounded-md bg-white border border-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddToCart(productData)}
                disabled={isOutOfStock || loading}
                className="px-3 py-2 bg-[#167389] text-white rounded-lg text-xs font-semibold"
              >
                {loading ? "Adding..." : <>Add {qty > 1 && `(${qty})`}</>}
              </button>
              <button
                onClick={() => handleBuyNow(productData)}
                disabled={isOutOfStock || loading}
                className="px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg text-xs font-semibold"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mobileProducts = computedProducts.slice(0, 4);
  const hasMore = computedProducts.length > 2;
  const trendingUrl = "/search?tag=trending";

  return (
    <section className={className}>
      <div className="product-section">
        <div className="product-section__header flex items-center justify-between mb-4">
          <div>
            <h2 className="product-section__title text-lg font-bold">
              {title}
            </h2>
            <p className="product-section__subtitle text-sm text-gray-600">
              {subtitle}
            </p>
          </div>
          <Link
            href={trendingUrl}
            className="product-section__link text-sm text-gray-700"
          >
            See all →
          </Link>
        </div>

        <div className="lg:hidden">
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide snap-x -mx-4 px-4"
          >
            <div className="flex gap-3 pb-3">
              {!mounted
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${MOBILE_CARD_WIDTH} flex-shrink-0 min-w-[160px] max-w-[180px] snap-center`}
                    >
                      <div className="h-72 bg-gray-200 rounded-2xl animate-pulse" />
                    </div>
                  ))
                : mobileProducts.map((mp) => (
                    <div
                      key={mp.p._id}
                      className={`${MOBILE_CARD_WIDTH} flex-shrink-0 min-w-[160px] max-w-[180px] snap-center`}
                    >
                      <ProductCard productData={mp} />
                    </div>
                  ))}
            </div>
          </div>

          {hasMore && (
            <div className="flex justify-center mt-4">
              <Link
                href={trendingUrl}
                className="px-5 py-2.5 bg-[#167389] text-white rounded-lg"
              >
                View All Trending Products
              </Link>
            </div>
          )}
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 gap-4">
          {!mounted
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 bg-gray-200 rounded-2xl animate-pulse"
                />
              ))
            : computedProducts
                .slice(0, 8)
                .map((pd) => <ProductCard key={pd.p._id} productData={pd} />)}
        </div>

        {mounted && computedProducts.length > 8 && (
          <div className="hidden lg:flex justify-center mt-6">
            <Link
              href={trendingUrl}
              className="px-6 py-3 bg-gradient-to-r from-[#167389] to-[#135a6b] text-white rounded-xl"
            >
              View More Trending Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
