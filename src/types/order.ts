export type OrderStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "IN_SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type OrderLine = {
  productId: string;
  title: string;
  image?: string;
  price: number;
  qty: number;
};

export type Order = {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    area: string;
  };
  lines: OrderLine[];
  totals: { subTotal: number; shipping: number; grandTotal: number };
  status: OrderStatus;
  createdAt?: string;
  updatedAT?: string;
};

// Create (Frontend -> Backend)
export type CreateOrderDTO = {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    area: string;
  };
  lines: { productId: string; qty: number }[];
};

// Create response (Backend -> Frontend)
export type OrderCreateResult = {
  id: string;
  totals: { subTotal: number; shipping: number; grandTotal: number };
  status: OrderStatus;
};

// Common wrappers
export type ApiOk<T> = { ok: true; data: T };
export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasNext?: boolean;
};
