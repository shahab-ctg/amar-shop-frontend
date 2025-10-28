"use client";

import { useState } from "react";
import { AlertCircle, Search, Sparkles, Package } from "lucide-react";
import OrderCard from "@/components/orders/OrderCard";
import { useCustomerOrders } from "@/hooks/useCustomerOrders";
import type { Order, OrderStatus } from "@/types/order";

export default function MyOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  const { orders, isLoading, error } = useCustomerOrders();

  const filteredOrders =
    orders?.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#167389] border-t-transparent rounded-full" />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <p className="text-gray-700">Failed to load orders. Try again later.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-[#167389] rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#167389]">
              My Orders
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
            Track your Cosmetics and Surgical product orders easily
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#167389] focus:border-[#167389] text-gray-700"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as OrderStatus | "")
              }
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#167389] text-gray-700"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">Processing</option>
              <option value="IN_SHIPPING">Shipping</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order: Order) => (
              <OrderCard key={order._id} order={order} />
            ))
          ) : (
            <div className="text-center py-20">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-600">
                You haven’t placed any orders yet. Start shopping!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
