"use client";

import { useState, useCallback } from "react";
import { AlertCircle, Search, Sparkles, Package } from "lucide-react";
import OrderCard from "@/components/orders/OrderCard";
import { useCustomerOrders } from "@/hooks/useCustomerOrders";
import type { Order, OrderStatus } from "@/types/order";
import Link from "next/link";

/**
 * IMPORTANT:
 * This UI expects a public backend endpoint:
 * GET  /api/v1/invoices/by-order/:orderId
 * which returns invoice doc or 404 if none. The invoice doc should include:
 * { _id, invoiceNumber, pdfUrl?, guestToken? }
 *
 * If you don't have that endpoint yet, add it in backend (I provided snippet below).
 */

export default function MyOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const { orders, isLoading, error } = useCustomerOrders();

  // local state for invoice checks keyed by orderId
  const [invoiceCache, setInvoiceCache] = useState<Record<string, any | null>>(
    {}
  );
  const [loadingInvoice, setLoadingInvoice] = useState<Record<string, boolean>>(
    {}
  );

  const fetchInvoiceForOrder = useCallback(
    async (orderId: string) => {
      // avoid duplicate requests
      if (invoiceCache[orderId] !== undefined) return invoiceCache[orderId];
      setLoadingInvoice((s) => ({ ...s, [orderId]: true }));
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/invoices/by-order/${orderId}`
        );
        if (res.status === 404) {
          setInvoiceCache((s) => ({ ...s, [orderId]: null }));
          return null;
        }
        if (!res.ok) {
          throw new Error(`Server ${res.status}`);
        }
        const invoice = await res.json();
        setInvoiceCache((s) => ({ ...s, [orderId]: invoice }));
        return invoice;
      } catch (err) {
        console.error("fetchInvoiceForOrder", err);
        setInvoiceCache((s) => ({ ...s, [orderId]: null })); // mark as none to avoid retry storm
        return null;
      } finally {
        setLoadingInvoice((s) => ({ ...s, [orderId]: false }));
      }
    },
    [invoiceCache]
  );

  const handleOpenInvoice = async (order: Order) => {
    const invoice = await fetchInvoiceForOrder(order._id);
    if (!invoice) {
      alert(
        "No invoice found for this order. Please contact support if you need one."
      );
      return;
    }
    // Prefer direct PDF if available
    if (invoice.pdfUrl) {
      window.open(invoice.pdfUrl, "_blank");
      return;
    }
    // Otherwise if guestToken available open public guest view
    if (invoice.guestToken) {
      const guestUrl = `${process.env.NEXT_PUBLIC_APP_ORIGIN || ""}/invoices/guest/${invoice.guestToken}`;
      window.open(guestUrl, "_blank");
      return;
    }
    alert("Invoice exists but PDF is not ready yet. Please try again later.");
  };

  // Filtering
  const filteredOrders =
    orders?.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer?.name ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
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
                aria-label="Search orders"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as OrderStatus | "")
              }
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#167389] text-gray-700"
              aria-label="Filter by status"
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
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6"
              >
                {/* Use your existing OrderCard for main content */}
                <OrderCard order={order} />

                {/* Invoice action bar */}
                <div className="mt-4 border-t pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    {order._id && (
                      <span className="font-medium">Order ID:</span>
                    )}{" "}
                    <span className="ml-1">{order._id}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Check invoice existence on demand */}
                    <button
                      onClick={() => handleOpenInvoice(order)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-[#167389] hover:bg-[#145a65] text-white rounded-lg text-sm"
                    >
                      View / Print Invoice
                    </button>

                    {/* If invoice is not present, suggest contact support */}
                    <button
                      onClick={() => {
                        // open mailto or contact page
                        const subject = encodeURIComponent(
                          `Invoice request for order ${order._id}`
                        );
                        const body = encodeURIComponent(
                          `Hello,\n\nI would like to request an invoice for my order ${order._id}.\n\nThank you.`
                        );
                        window.location.href = `mailto:support@yourshop.com?subject=${subject}&body=${body}`;
                      }}
                      className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Request / Contact Support
                    </button>
                  </div>
                </div>
              </div>
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
