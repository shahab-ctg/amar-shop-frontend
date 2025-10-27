import { useState, useEffect } from "react";
import { Order } from "@/types/order";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function useCustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomerOrders() {
      try {
        setIsLoading(true);
        setError(null);

        
        const response = await fetch(
          `${API}/customer/orders`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        if (data.ok && data.data?.items) {
          setOrders(data.data.items);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomerOrders();
  }, []);

  return { orders, isLoading, error };
}
