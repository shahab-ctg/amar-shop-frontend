"use client";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/lib/schemas";
import { memo } from "react";

const FALLBACK = "/fallback.webp";

function ProductSectionBase({
  title,
  subtitle,
  href,
  products,
  loading,
}: {
  title: string;
  subtitle?: string;
  href: string;
  products: Product[];
  loading: boolean;
}) {
  const pickImage = (p: Product) => p.image || p.images?.[0] || FALLBACK;

  return (
    <section className="product-section">
      <div className="product-section__header">
        <div>
          <h2 className="product-section__title">{title}</h2>
          {subtitle && <p className="product-section__subtitle">{subtitle}</p>}
        </div>
        <Link href={href} className="product-section__link">
          View more <ChevronRight size={16} />
        </Link>
      </div>
      <div className="product-section__grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-section__skeleton" />
            ))
          : products.map((p) => (
              <Link
                key={p._id}
                href={`/products/${p.slug}`}
                className="product-card"
              >
                <div className="product-card__image">
                  <Image
                    src={pickImage(p)}
                    alt={p.title}
                    fill
                    className="product-card__img"
                  />
                </div>
                <div className="product-card__content">
                  <div className="product-card__title">{p.title}</div>
                  <div className="product-card__price-group">
                    <div className="product-card__price">
                      ${Number(p.price || 0).toFixed(0)}
                    </div>
                    {p.compareAtPrice && p.compareAtPrice > (p.price || 0) && (
                      <div className="product-card__compare-price">
                        ${p.compareAtPrice}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
export const ProductSection = memo(ProductSectionBase);
