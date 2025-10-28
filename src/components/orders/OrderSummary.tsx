"use client";

import type { Order } from "@/types/order";

export default function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="mt-6 pt-4 border-t border-pink-200">
      <div className="flex justify-between items-center text-lg font-bold">
        <span className="text-gray-900">Grand Total:</span>
        <span className="text-2xl sm:text-3xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          ${order.totals.grandTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
