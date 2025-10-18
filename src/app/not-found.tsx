import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          পৃষ্ঠাটি পাওয়া যায়নি
        </h2>
        <p className="text-gray-600 mb-8">
          আপনি যে পৃষ্ঠাটি খুঁজছেন তা存在 নেই।
        </p>
        <Link
          href="/"
          className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
        >
          হোমপেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
