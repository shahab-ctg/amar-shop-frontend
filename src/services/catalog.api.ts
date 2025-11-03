/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchBanners, fetchCategories, fetchProducts, ProductsQuery } from "./catalog"; 
import type { Product, Category } from "@/lib/schemas";
import { Banner } from "@/types/banner";

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

    getHeroBanners: builder.query<Banner[], number | undefined>({
      async queryFn(limitArg, _api, _extra, _baseQuery) {
        try {
      
          const limit = typeof limitArg === "number" ? limitArg : 6;

          const res = await fetchBanners({
            position: "hero",
            status: "ACTIVE",
            limit, // এখানে limit এখন নিশ্চিতভাবেই number
          });

          return { data: res.data }; // Banner[] রিটার্ন
        } catch (error) {
          return { error: { status: 500, data: error } as any };
        }
      },
      keepUnusedDataFor: 60,
    }),
  }),
});



  
  
  


export const { useGetCategoriesQuery, useGetProductsQuery, useGetHeroBannersQuery } =
  catalogApi;
