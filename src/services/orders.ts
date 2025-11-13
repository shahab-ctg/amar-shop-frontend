/* eslint-disable @typescript-eslint/no-explicit-any */
// services/orders.ts - COMPLETE FIXED VERSION
import type {
  ApiOk,
  CreateOrderDTO,
  OrderCreateResult,
  ApiErr,
} from "@/types/order";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API) throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");

type ApiResp<T> = ApiOk<T> | ApiErr;

// Helper: build human-friendly message from backend validation errors
function buildErrorMessage(e: ApiErr) {
  if (e?.errors?.length) {
    const lines = e.errors.map((x) =>
      [x.path, x.message].filter(Boolean).join(": ")
    );
    return (e.message ? e.message + " — " : "") + lines.join(" | ");
  }
  return e?.message || e?.code || "Validation failed";
}

// services/orders.ts - CHECK PAYLOAD STRUCTURE
export async function createOrder(
  payload: CreateOrderDTO
): Promise<ApiOk<OrderCreateResult>> {
  
  // ✅ ENSURE PHONE IS SAVED PROPERLY
  if (payload.customer?.phone && typeof window !== 'undefined') {
    localStorage.setItem("customer_phone", payload.customer.phone);
    console.log('💾 Saved customer phone for order tracking:', payload.customer.phone);
  }

  console.log('📦 Order payload being sent:', JSON.stringify(payload, null, 2));

  try {
    const res = await fetch(`${API}/orders`, {
      method: "POST",
      headers: { 
        "content-type": "application/json",
        "accept": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = (await res.json().catch(() => ({}))) as ApiResp<OrderCreateResult>;
      
    console.log("✅ createOrder response status:", res.status, "body:", json);

    if (!res.ok || (json as ApiErr)?.ok === false) {
      const err = json as ApiErr;
      throw Object.assign(new Error(buildErrorMessage(err)), err);
    }

    return json as ApiOk<OrderCreateResult>;
  } catch (error: any) {
    console.error('❌ Order creation failed:', error);
    throw error;
  }
}
// ✅ ADDITIONAL HELPER: Create proper payload from cart items
export function createOrderPayloadFromCart(
  cartItems: Array<{
    _id: string;
    quantity: number;
    price: number;
    title: string;
  }>,
  customerData: any,
  totals?: { subTotal: number; shipping: number; grandTotal: number }
): CreateOrderDTO {
  const items = cartItems.map((item) => ({
    _id: String(item._id),
    quantity: Math.max(1, Number(item.quantity || 1)),
  }));

  const calculatedTotals = totals || {
    subTotal: cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    shipping: 0,
    grandTotal: cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
  };

  return {
    items,
    customer: {
      name: customerData.name || "Guest",
      phone: customerData.phone || "",
      houseOrVillage: customerData.houseOrVillage || "",
      roadOrPostOffice: customerData.roadOrPostOffice || "",
      blockOrThana: customerData.blockOrThana || "",
      district: customerData.district || "",
    },
    totals: calculatedTotals,
    payment: {},
    notes: "Order from website",
  };
}
