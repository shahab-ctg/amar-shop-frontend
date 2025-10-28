"use client";

import CategoriesScroll from "@/components/home/CategoriesScroll";
import {
  BannerCarousel,
  PromoCard,
  DesktopSidebar,
  MobileCategories,
  ProductSection,
} from "../components";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "@/services/catalog.api";

export default function HomePage() {
  const { data: catRes, isLoading: catLoading } = useGetCategoriesQuery();
  const { data: hotRes, isLoading: hotLoading } = useGetProductsQuery({
    discounted: "true",
    limit: 12,
  });
  const { data: newRes, isLoading: newLoading } = useGetProductsQuery({
    limit: 12,
  });
  const { data: pickRes, isLoading: pickLoading } = useGetProductsQuery({
    limit: 12,
  });

  const loading = catLoading || hotLoading || newLoading || pickLoading;

  const categories = catRes?.data || [];
  const hotDeals = hotRes?.data?.slice(0, 8) || [];
  const newArrivals = newRes?.data?.slice(0, 8) || [];
  const editorsPicks = pickRes?.data?.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto lg:px-5 py-3 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-3">
        {/* Left sidebar */}
        <DesktopSidebar categories={categories} loading={loading} />

        {/* Main content */}
        <main className="space-y-4 lg:space-y-5 overflow-hidden">
          {/* ===== Banner + Promo (Desktop + Mobile) ===== */}
          <div className="w-full">
            {/* Large screen layout */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_220px] gap-2 lg:h-[380px]">
              <div className="h-full">
                <BannerCarousel />
              </div>
              <div className="flex flex-col gap-2 h-full">
                <PromoCard
                  href="/products?category=surgical"
                  className="flex-1"
                />
                <PromoCard href="/products" className="flex-1" />
              </div>
            </div>

            {/* Small screen layout */}
            <div className="lg:hidden flex flex-col gap-2">
              <div className="w-full">
                <BannerCarousel />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <PromoCard href="/products?category=surgical" />
                <PromoCard href="/products" />
              </div>
            </div>
          </div>

          {/* ===== Categories ===== */}
          {!loading && (
            <>
              <MobileCategories categories={categories} />
              <div className="hidden lg:block">
                <CategoriesScroll categories={categories} />
              </div>
            </>
          )}

          {/* ===== Product Sections ===== */}
          <ProductSection
            title="🔥 Hot Deals"
            subtitle="Limited time beauty steals"
            href="/search?discounted=true"
            products={hotDeals}
            loading={loading}
          />
          <ProductSection
            title="✨ New Arrivals"
            subtitle="Fresh drops in makeup & skincare"
            href="/search?sort=new"
            products={newArrivals}
            loading={loading}
          />
          <ProductSection
            title="💎 Editor's Picks"
            subtitle="Curated by our beauty editors"
            href="/search?tag=featured"
            products={editorsPicks}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
}
