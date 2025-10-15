// app/page.tsx
import Navbar from "@/components/Navbar";
import SecondaryNav from "@/components/SecondaryNav";
import HeroBanner from "@/components/HeroBanner";
import SideBanner from "@/components/SideBanner";
import ProductCard from "@/components/ProductCard";
import { fetchCategories, fetchProducts } from "@/services/catalog";

export const revalidate = 30;

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const [cats, featured, recent] = await Promise.all([
    fetchCategories(),
    fetchProducts({ discounted: "true", limit: 8 }),
    fetchProducts({ page: 1, limit: 9 }),
  ]);

  return (
    <>
      <Navbar />
      <SecondaryNav items={cats} />

      {/* Banner section: slider + side banner */}
      <section className="mx-auto max-w-6xl px-4 py-6 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <HeroBanner />
        </div>
        <SideBanner />
      </section>

      {/* Featured (discounted) */}
      <section className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured Deals</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.data.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      </section>

      {/* Recent 9 */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recently Added</h2>
          <a
            href="/products"
            className="rounded-xl border px-3 py-2 hover:bg-gray-50"
          >
            See all
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {recent.data.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 mt-10">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-bold text-lg">Shodaigram</h3>
            <p className="text-gray-600 mt-2">Local • Fresh • Trusted</p>
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="text-gray-600 mt-2">Address line…</p>
            <p className="text-gray-600">Phone: +8801700000000</p>
          </div>
          <div>
            <h4 className="font-semibold">Social</h4>
            <div className="mt-2 flex gap-3">
              <a href="#" className="underline">
                Facebook
              </a>
              <a href="#" className="underline">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
