"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/lib/schemas";
import { toast } from "react-hot-toast";

type Props = {
  title?: string;
  subtitle?: string;
  products: Product[];
  className?: string;
};

const formatPrice = (v: number) => `৳${Number(v || 0).toLocaleString("en-BD")}`;
const calcDiscount = (price = 0, compare = 0) =>
  compare > price && price > 0
    ? Math.round(((compare - price) / compare) * 100)
    : 0;

export default function TrendingGrid({
  title = "Trending",
  subtitle = "Best Deals Right Now - Select Quantity and Order Instantly",
  products,
  className,
}: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!products?.length) return;
    setQuantities((prev) => {
      const next = { ...prev };
      products.forEach((p) => {
        if (!(p._id in next)) next[p._id] = 1;
      });
      return next;
    });
  }, [products]);

  useEffect(() => {
    const updates: Record<string, number> = {};
    products.forEach((p) => {
      const currentQty = quantities[p._id] || 1;
      const stock = Math.max(0, Number(p.stock ?? 0));
      const cartItem = cartItems.find((item) => item._id === p._id);
      const reserved = cartItem?.quantity || 0;
      const available = Math.max(0, stock - reserved);
      const safeQty = Math.min(currentQty, available || 1);
      if (safeQty !== currentQty) {
        updates[p._id] = safeQty;
      }
    });
    if (Object.keys(updates).length > 0) {
      setQuantities((prev) => ({ ...prev, ...updates }));
    }
  }, [products, cartItems, quantities]);

  const computed = useMemo(() => {
    return products.map((p) => {
      let image =
        (p.image as string) ||
        (Array.isArray((p as any).images) ? (p as any).images[0] : "") ||
        "/placeholder-product.jpg";
      if (!image || typeof image !== "string" || image.trim() === "") {
        image = "/placeholder-product.jpg";
      }
      const price = Number(p.price ?? 0);
      const compare = Number(p.compareAtPrice ?? 0);
      const discount = calcDiscount(price, compare);
      const stock = Math.max(0, Number(p.stock ?? 0));
      const currentQty = quantities[p._id] || 1;
      const availableStock = Math.max(0, stock);
      const cartItem = cartItems.find((item) => item._id === p._id);
      const reservedInCart = cartItem?.quantity || 0;
      const actuallyAvailable = Math.max(0, availableStock - reservedInCart);
      const safeQty = Math.min(currentQty, actuallyAvailable || 1);
      const total = price * safeQty;
      const isOutOfStock = actuallyAvailable === 0;
      const isLowStock = actuallyAvailable > 0 && actuallyAvailable <= 5;
      return {
        p,
        image,
        price,
        compare,
        discount,
        stock: actuallyAvailable,
        qty: safeQty,
        total,
        isOutOfStock,
        isLowStock,
      };
    });
  }, [products, quantities, cartItems]);

  const increment = (id: string) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const productData = computed.find((c) => c.p._id === id);
      const maxAllowed = productData?.stock || 1;
      return { ...prev, [id]: Math.min(current + 1, maxAllowed) };
    });
  };

  const decrement = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  const handleAdd = async (productData: (typeof computed)[0]) => {
    const { p, qty, stock, image, price } = productData;
    if (!addItem) {
      toast.error("Cart is not available.");
      return;
    }
    if (qty <= 0) {
      toast.error("Please select a valid quantity");
      return;
    }
    if (qty > stock) {
      toast.error(`Only ${stock} products in stock`);
      return;
    }
    try {
      setLoadingIds((prev) => ({ ...prev, [p._id]: true }));
      const cartItem = {
        _id: p._id,
        title: p.title,
        slug: p.slug || "",
        price: price,
        image: image,
        quantity: qty,
        maxQuantity: stock,
        stock: stock,
      };
      addItem(cartItem);
      toast.success(`${qty} × ${p.title} added to cart`);
      setQuantities((prev) => ({ ...prev, [p._id]: 1 }));
    } catch (error) {
      console.error("Cart error:", error);
      toast.error("Error adding to cart");
    } finally {
      setLoadingIds((prev) => {
        const updated = { ...prev };
        delete updated[p._id];
        return updated;
      });
    }
  };

  const handleBuyNow = (productData: (typeof computed)[0]) => {
    handleAdd(productData);
    setTimeout(() => {
      router.push("/checkout");
    }, 500);
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  function ProductCardTrending({
    productData,
  }: {
    productData: (typeof computed)[0];
  }) {
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
    const loading = !!loadingIds[p._id];
    return (
      <div
        className={`
        product-card group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm
        ${isOutOfStock ? "opacity-60 grayscale" : "hover:shadow-lg"}
        transition-all duration-300 h-full flex flex-col
      `}
      >
        <div className="relative h-32 sm:h-40 bg-gray-50 flex-shrink-0">
          <Link href={`/products/${p.slug}`} className="block w-full h-full">
            <Image
              src={image}
              alt={p.title}
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loader={({ src }) => src}
            />
          </Link>
          {discount > 0 && (
            <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
              {discount}% OFF
            </div>
          )}
          {isOutOfStock ? (
            <div className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
              Out
            </div>
          ) : (
            isLowStock && (
              <div className="absolute top-1.5 right-1.5 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                Low
              </div>
            )
          )}
        </div>
        <div className="p-2 sm:p-3 flex flex-col flex-1">
          <Link href={`/products/${p.slug}`} className="block mb-1.5">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-pink-600 transition-colors leading-tight">
              {p.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <span className="text-sm sm:text-base font-bold text-gray-900">
                {formatPrice(total)}
              </span>
              {discount > 0 && (
                <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                  {formatPrice(price * qty)}
                </span>
              )}
            </div>
            {!isOutOfStock && stock < 20 && (
              <div className="text-[10px] text-gray-600">{stock} left</div>
            )}
          </div>
          <div className="space-y-2 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-gray-600">Qty:</span>
              <div className="flex items-center gap-0.5 bg-gray-100 rounded-md p-0.5">
                <button
                  onClick={() => decrement(p._id)}
                  disabled={qty <= 1 || loading || isOutOfStock}
                  className="w-6 h-6 flex items-center justify-center rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold text-gray-800 text-xs">
                  {qty}
                </span>
                <button
                  onClick={() => increment(p._id)}
                  disabled={loading || isOutOfStock || qty >= stock}
                  className="w-6 h-6 flex items-center justify-center rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
                >
                  +
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleAdd(productData)}
                disabled={isOutOfStock || loading}
                className="px-2 py-1.5 bg-[#167389] text-white text-[10px] sm:text-xs font-semibold rounded-md hover:bg-[#135a6b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Adding</span>
                  </>
                ) : (
                  `Add ${qty > 1 ? `(${qty})` : ""}`
                )}
              </button>
              <button
                onClick={() => handleBuyNow(productData)}
                disabled={isOutOfStock || loading}
                className="px-2 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[10px] sm:text-xs font-semibold rounded-md hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile: Only show first 2 cards
  const mobileProducts = computed.slice(0, 2);
  const hasMore = computed.length > 2;

  return (
    <section className={className}>
      <div className="product-section">
        <div className="product-section__header">
          <div>
            <h2 className="product-section__title">{title}</h2>
            <p className="product-section__subtitle">{subtitle}</p>
          </div>
          <Link href="/search?tag=trending" className="product-section__link">
            See all
            <svg width="16" height="16" viewBox="0 0 24 24" className="ml-1">
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Mobile: Only 2 cards + scroll if more */}
        <div className="lg:hidden relative">
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-3 px-3"
          >
            <div className="flex gap-2.5 pb-2">
              {!mounted
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-[calc(50%-5px)] min-w-[160px] max-w-[180px] snap-center"
                    >
                      <div className="product-section__skeleton h-64 rounded-xl" />
                    </div>
                  ))
                : mobileProducts.map((productData) => (
                    <div
                      key={productData.p._id}
                      className="flex-shrink-0 w-[calc(50%-5px)] min-w-[160px] max-w-[180px] snap-center"
                    >
                      <ProductCardTrending productData={productData} />
                    </div>
                  ))}
            </div>
          </div>

          {/* Arrows - only if more than 2 */}
          {hasMore && (
            <>
              <button
                onClick={scrollPrev}
                aria-label="Previous"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1.5 shadow-lg z-10"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="text-gray-700"
                >
                  <path
                    d="M15 19l-7-7 7-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1.5 shadow-lg z-10"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="text-gray-700"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* View All Button - Mobile */}
        {hasMore && (
          <div className="lg:hidden flex justify-center mt-3">
            <Link
              href="/search?tag=trending"
              className="px-4 py-2 bg-[#167389] text-white text-xs font-semibold rounded-md hover:bg-[#135a6b] transition-colors"
            >
              View All ({computed.length})
            </Link>
          </div>
        )}

        {/* Desktop: Show only 8 cards */}
        <div className="hidden lg:grid product-section__grid">
          {!mounted
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="product-section__skeleton" />
              ))
            : computed
                .slice(0, 8)
                .map((productData) => (
                  <ProductCardTrending
                    key={productData.p._id}
                    productData={productData}
                  />
                ))}
        </div>

        {/* View More - Desktop Only */}
        {mounted && computed.length > 8 && (
          <div className="hidden lg:flex justify-center mt-4">
            <Link
              href="/search?tag=trending"
              className="px-5 py-2.5 bg-gradient-to-r from-[#167389] to-[#135a6b] text-white text-sm font-semibold rounded-lg hover:shadow-md transition-shadow"
            >
              View More
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
