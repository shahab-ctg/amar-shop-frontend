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
import type { AppProduct } from "@/types/product";

// ==================== TYPES & INTERFACES ====================
interface TrendingGridProps {
  title?: string;
  subtitle?: string;
  products: AppProduct[];
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

interface LoadingStates {
  [key: string]: boolean;
}

interface StockDelta {
  [key: string]: number;
}

// ==================== CONSTANTS & UTILS ====================
const DEFAULT_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#f8fafc'/><text x='50%' y='50%' text-anchor='middle' fill='#ec4899' font-size='20' font-family='Arial'>No image</text></svg>`
  );

const MOBILE_CARD_WIDTH = "w-[calc(50%-12px)]";
const LOW_STOCK_THRESHOLD = 5;
const MAX_INITIAL_DISPLAY = 8;
const MAX_MOBILE_DISPLAY = 4;

const formatPrice = (v: number) => `৳${Number(v || 0).toLocaleString("en-BD")}`;

const calculateDiscount = (price = 0, compare = 0): number => {
  if (compare > price && price > 0) {
    return Math.round(((compare - price) / compare) * 100);
  }
  return 0;
};

const getSafeImageUrl = (image: unknown): string => {
  if (!image || image === "null" || image === "undefined" || image === "") {
    return DEFAULT_IMAGE;
  }

  if (typeof image === "string") {
    if (image.startsWith("data:")) return image;
    if (/^https?:\/\//.test(image)) return image;
    if (image.startsWith("/") && !image.includes("placeholder.png")) {
      return image;
    }
  }

  return DEFAULT_IMAGE;
};

// ==================== REUSABLE COMPONENTS ====================
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

  const handleError = useCallback(() => {
    if (!errored) {
      setLocalSrc(DEFAULT_IMAGE);
      setErrored(true);
    }
  }, [errored]);

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      if (target.naturalWidth === 0 && !errored) {
        setLocalSrc(DEFAULT_IMAGE);
        setErrored(true);
      }
    },
    [errored]
  );

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
      priority={false}
    />
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
        Out of Stock
      </span>
    );
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return (
      <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
        Only {stock} left
      </span>
    );
  }

  return (
    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
      In Stock
    </span>
  );
}

