// app/checkout/page.tsx
"use client";
import { useCart } from "@/context/cart";
import { useState } from "react";

export default function CheckoutPage() {
  const { lines, subTotal } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const onSubmit = () => {
    // backend-এ POST /orders নেই — তাই এখন placeholder
    alert("Order placement coming soon. For now call the hotline.");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="text-xl font-bold">Your Info</h2>
        <div className="mt-3 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border px-4 py-2"
            placeholder="Full name"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border px-4 py-2"
            placeholder="Phone"
          />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border px-4 py-2"
            placeholder="Address"
          ></textarea>
        </div>
        <button
          onClick={onSubmit}
          className="mt-4 w-full rounded-xl border px-4 py-2 hover:bg-gray-50"
        >
          Place Order (Coming soon)
        </button>
        <a
          href="tel:+8801700000000"
          className="mt-2 block text-center underline"
        >
          Or Call to order
        </a>
      </div>

      <div>
        <h2 className="text-xl font-bold">Cart Summary</h2>
        <div className="mt-3 space-y-2">
          {lines.map((l) => (
            <div
              key={l.product._id}
              className="flex items-center justify-between rounded-xl border p-3"
            >
              <div className="text-sm">
                {l.product.title} × {l.qty}
              </div>
              <div className="font-semibold">৳{l.product.price * l.qty}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg">Total</div>
          <div className="text-xl font-bold">৳{subTotal}</div>
        </div>
      </div>
    </div>
  );
}
