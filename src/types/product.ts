
export type AppProduct = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  status?: "ACTIVE" | "DRAFT" | "HIDDEN";
  brand?: string;
  manufacturer?: string;
  description?: string;
  image?: string; // primary image url
  images?: string[]; // gallery
  compareAtPrice?: number;
  stock?: number;
  availableStock?: number;
  sku?: string;
  vendor?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
