
"use client";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/catalog";
import Image from "next/image";

export default function HeroBanner() {
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const out = await fetchProducts({ discounted: "true", limit: 5 });
      setImages(
        out.data.map(
          (p) => p.image || "https://via.placeholder.com/1200x400?text=Promo"
        )
      );
    })();
  }, []);
  // খুব সিম্পল অটো-স্লাইড
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setI((v) => (v + 1) % Math.max(1, images.length)),
      3000
    );
    return () => clearInterval(t);
  }, [images.length]);

  if (!images.length) return null;
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border">
      <Image
        src={images[i]}
        alt="banner"
        className="w-full h-64 md:h-80 object-cover"
      />
    </div>
  );
}
