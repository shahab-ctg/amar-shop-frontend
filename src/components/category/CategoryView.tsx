// frontend/src/components/category/CategoryView.tsx
import React from "react";
import Image from "next/image";
import CategoryHeroSlider from "./CategoryHeroSlider";
import CategoryProducts from "./CategoryProducts";
import {
  fetchProducts,
  fetchCategories,
  fetchBanners,
} from "@/services/catalog";
import type { Product, Category } from "@/types";
import { Grid3x3 } from "lucide-react";

export const revalidate = 30;

interface CategoryViewProps {
  slug: string;
}

export default async function CategoryView({ slug }: CategoryViewProps) {
  // fetch category details and first batch in parallel
  const [categoriesRes, productsRes, bannersRes] = await Promise.all([
    fetchCategories().catch(() => ({ ok: true, data: [] as Category[] })),
    fetchProducts({ category: slug, limit: 8 }).catch(() => ({
      ok: true,
      data: [] as Product[],
    })),
    // fetchBanners in your services/catalog should accept category filter if supported
    fetchBanners?.({
      position: "hero",
      status: "ACTIVE",
      limit: 6,
      category: slug,
    })?.catch?.(() => ({ ok: true, data: [] })) ??
      Promise.resolve({ ok: true, data: [] }),
  ]);

  const categories: Category[] =
    (categoriesRes && (categoriesRes as any).data) || [];
  const initialProducts: Product[] =
    (productsRes && (productsRes as any).data) || [];
  const banners = (bannersRes && (bannersRes as any).data) || [];

  const activeCategory = categories.find((c) => c.slug === slug);
  const title =
    activeCategory?.title ?? activeCategory?.name ?? decodeURIComponent(slug);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 xs:px-5 sm:px-6 lg:px-8 py-8 md:py-12 pt-20 space-y-6">
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#167389] text-white rounded-xl">
              <Grid3x3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 truncate">
                {title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Showing {initialProducts.length} of latest products
              </p>
            </div>
          </div>
        </div>

        {/* Hero slider */}
        <section>
          {/* pass banners array as prop to client slider */}
          <CategoryHeroSlider banners={banners} />
        </section>

        {/* Products grid (client-managed pagination) */}
        <section>
          <CategoryProducts
            initialProducts={initialProducts}
            categorySlug={slug}
          />
        </section>
      </div>
    </div>
  );
}
