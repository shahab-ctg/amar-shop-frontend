// src/app/products/page.tsx
import CategoryView from "@/components/category/CategoryView";
import { fetchProducts, fetchCategories } from "@/services/catalog";
import ProductCard from "@/components/ProductCard";
import type { Product, Category } from "@/types";
import { Grid3x3, Search } from "lucide-react";
import Link from "next/link";

export const revalidate = 30;

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // ✅ Await searchParams for dynamic API
  const params = await searchParams;
  const { category, q } = params;

  // ✅ যদি ?category=... থাকে (এবং q না থাকে) → একই Category UI
  if (category && !q) {
    return <CategoryView slug={decodeURIComponent(category)} />;
  }

  // ✅ All products (limit ≤ 60)
  const [productsRes, categoriesRes] = await Promise.all([
    fetchProducts({
      limit: 60,
      category: category,
      q: q,
    }),
    fetchCategories(),
  ]);

  const products: Product[] = productsRes.data ?? [];
  const categories: Category[] = categoriesRes.data ?? [];

  const activeCategory = categories.find((c) => c.slug === category);

  // Empty state
  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <Search className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              No products found
            </h2>
            <p className="text-gray-600 mb-8">
              {q
                ? `No results found for "${q}"`
                : "New organic products will be added soon"}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors shadow-lg"
            >
              View all products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 rounded-xl">
              <Grid3x3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {activeCategory?.title || "All Products"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {products.length} fresh organic products
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {products.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
