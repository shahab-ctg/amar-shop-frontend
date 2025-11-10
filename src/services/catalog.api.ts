/* eslint-disable @typescript-eslint/no-explicit-any */
/* services/catalog.api.ts */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  fetchBanners,
  fetchCategories,
  fetchProducts,
  
  type ProductsQuery,
} from "@/services/catalog"; 
import type { Product, Category } from "@/lib/schemas";
import type { Banner } from "@/types/banner";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  }),
  tagTypes: ["Product", "Category", "Banner"],
  endpoints: (builder) => ({
    getCategories: builder.query<{ data: Category[] }, void>({
      async queryFn(_arg, _api, _extra, _baseQuery) {
        try {
          const res = await fetchCategories();
          return { data: { data: res.data } };
        } catch (error) {
          return { error: { status: 500, data: error } as any };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((c) => ({
                type: "Category" as const,
                id: c._id,
              })),
              { type: "Category" as const, id: "LIST" },
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),

    // services/catalog.api.ts -> only replace getProducts builder.query with this version
    getProducts: builder.query<
  
      {
        items: Product[];
        total: number;
        page: number;
        limit: number;
        pages: number;
      },
      ProductsQuery | void
    >({
      async queryFn(arg = {}, _api, _extra, _baseQuery) {
        try {
          const res = await fetchProducts(arg as ProductsQuery);
          // fetchProducts() (our helper) returns: { ok:true, data: { items, total, page, limit, pages } } in our earlier normalizer
          const boxed =
            res && (res as any).data && typeof (res as any).data === "object"
              ? (res as any).data
              : {
                  items: Array.isArray((res as any)?.data)
                    ? (res as any).data
                    : [],
                  total: 0,
                  page: 1,
                  limit: arg?.limit ?? 20,
                  pages: 1,
                };

          // ensure fields exist
          const items = Array.isArray(boxed.items) ? boxed.items : [];
          const total = Number(boxed.total ?? items.length);
          const page = Number(boxed.page ?? arg?.page ?? 1);
          const limit = Number(boxed.limit ?? arg?.limit ?? items.length);
          const pages = Number(
            boxed.pages ??
              (limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1)
          );

          return { data: { items, total, page, limit, pages } };
        } catch (error) {
          return { error: { status: 500, data: error } as any };
        }
      },
      providesTags: (result) =>
        result && Array.isArray(result.items)
          ? [
              ...result.items.map((p: any) => ({
                type: "Product" as const,
                id: p._id,
              })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
      keepUnusedDataFor: 30,
    }),

    getHeroBanners: builder.query<Banner[], number | undefined>({
      async queryFn(limitArg, _api, _extra, _baseQuery) {
        try {
          const limit = typeof limitArg === "number" ? limitArg : 6;
          const res = await fetchBanners({
            position: "hero",
            status: "ACTIVE",
            limit,
          });
          return { data: res.data };
        } catch (error) {
          return { error: { status: 500, data: error } as any };
        }
      },
      providesTags: (result) =>
        result
          ? result.map((b) => ({ type: "Banner" as const, id: b._id }))
          : [],
      keepUnusedDataFor: 60,
    }),

    // Optional: confirmOrder mutation -> call backend to create order and decrease stock
    confirmOrder: builder.mutation<
      { ok: boolean; updatedProducts?: Array<{ _id: string; stock: number }> },
      { items: Array<{ _id: string; quantity: number }>; payment?: any }
    >({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      // After order success we invalidate product list so the UI refetches updated stock
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetHeroBannersQuery,
  useConfirmOrderMutation,
} = catalogApi;
