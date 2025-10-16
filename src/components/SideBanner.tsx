// components/SideBanner.tsx
import Image from "next/image";
export default function SideBanner() {
  return (
    <div className="rounded-2xl border p-3 relative w-full h-64">
      <Image
        src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format"
        alt="Side promo"
        fill
        className="object-cover rounded-xl"
      />
    </div>
  );
}
