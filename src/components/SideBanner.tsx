import Image from "next/image";

export default function SideBanner() {
  // placeholder; চাইলে এখানে fixed promo দেখানো হবে
  return (
    <div className="rounded-2xl border p-3">
      <Image
        src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format"
        className="w-full h-64 object-cover rounded-xl"
        alt="Side promo"
      />
    </div>
  );
}
