/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchCategories, fetchProducts, ProductsQuery } from "./catalog"; 
import type { Product, Category } from "@/lib/schemas";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  }),
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
    }),

    getProducts: builder.query<{ data: Product[] }, Record<string, any> | void>(
      {
        async queryFn(arg = {}, _api, _extra, _baseQuery) {
          try {
            const res = await fetchProducts(arg as ProductsQuery);
            return { data: { data: res.data } };
          } catch (error) {
            return { error: { status: 500, data: error } as any };
          }
        },
      }
    ),
  }),
});

export const { useGetCategoriesQuery, useGetProductsQuery } = catalogApi;
