
export type Category = {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  status: "ACTIVE" | "HIDDEN";
};

export type Product = {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  price: number;
  compareAtPrice?: number;
  isDiscounted?: boolean;
  stock?: number;
  categorySlug?: string;
  tagSlugs?: string[];
  status: "ACTIVE" | "DRAFT" | "HIDDEN";
};

export type Paginated<T> = {
  ok: boolean;
  data: T[];
  pageInfo?: { page: number; limit: number; total?: number; hasNext?: boolean };
};
