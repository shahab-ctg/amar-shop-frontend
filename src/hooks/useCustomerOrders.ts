/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCustomerOrders.ts - SIMPLIFIED
import { useState, useEffect, useCallback } from "react";
import type { Order } from "@/types/order";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

interface UseCustomerOrdersResult {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  currentPhone: string | null;
}

export function useCustomerOrders(): UseCustomerOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhone, setCurrentPhone] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const phone =
        typeof window !== "undefined"
          ? localStorage.getItem("customer_phone")
          : null;

      console.log("📞 Current phone from localStorage:", phone);
      setCurrentPhone(phone);

      if (!phone) {
        console.log("ℹ️ No phone found in localStorage");
        setOrders([]);
        setError("Please place an order first to view your order history");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const url = `${API}/customer/orders?phone=${encodeURIComponent(phone)}&limit=50`;
      console.log("🔍 Fetching orders from:", url);

      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });

      console.log("📨 Response status:", res.status);

      const data = await res.json().catch(() => ({}));

      console.log("📦 API response received");

      if (!res.ok || data?.ok === false) {
        throw new Error(
          data?.message || `Failed to fetch orders: ${res.status}`
        );
      }

      // ✅ SIMPLIFIED: Backend should handle filtering
      const ordersList: Order[] = Array.isArray(data?.data?.items)
        ? data.data.items
        : [];

      console.log("✅ Orders received from backend:", ordersList.length);

      // ✅ REMOVED CLIENT-SIDE FILTERING - Backend should handle this
      setOrders(ordersList);
    } catch (e: any) {
      console.error("❌ Error fetching orders:", e);
      const errorMessage = e?.message || "Failed to load your orders";
      setError(errorMessage);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("🔄 Orders state updated:", {
      userPhone: currentPhone,
      ordersCount: orders.length,
      isLoading,
      error,
    });
  }, [orders, isLoading, error, currentPhone]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
    currentPhone,
  };
}
