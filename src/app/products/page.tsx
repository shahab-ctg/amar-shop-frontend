
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

  const params = await searchParams;
  const { category, q } = params;

  if (category && !q) {
    return <CategoryView slug={decodeURIComponent(category)} />;
  }

  // All products (limit ≤ 60)
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
      <div className="min-h-[60vh] bg-gradient-to-b from[#F5FDF8] to-[#F5FDF8]">
        <div className="mx-auto max-w-7xl px-4 xs:px-5 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-200 rounded-full mb-5 sm:mb-6">
              <Search className="w-10 h-10 text-[#167389]" aria-hidden="true" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2.5 sm:mb-3">
              No products found
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8">
              {q
                ? `No results found for "${q}"`
                : "New organic products will be added soon"}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#167389] text-white px-6 sm:px-7 py-3 rounded-full hover:bg-green-700 transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label="View all products"
            >
              View all products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-white">
      <div className="mx-auto max-w-7xl px-4 xs:px-5 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#167389] text-white rounded-xl">
              <Grid3x3 className="w-6 h-6 bg-[]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 truncate">
                {activeCategory?.title || "All Products"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {products.length} fresh original products
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6"
          aria-label="Products"
        >
          {products.map((product) => (
            <div key={product._id} className="min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------- Optional type-only fix (চাইলে নিন) --------
interface ProductsPageProps { searchParams: { category?: string; q?: string }; }
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, q } = searchParams;
  ...
}
------------------------------------------------------ */
