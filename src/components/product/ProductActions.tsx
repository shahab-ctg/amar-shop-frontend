"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap, Phone } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import { toast } from "react-hot-toast";

interface ProductActionsProps {
  product: Product;
  hotline: string;
}

export default function ProductActions({
  product,
  hotline,
}: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Cart store methods
  const { addItem, items } = useCartStore();

  // Check if product is already in cart
  const existingCartItem = items.find((item) => item._id === product._id);
  const isInCart = !!existingCartItem;

  // Stock validation
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const availableStock = product.stock ?? 0;
  const canIncrease = quantity < availableStock;

  // Quantity handlers
  const increaseQuantity = () => {
    if (canIncrease) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Only ${availableStock} items available in stock`);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Add to cart handler - User can add only once
  const handleAddToCart = async () => {
    if (isInCart) {
      toast.error("This product is already in your cart");
      return;
    }

    if (isOutOfStock) {
      toast.error("Sorry, this product is out of stock");
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} items available in stock`);
      return;
    }

    setIsAdding(true);

    try {
      addItem({
        _id: product._id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });

      toast.success(`Added ${quantity} item(s) to cart successfully!`);
    } catch (_error) {
      toast.error("Failed to add product to cart");
    } finally {
      setIsAdding(false);
    }
  };

  // Buy now handler
  const handleBuyNow = async () => {
    if (isInCart) {
      toast.success("Product already in cart. Redirecting to checkout...");
      setTimeout(() => router.push("/checkout"), 1000);
      return;
    }

    if (isOutOfStock) {
      toast.error("Sorry, this product is out of stock");
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} items available in stock`);
      return;
    }

    await handleAddToCart();
    setTimeout(() => router.push("/checkout"), 1000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <Minus className="w-4 h-4 text-green-700" />
          </button>

          <span className="min-w-[2rem] text-center font-semibold text-gray-800">
            {quantity}
          </span>

          <button
            onClick={increaseQuantity}
            disabled={!canIncrease}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4 text-green-700" />
          </button>
        </div>
      </div>

      {/* Stock Info */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 text-center">
          {isOutOfStock ? (
            <span className="text-red-600 font-medium">Out of stock</span>
          ) : availableStock < 10 ? (
            <span className="text-orange-600 font-medium">
              Only {availableStock} items left in stock
            </span>
          ) : (
            <span className="text-green-600 font-medium">In stock</span>
          )}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isInCart || isAdding}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed min-h-[52px]"
        >
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ShoppingCart className="w-5 h-5" />
          )}
          {isAdding
            ? "Adding..."
            : isInCart
              ? "Already in Cart"
              : "Add to Cart"}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock || isAdding}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed min-h-[52px]"
        >
          <Zap className="w-5 h-5" />
          Order Now
        </button>
      </div>

      {/* Hotline Section */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center mb-3">
          Or order by phone
        </p>
        <a
          href={`tel:${hotline}`}
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-50 border-2 border-green-200 text-green-700 font-semibold rounded-xl hover:bg-green-100 transition-all"
        >
          <Phone className="w-5 h-5" />
          Call {hotline}
        </a>
      </div>
    </div>
  );
}
