
"use client";

import Link from "next/link";
import { Category } from "@/lib/schemas";

type Props = {
  categories: Category[];
  title?: string;
  limit?: number;
};

export default function CategoryRail({
  categories,
  title = "Shop by Category",
  limit = 12,
}: Props) {
  const list = categories.slice(0, limit);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Link href="/category" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>

      <div className="flex gap-2 overflow-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {list.map((c) => (
          <Link
            key={c._id}
            href={`/category/${encodeURIComponent(c.slug)}`}
            className="shrink-0 rounded-md border bg-white px-4 py-3 hover:shadow-sm text-sm"
          >
            {c.title}
          </Link>
        ))}
        {list.length === 0 && (
          <div className="text-sm text-gray-500">No categories</div>
        )}
      </div>
    </section>
  );
}
