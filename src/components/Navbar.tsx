// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart";

export default function Navbar() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const { items } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">
          Shodaigram
        </Link>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
          }}
          className="flex-1"
        >
          <input
            className="w-full rounded-xl border px-4 py-2"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <a
          href="tel:+8801700000000"
          className="hidden sm:inline-block rounded-xl border px-3 py-2"
        >
          Call us
        </a>
        <Link href="/cart" className="rounded-xl border px-3 py-2">
          Cart ({items})
        </Link>
      </div>
    </header>
  );
}
