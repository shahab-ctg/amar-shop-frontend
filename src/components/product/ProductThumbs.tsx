"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export default function ProductThumbs({
  images,
  title,
  mainBoxId,
}: {
  images?: string[] | null;
  title: string;
  /** main image wrapper div-এর id */
  mainBoxId: string;
}) {
  const list = useMemo(
    () => Array.from(new Set((images ?? []).filter(Boolean))),
    [images]
  );

  const [active, setActive] = useState(0);

  if (!list.length) return null;

  const swapMain = (src: string, idx: number) => {
    // Next/Image এর ভিতরের <img> টাকে ধরুন
    const img =
      document.querySelector<HTMLImageElement>(`#${mainBoxId} img`) || null;

    if (!img) return;

    // Next/Image অপ্টিমাইজড url ব্যবহার করে; srcset/sizes ক্লিয়ার করে raw src সেট করি
    try {
      img.srcset = "";
      img.sizes = "";
      img.src = src;
      // কিছু ব্রাউজারে immediate repaint এর জন্য
      img.decoding = "sync";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (img as any).fetchPriority = "high";
      setActive(idx);
    } catch {
      // fallback: কিছু না
    }
  };

  return (
    <div className="mt-3 sm:mt-4">
      <div
        className="
          grid grid-flow-col auto-cols-[22%] xs:auto-cols-[20%] sm:auto-cols-[18%] md:auto-cols-[16%] lg:auto-cols-[14%]
          gap-2 sm:gap-3 overflow-x-auto pb-1
          [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
        aria-label="Product images"
        role="listbox"
      >
        {list.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            role="option"
            aria-selected={active === i}
            onClick={() => swapMain(src, i)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition
              ${active === i ? "border-pink-500" : "border-pink-200 hover:border-pink-300"}
              focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500
            `}
            title={`View image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${title} - ${i + 1}`}
              fill
              sizes="120px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
