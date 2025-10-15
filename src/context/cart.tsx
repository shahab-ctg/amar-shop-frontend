// context/cart.tsx
"use client";
import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/types";

type Line = { product: Product; qty: number };
type Ctx = {
  lines: Line[];
  add(p: Product, qty?: number): void;
  remove(id: string): void;
  setQty(id: string, qty: number): void;
  clear(): void;
  items: number;
  subTotal: number;
};
const Cart = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const add = (p: Product, qty = 1) =>
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product._id === p._id);
      if (i === -1) return [...prev, { product: p, qty }];
      const cp = [...prev];
      cp[i] = { ...cp[i], qty: cp[i].qty + qty };
      return cp;
    });
  const setQty = (id: string, qty: number) =>
    setLines((prev) =>
      prev.map((l) =>
        l.product._id === id ? { ...l, qty: Math.max(1, qty) } : l
      )
    );
  const remove = (id: string) =>
    setLines((prev) => prev.filter((l) => l.product._id !== id));
  const clear = () => setLines([]);
  const items = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subTotal = useMemo(
    () => lines.reduce((s, l) => s + l.product.price * l.qty, 0),
    [lines]
  );

  return (
    <Cart.Provider
      value={{ lines, add, remove, setQty, clear, items, subTotal }}
    >
      {children}
    </Cart.Provider>
  );
}
export const useCart = () => {
  const v = useContext(Cart);
  if (!v) throw new Error("useCart inside provider");
  return v;
};
