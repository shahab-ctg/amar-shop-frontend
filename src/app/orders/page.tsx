// src/app/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Package, CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

// Mock data - In real app, this would come from API
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "SHODAI-2024-001",
    items: [
      {
        productId: "1",
        title: "তাজা জৈব টমেটো",
        price: 120,
        quantity: 2,
        image: "/images/tomato.jpg",
      },
      {
        productId: "2",
        title: "জৈব আলু",
        price: 40,
        quantity: 3,
        image: "/images/potato.jpg",
      },
    ],
    total: 360,
    status: "delivered",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    orderNumber: "SHODAI-2024-002",
    items: [
      {
        productId: "3",
        title: "জৈব মরিচ",
        price: 80,
        quantity: 1,
        image: "/images/chili.jpg",
      },
    ],
    total: 80,
    status: "shipped",
    createdAt: "2024-01-16T14:20:00Z",
  },
];

const statusConfig = {
  pending: {
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: Clock,
    label: "Pending",
  },
  confirmed: {
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: CheckCircle,
    label: "Confirmed",
  },
  shipped: {
    color: "text-purple-600 bg-purple-50 border-purple-200",
    icon: Truck,
    label: "Shipped",
  },
  delivered: {
    color: "text-green-600 bg-green-50 border-green-200",
    icon: CheckCircle,
    label: "Delivered",
  },
  cancelled: {
    color: "text-red-600 bg-red-50 border-red-200",
    icon: XCircle,
    label: "Cancelled",
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadOrders = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrders(mockOrders);
      setLoading(false);
    };

    loadOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">অর্ডার লোড হচ্ছে...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-lg p-12">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              কোনো অর্ডার নেই
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              আপনি এখনো কোনো অর্ডার দেননি। প্রথম অর্ডারটি দিন!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              পণ্য ব্রাউজ করুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            অর্ডার হিস্টরি
          </h1>
          <p className="text-gray-600">আপনার সকল অর্ডারের তালিকা</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="border-b border-gray-100 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        অর্ডার # {order.orderNumber}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${statusConfig[order.status].color}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig[order.status].label}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">
                          ৳{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    পণ্যসমূহ:
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-gray-400">📦</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              ৳{item.price} x {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      অর্ডার ডিটেইলস
                    </button>
                    <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium">
                      আবার অর্ডার দিন
                    </button>
                    {order.status === "delivered" && (
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                        রেটিং দিন
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination would go here in real app */}
        <div className="flex justify-center mt-8">
          <div className="bg-white rounded-xl shadow-lg px-6 py-3">
            <p className="text-gray-600 text-sm">
              Showing {orders.length} of {orders.length} orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
