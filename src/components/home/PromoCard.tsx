"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { memo } from "react";

interface PromoCardProps {
  href: string;
  className?: string;
}

function PromoCardBase({ href, className = "" }: PromoCardProps) {
  const isSurgical = href.includes("surgical");
  return (
    <Link
      href={href}
      className={` text-white text-center p-6 px-2 mx-1 shadow-md transition rounded-md flex flex-col items-center justify-center ${className}
        ${isSurgical ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}
      `}
    >
      <Sparkles size={26} className="text-white mb-1" />
      <h3 className="text-sm font-bold">Amaar Shop</h3>
      <p className="text-xs leading-snug mt-1">
        {isSurgical
          ? "সকল ধরনের সার্জিক্যাল পণ্য অর্ডার করতে এখানে ক্লিক করুন"
          : "সকল ধরনের ঔষধ অর্ডার করতে এখানে ক্লিক করুন"}
      </p>
    </Link>
  );
}
export const PromoCard = memo(PromoCardBase);
