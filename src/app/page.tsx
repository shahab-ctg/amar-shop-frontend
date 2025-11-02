"use client";

import CategoriesScroll from "@/components/home/CategoriesScroll";
import MobileCategoriesGrid from "@/components/home/MobileCategoriesGrid";
import {
  // BannerCarousel,
  PromoCard,
  DesktopSidebar,
  ProductSection,
} from "../components";
import {
  useGetCategoriesQuery,
  // useGetHeroBannersQuery,
  useGetProductsQuery,
} from "@/services/catalog.api";
import ErrorBoundary from "@/components/home/ErrorBoundary";
import { useState, useEffect } from "react"; 

import HeroBannerClient from "@/components/home/HeroBannerClient";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false); 

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const isMobile = useIsMobile();

  //  const { data: heroBanners = [] } = useGetHeroBannersQuery(6);

  const loading = catLoading || hotLoading || newLoading || pickLoading;

  const categories = catRes?.data || [];
  const hotDeals = hotRes?.data?.slice(0, 8) || [];
  const newArrivals = newRes?.data?.slice(0, 8) || [];
  const editorsPicks = pickRes?.data?.slice(0, 8) || [];

  
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto lg:px-5 py-3 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-3">
          {/* Loading skeleton */}
          <div className="hidden lg:block">
            <div className="desktop-sidebar h-full">
              <div className="desktop-sidebar__header">Categories</div>
              <div className="desktop-sidebar__content">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="desktop-sidebar__skeleton" />
                ))}
              </div>
            </div>
          </div>
          <main className="space-y-4 lg:space-y-5">
            {/* Loading state for product sections */}
            {[1, 2, 3].map((i) => (
              <section key={i} className="product-section">
                <div className="product-section__header">
                  <div>
                    <h2 className="product-section__title">Loading...</h2>
                  </div>
                </div>
                <div className="product-section__grid">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div key={j} className="product-section__skeleton" />
                  ))}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto lg:px-5 py-3 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-3">
        {/* Left sidebar */}
        <div className="hidden lg:block">
          <ErrorBoundary>
            <DesktopSidebar categories={categories} loading={loading} />
          </ErrorBoundary>
        </div>

        {/* Main content */}
        <main className="space-y-4 lg:space-y-5 overflow-hidden">
          {/* ===== Banner + Promo (Desktop + Mobile) ===== */}
          <div className="w-full">
            {/* Large screen layout */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_220px] gap-2 lg:h-[380px]">
              <div className="h-full">
                <HeroBannerClient limit={6} heightClass="h-full" />
              </div>
              <div className="flex flex-col gap-2 h-full">
                <PromoCard
                  href="/products?category=surgical"
                  className="flex-1"
                />
                <PromoCard
                  href="/products?category=medicine"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Small screen layout */}
            <div className="lg:hidden flex flex-col gap-2">
              <div className="w-full">
                <HeroBannerClient
                  limit={6}
                  heightClass="h-[160px] sm:h-[280px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <PromoCard href="/products?category=surgical" />
                <PromoCard href="/products?category=medicine" />
              </div>
            </div>
          </div>

          {!loading && (
            <>
              {isMobile ? (
                <MobileCategoriesGrid
                  categories={categories}
                  loading={loading}
                />
              ) : (
                <CategoriesScroll categories={categories} />
              )}
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
