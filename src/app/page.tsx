"use client";

import CategoriesScroll from "@/components/home/CategoriesScroll";
import MobileCategoriesGrid from "@/components/home/MobileCategoriesGrid";
import { PromoCard, DesktopSidebar, ProductSection } from "../components";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "@/services/catalog.api";
import ErrorBoundary from "@/components/home/ErrorBoundary";
import { useState, useEffect } from "react";

import HeroBannerClient from "@/components/home/HeroBannerClient";
import { useIsMobile } from "@/hooks/useIsMobile";
import TrendingGrid from "@/components/home/TrendingGrid";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();

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

  const loading = catLoading || hotLoading || newLoading || pickLoading;

  const categories = catRes?.data || [];
  const hotDeals = hotRes?.data?.slice(0, 8) || [];
  const newArrivals = newRes?.data?.slice(0, 8) || [];
  const editorsPicks = pickRes?.data?.slice(0, 8) || [];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1600px] mx-auto lg:px-5 py-3">
          <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto lg:px-5 py-3 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-3">
        {/* Left sidebar */}
        <div className="hidden lg:block">
          <ErrorBoundary>
            <DesktopSidebar categories={categories} loading={loading} />
          </ErrorBoundary>
        </div>

        {/* Main content */}
        <main className="space-y-4 lg:space-y-5">
          {/* ===== Banner + Promo ===== */}
          <div className="w-full">
            {/* Large screen layout - Banner + Promo side by side */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_220px] gap-2 lg:h-[380px]">
              {/* Banner - Takes 1fr space */}
              <div className="h-full">
                <HeroBannerClient limit={6} heightClass="h-full" />
              </div>

              {/* Promo Cards - Takes 220px space */}
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

            {/* Small screen layout - Banner at top, Promo cards below */}
            <div className="lg:hidden flex flex-col gap-4 pt-10">
              {/* Banner - Full width on mobile */}
              <div className="w-full">
                <HeroBannerClient
                  limit={6}
                  heightClass="h-[160px] sm:h-[280px]"
                />
              </div>

              {/* Promo Cards - Below banner on mobile */}
              <div className="grid grid-cols-2 gap-3">
                <PromoCard href="/products?category=surgical" />
                <PromoCard href="/products?category=medicine" />
              </div>
            </div>
          </div>

          {/* ===== Categories ===== */}
          <ErrorBoundary>
            {isMobile ? (
              <MobileCategoriesGrid categories={categories} loading={loading} />
            ) : (
              <CategoriesScroll categories={categories} />
            )}
          </ErrorBoundary>

          {/* ===== Product Sections ===== */}
          <ErrorBoundary>
            <TrendingGrid
              title="📈 Trending"
              subtitle="Choose Your Best Deals with Best price"
              products={hotDeals} 
              className="mt-2"
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <ProductSection
              title="✨ New Arrivals"
              subtitle="Fresh drops in makeup & skincare"
              href="/search?sort=new"
              products={newArrivals}
              loading={loading}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <ProductSection
              title="💎 Editor's Picks"
              subtitle="Curated by our beauty editors"
              href="/search?tag=featured"
              products={editorsPicks}
              loading={loading}
            />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
