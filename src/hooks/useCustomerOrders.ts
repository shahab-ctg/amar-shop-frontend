// hooks/useCustomerOrders.ts
import { useState, useEffect } from "react";
import type { Order } from "@/types/order";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function useCustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const phone =
      typeof window !== "undefined"
        ? localStorage.getItem("customer_phone")
        : null;

    if (!phone) {
      setIsLoading(false);
      setOrders([]);
      setError(null);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(
          `${API}/customer/orders?phone=${encodeURIComponent(phone!)}`,
          { credentials: "include", cache: "no-store" }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false)
          throw new Error(data?.message || "Failed to fetch orders");

        setOrders(Array.isArray(data?.data?.items) ? data.data.items : []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e?.message || "Failed to fetch orders");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { orders, isLoading, error };
}
