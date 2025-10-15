// app/cart/page.tsx
"use client";
import { useCart } from "@/context/cart";
import Image from "next/image";

export default function CartPage() {
  const { lines, setQty, remove, subTotal, clear } = useCart();
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      <div className="mt-4 space-y-3">
        {lines.map((l) => (
          <div
            key={l.product._id}
            className="rounded-xl border p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Image
                src={l.product.image || "https://via.placeholder.com/80"}
                className="h-16 w-16 object-cover rounded-lg"
              />
              <div>
                <div className="font-medium">{l.product.title}</div>
                <div className="text-sm text-gray-600">
                  ৳{l.product.price} × {l.qty}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 rounded border"
                onClick={() => setQty(l.product._id, l.qty - 1)}
              >
                -
              </button>
              <div className="w-10 text-center">{l.qty}</div>
              <button
                className="h-8 w-8 rounded border"
                onClick={() => setQty(l.product._id, l.qty + 1)}
              >
                +
              </button>
              <button
                className="ml-3 text-sm underline"
                onClick={() => remove(l.product._id)}
              >
                remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg">Subtotal</div>
        <div className="text-xl font-bold">৳{subTotal}</div>
      </div>

      <div className="mt-4 flex gap-3">
        <button className="rounded-xl border px-4 py-2" onClick={clear}>
          Clear
        </button>
        <a href="/checkout" className="rounded-xl border px-4 py-2">
          Checkout
        </a>
      </div>
    </div>
  );
}
