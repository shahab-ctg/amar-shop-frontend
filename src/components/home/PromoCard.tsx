"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { memo } from "react";

interface PromoCardProps {
  href: string;
}

function PromoCardBase({ href }: PromoCardProps) {
  const isSurgical = href.includes("surgical");
  return (
    <Link
      href={href}
      className={`block text-white text-center py-6 px-2 shadow-md transition rounded-lg 
        ${isSurgical ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}
      `}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <Sparkles size={26} className="text-white" />
        <h3 className="text-sm font-bold">AmarShopBD</h3>
        <p className="text-xs leading-snug">
          {isSurgical
            ? " সকল ধরনের সার্জিক্যাল পণ্য অর্ডার করতে এখানে ক্লিক করুন"
            : " সকল ধরনের মেডিক্যাল পণ্য অর্ডার করতে এখানে ক্লিক করুন"}
        </p>
      </div>
    </Link>
  );
}
export const PromoCard = memo(PromoCardBase);
