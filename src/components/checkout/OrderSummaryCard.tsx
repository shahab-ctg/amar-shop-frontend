"use client";

import { ShoppingBag } from "lucide-react";
import ItemRow from "./ItemRow";
const money = (n: number) => `৳${Number(n || 0).toFixed(2)}`;

export default function OrderSummaryCard({
  items,
  subtotal,
  total,
}: {
  items: any[];
  subtotal: number;
  total: number;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-pink-100">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-pink-600" aria-hidden />
        <span>Order Summary</span>
      </h2>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {items.map((it) => (
          <ItemRow key={it._id} item={it} />
        ))}
      </div>

      <div className="mt-5 border-t border-pink-200 pt-3 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="text-pink-600 font-medium">FREE</span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2">
          <span>Total</span>
          <span className="text-pink-600">{money(total)}</span>
        </div>
      </div>
    </div>
  );
}
