import { useState, useEffect } from "react";
import { Order } from "@/types/order";

export function useCustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomerOrders() {
      try {
        setIsLoading(true);
        setError(null);

        // This would typically fetch orders for the logged-in customer
        // For now, we'll use a mock API call
        const response = await fetch(
          "http://localhost:5000/api/v1/customer/orders",
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
