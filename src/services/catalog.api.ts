/* services/catalog.api.ts */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  fetchBanners,
  fetchCategories,
  fetchProducts,
  fetchProduct,
  type ProductsQuery,
} from "@/services/catalog"; // <-- তোমার merged fetch file path
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

    getProducts: builder.query<{ data: Product[] }, ProductsQuery | void>({
      async queryFn(arg = {}, _api, _extra, _baseQuery) {
        try {
          const res = await fetchProducts(arg as ProductsQuery);
          return { data: { data: res.data } };
        } catch (error) {
          return { error: { status: 500, data: error } as any };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((p) => ({
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
