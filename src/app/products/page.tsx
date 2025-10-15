// app/products/page.tsx
import { fetchProducts } from "@/services/catalog";
import ProductCardCompact from "@/components/ProductCardCompact";

export const revalidate = 30;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; q?: string };
}) {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const { data, pageInfo } = await fetchProducts({
    page,
    limit: 24,
    category: searchParams.category,
    q: searchParams.q,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">All Products</h1>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((p) => (
          <ProductCardCompact key={p._id} p={p} />
        ))}
      </div>
      {pageInfo?.hasNext && (
        <div className="mt-6 flex justify-center">
          <a
            href={`/products?${new URLSearchParams({ page: String((pageInfo.page ?? 1) + 1) }).toString()}`}
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
          >
            Load more
          </a>
        </div>
      )}
    </div>
  );
}