function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  maxQuantity,
  disabled = false,
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  maxQuantity: number;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600 font-medium">Qty:</span>
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={onDecrement}
          disabled={disabled || quantity <= 1}
          className="w-7 h-7 rounded-md bg-white border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-7 text-center font-bold text-gray-800 text-sm">
          {quantity}
        </span>
        <button
          onClick={onIncrement}
          disabled={disabled || quantity >= maxQuantity}
          className="w-7 h-7 rounded-md bg-white border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function TrendingGrid({
  title = "Trending",
  subtitle = "Best Deals Right Now - Select Quantity and Order Instantly",
  products,
  className,
}: TrendingGridProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Store hooks
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s: any) =>
    s.removeItem ? s.removeItem : () => {}
  );

  // State management
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
  const [localStockDelta, setLocalStockDelta] = useState<StockDelta>({});
  const [confirmOrder] = useConfirmOrderMutation();

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize quantities
  useEffect(() => {
    if (!products?.length) return;

    setQuantities((prev) => {
      const newQuantities = { ...prev };
      let hasChanges = false;

      products.forEach((product) => {
        if (!(product._id in newQuantities)) {
          newQuantities[product._id] = 1;
          hasChanges = true;
        }
      });

      return hasChanges ? newQuantities : prev;
    });
  }, [products]);

  // Stock calculation with cart items and optimistic updates
  const stockMap = useMemo(() => {
    const map: Record<string, number> = {};

    products.forEach((product) => {
      const totalStock = Math.max(0, Number(product.stock ?? 0));
      const reserved =
        cartItems.find((item) => item._id === product._id)?.quantity || 0;
      const delta = localStockDelta[product._id] ?? 0;

      // Calculate available stock: server stock + optimistic delta - reserved in cart
      map[product._id] = Math.max(0, totalStock + delta - reserved);
    });

    return map;
  }, [products, cartItems, localStockDelta]);

  // Compute product data with all derived values
  const computedProducts = useMemo<ComputedProduct[]>(() => {
    return products.map((product) => {
      // Determine image source
      let imageSource = "";
      if (
        product.image &&
        product.image !== "null" &&
        product.image !== "undefined"
      ) {
        imageSource = product.image as string;
      } else if (
        Array.isArray((product as any).images) &&
        (product as any).images.length
      ) {
        imageSource = (product as any).images[0];
      }

      const image = getSafeImageUrl(imageSource);
      const price = Number(product.price ?? 0);
      const compare = Number(product.compareAtPrice ?? 0);
      const discount = calculateDiscount(price, compare);
      const availableStock = Math.max(0, stockMap[product._id] ?? 0);
      const quantity = Math.min(
        Math.max(1, quantities[product._id] || 1),
        Math.max(1, availableStock || 1)
      );
      const total = price * quantity;
      const isOutOfStock = availableStock === 0;
      const isLowStock =
        availableStock > 0 && availableStock <= LOW_STOCK_THRESHOLD;

      return {
        p: product,
        image,
        price,
        compare,
        discount,
        stock: availableStock,
        qty: quantity,
        total,
        isOutOfStock,
        isLowStock,
      };
    });
  }, [products, quantities, stockMap]);

  // Reset local stock deltas when products refetch
  useEffect(() => {
    if (!products?.length) return;

    setLocalStockDelta((prev) => {
      const newDeltas = { ...prev };
      let hasChanges = false;

      Object.keys(prev).forEach((productId) => {
        const productExists = products.some(
          (p) => String(p._id) === String(productId)
        );
        if (productExists) {
          delete newDeltas[productId];
          hasChanges = true;
        }
      });

      return hasChanges ? newDeltas : prev;
    });
  }, [products]);

  // ==================== QUANTITY HANDLERS ====================
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      setQuantities((prev) => {
        const maxAllowed = Math.max(1, stockMap[productId] ?? 1);
        const safeQuantity = Math.max(1, Math.min(newQuantity, maxAllowed));

        if (prev[productId] === safeQuantity) return prev;

        return { ...prev, [productId]: safeQuantity };
      });
    },
    [stockMap]
  );

  const incrementQuantity = useCallback(
    (productId: string) => {
      updateQuantity(productId, (quantities[productId] || 1) + 1);
    },
    [updateQuantity, quantities]
  );

  const decrementQuantity = useCallback(
    (productId: string) => {
      updateQuantity(productId, (quantities[productId] || 1) - 1);
    },
    [updateQuantity, quantities]
  );

  // ==================== LOADING STATE HANDLERS ====================
  const setLoadingOn = useCallback((productId: string) => {
    setLoadingStates((prev) =>
      prev[productId] ? prev : { ...prev, [productId]: true }
    );
  }, []);

  const setLoadingOff = useCallback((productId: string) => {
    setLoadingStates((prev) => {
      if (!prev[productId]) return prev;

      const newStates = { ...prev };
      delete newStates[productId];
      return newStates;
    });
  }, []);

  // ==================== CART & ORDER HANDLERS ====================
  const handleAddToCart = useCallback(
    async (computedProduct: ComputedProduct) => {
      const { p, qty, stock, image, price } = computedProduct;

      // Validation
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

        // Add to cart
        addItem({
          _id: p._id,
          title: p.title,
          slug: p.slug || "",
          price,
          image,
          quantity: qty,
        });

        toast.success(`${qty} × ${p.title} added to cart`);

        // Reset quantity to 1 after adding to cart
        setQuantities((prev) =>
          prev[p._id] === 1 ? prev : { ...prev, [p._id]: 1 }
        );
      } catch (error) {
        console.error("Add to cart failed", error);
        toast.error("Failed to add to cart. Please try again.");
      } finally {
        setTimeout(() => setLoadingOff(p._id), 200);
      }
    },
    [addItem, loadingStates, setLoadingOn, setLoadingOff]
  );

  const handleBuyNow = useCallback(
    async (computedProduct: ComputedProduct) => {
      const { p, qty, stock } = computedProduct;

      // Validation
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

        // Add to cart first to reserve the item
        addItem({
          _id: p._id,
          title: p.title,
          slug: p.slug || "",
          price: Number(computedProduct.price),
          image: computedProduct.image,
          quantity: qty,
        });

        // Confirm order with server
        const payload = { items: [{ _id: p._id, quantity: qty }] };
        const response = await confirmOrder(payload).unwrap();

        if (response?.ok) {
          // REMOVED: toast.success("Order placed"); // ❌ This was misleading

          // Remove from cart to avoid double counting
          try {
            (removeItem as any)(p._id);
          } catch (error) {
            // Ignore if removeItem is not supported
          }

          // Apply optimistic stock update
          setLocalStockDelta((prev) => ({
            ...prev,
            [p._id]: (prev[p._id] ?? 0) - qty,
          }));

          // Reset quantity
          setQuantities((prev) => ({ ...prev, [p._id]: 1 }));

          // Show appropriate message
          toast.success("Redirecting to checkout...");
        } else {
          toast.error("Failed to process order");
        }

        // Navigate to checkout page
        router.push("/checkout");
      } catch (error: any) {
        console.error("Buy Now failed:", error);

        // Specific error handling
        if (
          error?.data?.code === "INSUFFICIENT_STOCK" ||
          error?.status === 409
        ) {
          toast.error("Insufficient stock to place order");
        } else {
          toast.error("Could not place order. Please try again.");
        }
      } finally {
        setLoadingOff(p._id);
      }
    },
    [
      addItem,
      confirmOrder,
      loadingStates,
      removeItem,
      router,
      setLoadingOff,
      setLoadingOn,
    ]
  );

  // ==================== PRODUCT CARD COMPONENT ====================
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
        className={`group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${
          isOutOfStock
            ? "opacity-60 grayscale cursor-not-allowed"
            : "hover:shadow-md hover:border-gray-300 cursor-pointer"
        } transition-all duration-300 h-full flex flex-col`}
      >
        {/* Product Image */}
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

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                {discount}% OFF
              </span>
            </div>
          )}

          {/* Stock Status Badge */}
          <div className="absolute top-3 right-3">
            <StockBadge stock={stock} />
          </div>

          {/* Stock Count Badge */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full font-medium">
              Stock: {stock}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1">
          {/* Product Title */}
          <Link
            href={`/products/${p.slug}`}
            className="block mb-3 group-hover:text-pink-600 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight min-h-[2.5rem]">
              {p.title}
            </h3>
          </Link>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(total)}
              </span>
              {discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(price * qty)}
                </span>
              )}
            </div>

            {/* Quick Stock Info */}
            {!isOutOfStock && stock < 20 && (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {stock} left
              </span>
            )}
          </div>

          {/* Actions Section */}
          <div className="mt-auto space-y-3">
            {/* Quantity Selector */}
            <QuantitySelector
              quantity={qty}
              onIncrement={() => incrementQuantity(p._id)}
              onDecrement={() => decrementQuantity(p._id)}
              maxQuantity={stock}
              disabled={loading || isOutOfStock}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(productData)}
                disabled={isOutOfStock || loading}
                className="flex-1 px-4 py-2.5 bg-[#167389] text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#135a6b] transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <span>Add to Cart</span>
                    {qty > 1 && <span>({qty})</span>}
                  </>
                )}
              </button>

              {/* Buy Now Button */}
              <button
                onClick={() => handleBuyNow(productData)}
                disabled={isOutOfStock || loading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-700 hover:to-rose-700 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Buy Now"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER LOGIC ====================
  const mobileProducts = computedProducts.slice(0, MAX_MOBILE_DISPLAY);
  const hasMoreProducts = computedProducts.length > MAX_MOBILE_DISPLAY;
  const trendingUrl = "/search?tag=trending";

  // Loading skeletons
  const renderSkeletons = (count: number, isMobile = false) =>
    Array.from({ length: count }).map((_, index) => (
      <div key={index} className={isMobile ? MOBILE_CARD_WIDTH : ""}>
        <div
          className={`bg-gray-200 rounded-2xl animate-pulse ${
            isMobile ? "h-72" : "h-80"
          }`}
        />
      </div>
    ));

  return (
    <section className={className}>
      <div className="product-section">
        {/* Header Section */}
        <div className="product-section__header flex items-center justify-between mb-6">
          <div>
            <h2 className="product-section__title text-xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="product-section__subtitle text-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          </div>

          <Link
            href={trendingUrl}
            className="product-section__link text-sm text-pink-600 font-medium hover:text-pink-700 transition-colors flex items-center gap-1"
          >
            See all
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden">
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide snap-x -mx-4 px-4"
          >
            <div className="flex gap-3 pb-3 min-h-[300px]">
              {!mounted
                ? renderSkeletons(4, true)
                : mobileProducts.map((product) => (
                    <div
                      key={product.p._id}
                      className={`${MOBILE_CARD_WIDTH} flex-shrink-0 min-w-[160px] max-w-[180px] snap-center`}
                    >
                      <ProductCard productData={product} />
                    </div>
                  ))}
            </div>
          </div>

          {hasMoreProducts && (
            <div className="flex justify-center mt-6">
              <Link
                href={trendingUrl}
                className="px-6 py-3 bg-[#167389] text-white rounded-lg font-medium hover:bg-[#135a6b] transition-colors"
              >
                View All Trending Products
              </Link>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {!mounted
            ? renderSkeletons(MAX_INITIAL_DISPLAY)
            : computedProducts
                .slice(0, MAX_INITIAL_DISPLAY)
                .map((product) => (
                  <ProductCard key={product.p._id} productData={product} />
                ))}
        </div>

        {/* Desktop View More */}
        {mounted && computedProducts.length > MAX_INITIAL_DISPLAY && (
          <div className="hidden lg:flex justify-center mt-8">
            <Link
              href={trendingUrl}
              className="px-8 py-3 bg-gradient-to-r from-[#167389] to-[#135a6b] text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              View More Trending Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
