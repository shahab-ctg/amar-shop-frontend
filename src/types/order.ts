// ---------------------------------------------------
//  Order Types (Frontend + Backend Aligned)
// ---------------------------------------------------

export type OrderStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "IN_SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

//  Customer info structure (matches backend Zod schema)
export type OrderCustomer = {
  name: string;
 
  phone: string;
  houseOrVillage: string;
  roadOrPostOffice: string;
  blockOrThana: string;
  district: string;
};

//  Individual line item in an order
export type OrderLine = {
  productId: string;
  title: string;
  image?: string;
  price: number;
  qty: number;
};

//  Core order model (shared by backend + frontend)
export type Order = {
  _id: string;
  customer: OrderCustomer;
  lines: OrderLine[];
  totals: {
    subTotal: number;
    shipping: number;
    grandTotal: number;
  };
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string; 
};

// ---------------------------------------------------
// 📨 API DTOs (Data Transfer Objects)
// ---------------------------------------------------

//  Client → Backend
export type CreateOrderDTO = {
  customer: OrderCustomer;
  lines: { productId: string; qty: number }[];
};

//  Backend → Client (after create)
export type OrderCreateResult = {
  id: string;
  totals: {
    subTotal: number;
    shipping: number;
    grandTotal: number;
  };
  status: OrderStatus;
};

//  Common API wrappers
export type ApiOk<T> = { ok: true; data: T };

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasNext?: boolean;
};
