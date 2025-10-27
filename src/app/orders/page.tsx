"use client";

import { useState } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
  Search,
  Calendar,
  DollarSign,
  ShoppingBag,
  Sparkles,
  Heart,
  Eye,
  EyeOff,
} from "lucide-react";
import { useCustomerOrders } from "@/hooks/useCustomerOrders";
import { Order, OrderStatus } from "@/types/order";
import Image from "next/image";

/** Date formatting with safe handling */
const formatDate = (iso?: string) => {
  if (!iso) return "Date not available";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** Status configuration - Beauty theme colors */
const STATUS_CONFIG: Record<
  OrderStatus,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { label: string; color: string; bgColor: string; icon: any; gradient: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-800",
    bgColor: "bg-amber-50 border-amber-200",
    icon: Clock,
    gradient: "from-amber-400 to-amber-500",
  },
  IN_PROGRESS: {
    label: "Processing",
    color: "text-blue-800",
    bgColor: "bg-blue-50 border-blue-200",
    icon: AlertCircle,
    gradient: "from-blue-400 to-blue-500",
  },
  IN_SHIPPING: {
    label: "Shipping",
    color: "text-indigo-800",
    bgColor: "bg-indigo-50 border-indigo-200",
    icon: Truck,
    gradient: "from-indigo-400 to-indigo-500",
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-emerald-800",
    bgColor: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle,
    gradient: "from-emerald-400 to-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rose-800",
    bgColor: "bg-rose-50 border-rose-200",
    icon: XCircle,
    gradient: "from-rose-400 to-rose-500",
  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border ${config.bgColor} ${config.color} shadow-sm`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-semibold whitespace-nowrap">
        {config.label}
      </span>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-95">
      {/* Order Header */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col xs:flex-row xs:items-center gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-[#167389] to-[#167389]rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 truncate">
                  Order #{order._id.slice(-8)}
                </h3>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-black flex-shrink-0" />
                <span className="font-medium truncate">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                <ShoppingBag className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span className="font-medium">
                  {order.lines.length} item{order.lines.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                <DollarSign className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span className="font-medium">${order.totals.subTotal}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                <Truck className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span className="font-medium">
                  Shipping: ${order.totals.shipping}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 lg:gap-2">
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#167389] to-[#167389] bg-clip-text text-transparent">
                ${order.totals.grandTotal}
              </div>
              <p className="text-sm text-gray-600 mt-1">Total Amount</p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#167389] to-[#167389] text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {expanded ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="hidden sm:inline">Hide Details</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View Details</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="border-t border-pink-100 p-4 sm:p-6 bg-gradient-to-br from-pink-50/50 to-rose-50/50">
          {/* Customer Information */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-pink-500" />
              Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                <span className="text-gray-600 font-medium">Name:</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {order.customer.name}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                <span className="text-gray-600 font-medium">Phone:</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {order.customer.phone}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                <span className="text-gray-600 font-medium">Area:</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {order.customer.area}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                <span className="text-gray-600 font-medium">Address:</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {order.customer.address}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
              <ShoppingBag className="w-5 h-5 text-[#167389]" />
              Order Items
            </h4>
            <div className="space-y-4">
              {order.lines.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  {item.image ? (
                    <div className="relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-pink-200"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#167389] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {item.qty}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 border border-pink-200 flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-pink-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 line-clamp-2">
                      {item.title}
                    </h5>
                    <p className="text-gray-600 text-sm sm:text-base">
                      ${item.price.toFixed(2)} × {item.qty}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-4 border-t border-pink-200">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-gray-900">Grand Total:</span>
              <span className="text-2xl sm:text-3xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                ${order.totals.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  const { orders, isLoading, error } = useCustomerOrders();

  // Filter orders based on search and status
  const filteredOrders =
    orders?.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#167389]mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 font-medium">
              Loading your orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="bg-white rounded-2xl border border-rose-200 shadow-lg p-6 sm:p-8 text-center">
            <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#167389] mb-3">
              Failed to Load Orders
            </h3>
            <p className="text-[#167389] text-lg mb-6">
              We could not retrieve your orders. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-[#167389]] to-[#167389] rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-#167389 to-[#167389] bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
            Track your Cosmetics and Surgical product orders in one place
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-700 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-lg border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/50 backdrop-blur-sm text-pink-700"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as OrderStatus | "")
              }
              className="px-4 py-3.5 text-lg border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/50 backdrop-blur-sm text-[#167389]"
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

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))
          ) : (
            <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-pink-100 shadow-lg">
              <Package className="w-20 h-20 text-pink-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Orders Found
              </h3>
              <p className="text-lg text-gray-700 mb-6 max-w-md mx-auto">
                {orders?.length === 0
                  ? "You haven't placed any beauty orders yet. Start shopping to see your orders here!"
                  : "No orders match your search criteria. Try adjusting your filters."}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
