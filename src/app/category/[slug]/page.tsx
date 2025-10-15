
import { fetchCategories, fetchProducts } from "@/services/catalog";
import ProductCard from "@/components/ProductCard";

export const revalidate = 30;

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const [cats, prods] = await Promise.all([
    fetchCategories(),
    fetchProducts({ category: params.slug, limit: 12 }),
  ]);

  const current = cats.find((c) => c.slug === params.slug);
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">{current?.title || "Category"}</h1>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {prods.data.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <a
          href={`/products?category=${params.slug}`}
          className="rounded-xl border px-4 py-2 hover:bg-gray-50"
        >
          See all
        </a>
      </div>
    </div>
  );
}
