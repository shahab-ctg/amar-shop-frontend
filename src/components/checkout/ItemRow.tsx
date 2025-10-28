"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const toNum = (v: unknown, f = 0) =>
  Number.isFinite(Number(v)) ? Number(v) : f;
const getStock = (it: unknown): number => {
  const item = it as { stock?: number };
  const s = toNum(item?.stock, NaN);
  return Number.isFinite(s) ? s : Infinity;
};
const money = (n: number) => `৳${toNum(n).toFixed(2)}`;

export default React.memo(function ItemRow({
  item,
}: {
  item: {
    _id: string;
    title?: string;
    price?: number;
    quantity?: number;
    stock?: number;
    image?: string;
  };
}) {
  const price = toNum(item?.price);
  const qty = Math.max(1, toNum(item?.quantity, 1));
  const stock = getStock(item);
  const outOfStock = stock === 0;
  const atMax = qty >= stock;
  const lineTotal = price * qty;

  const update = useCartStore.getState();

  return (
    <motion.div className="flex items-center gap-3 p-3 bg-[#F5FDF8] rounded-xl border border-pink-100">
      <div className="w-14 h-14 relative flex-shrink-0 rounded-lg bg-pink-100 overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title ?? "Product"}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-pink-400">
            💄
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-800 text-sm truncate mb-1">
          {item.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => update.updateQuantity(item._id, qty - 1)}
            disabled={qty <= 1}
            className="w-6 h-6 flex items-center justify-center rounded bg-pink-100"
          >
            <Minus className="w-3 h-3 text-pink-700" />
          </button>
          <span className="text-xs text-gray-600">{qty}</span>
          <button
            onClick={() => update.updateQuantity(item._id, qty + 1)}
            disabled={atMax}
            className="w-6 h-6 flex items-center justify-center rounded bg-pink-100"
          >
            <Plus className="w-3 h-3 text-pink-700" />
          </button>
        </div>
      </div>
      <div className="font-bold text-pink-600">{money(lineTotal)}</div>
    </motion.div>
  );
});
