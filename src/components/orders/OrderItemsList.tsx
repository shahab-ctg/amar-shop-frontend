"use client";

import { Package } from "lucide-react";
import Image from "next/image";
import type { Order } from "@/types/order";

export default function OrderItemsList({ order }: { order: Order }) {
  return (
    <div>
      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
        <Package className="w-5 h-5 text-[#167389]" />
        Order Items
      </h4>
      <div className="space-y-4">
        {order.lines.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow"
          >
            {item.image ? (
              <div className="relative flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-pink-200"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#167389] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {item.qty}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 border border-pink-200 flex items-center justify-center flex-shrink-0">
                <Package className="w-8 h-8 text-pink-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h5 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 line-clamp-2">
                {item.title}
              </h5>
              <p className="text-gray-600 text-sm sm:text-base">
                ${item.price.toFixed(2)} × {item.qty}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                ${(item.price * item.qty).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
