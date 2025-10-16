// app/products/[slug]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Plus,
  Minus,
  ShoppingCart,
  Phone,
  Check,
  Truck,
  Shield,
  Leaf,
  Star,
  ArrowLeft,
  Heart,
  Share2,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { fetchProductBySlug, fetchProducts } from "@/services/catalog";
import type { Product } from "@/types";
import Link from "next/link";

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      setLoading(true);
      const p = await fetchProductBySlug(slug);
      if (!p) {
        router.push("/products");
        return;
      }
      setProduct(p);
      // Fetch related products by same category
      if (p.categorySlug) {
        const rel = await fetchProducts({ category: p.categorySlug, limit: 4 });
        setRelated(rel.data.filter((x) => x._id !== p._id));
      }
      setLoading(false);
    })();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : 0;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        _id: product._id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        image: product.image || "",
        stock: product.stock ?? 999,
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">ফিরে যান</span>
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Product Main Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-12"
        >
          {/* Image Section */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 shadow-xl">
              <Image
                src={product.image || "https://via.placeholder.com/600x600"}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg"
                >
                  -{discount}%
                </motion.div>
              )}

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Badge
                icon={<Leaf className="w-6 h-6 text-emerald-600" />}
                text="১০০% জৈব"
              />
              <Badge
                icon={<Truck className="w-6 h-6 text-blue-600" />}
                text="ফ্রি ডেলিভারি"
              />
              <Badge
                icon={<Shield className="w-6 h-6 text-purple-600" />}
                text="নিরাপদ পণ্য"
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            >
              {product.title}
            </motion.h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }
                />
              ))}
              <span className="text-gray-600">(4.0)</span>
              <span className="text-gray-400 text-sm ml-2">128 রিভিউ</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-4xl sm:text-5xl font-bold text-green-600"
              >
                ৳{product.price}
              </motion.span>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="text-2xl text-gray-400 line-through">
                    ৳{product.compareAtPrice}
                  </span>
                )}
              {discount > 0 && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {discount}% ছাড়
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {(product.stock ?? 0) > 0 ? (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-lg w-fit"
                >
                  <Check className="w-5 h-5" /> স্টকে আছে ({product.stock}টি
                  বাকি)
                </motion.p>
              ) : (
                <p className="flex items-center gap-2 text-red-600 font-semibold bg-red-50 px-4 py-2 rounded-lg w-fit">
                  স্টকে নেই
                </p>
              )}
            </div>

            {/* Description */}
            {product?.description && (
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-gray-700 leading-relaxed">
                  {product?.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                পরিমাণ নির্বাচন করুন
              </label>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl font-bold flex items-center justify-center transition-colors disabled:opacity-50"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >
                  <Minus className="w-5 h-5 text-green-700" />
                </motion.button>
                <span className="text-2xl font-bold min-w-[3rem] text-center text-gray-800">
                  {qty}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-xl font-bold flex items-center justify-center transition-colors"
                  onClick={() =>
                    setQty((q) => Math.min(q + 1, product.stock ?? 999))
                  }
                >
                  <Plus className="w-5 h-5 text-green-700" />
                </motion.button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={(product.stock ?? 0) === 0}
                className={`flex-1 flex items-center justify-center gap-3 font-bold py-4 rounded-xl border-2 transition-all ${
                  addedToCart
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" /> কার্টে যুক্ত হয়েছে
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> কার্টে যোগ করুন
                  </>
                )}
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="tel:01700000000"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Phone className="w-5 h-5" />
                এখনই অর্ডার করুন
              </motion.a>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <p className="text-sm text-gray-700 mb-2">
                <strong>হটলাইন:</strong> 01700-000000
              </p>
              <p className="text-xs text-gray-600">
                সকাল ৯টা থেকে রাত ৯টা পর্যন্ত কল করুন
              </p>
            </div>
          </div>
        </motion.div>

        {/* Product Details & Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            পণ্যের বিবরণ
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">বিস্তারিত</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  "এই পণ্যটি সম্পূর্ণ জৈব পদ্ধতিতে উৎপাদিত এবং রাসায়নিক মুক্ত। আমরা নিশ্চিত করি যে আপনার পরিবার সর্বোত্তম মানের তাজা পণ্য পাচ্ছে।"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                শোধাইগ্রাম সম্পর্কে
              </h3>
              <p className="text-gray-600 leading-relaxed">
                শোধাইগ্রাম বাংলাদেশের সবচেয়ে বিশ্বস্ত জৈব পণ্যের অনলাইন
                মার্কেট। আমরা সরাসরি কৃষকদের থেকে তাজা ও মানসম্পন্ন পণ্য সংগ্রহ
                করে আপনার দরজায় পৌঁছে দেই।
              </p>
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              সম্পর্কিত পণ্য
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((r, idx) => (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <RelatedCard p={r} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2 }}
      className="text-center"
    >
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
        {icon}
      </div>
      <p className="text-xs text-gray-700 font-medium">{text}</p>
    </motion.div>
  );
}

function RelatedCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group block bg-white rounded-2xl border-2 border-green-100 hover:border-green-300 overflow-hidden transition-all hover:shadow-lg"
    >
      <div className="relative aspect-square bg-green-50">
        <Image
          src={p.image || "https://via.placeholder.com/400x400"}
          alt={p.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium line-clamp-2 text-gray-800 mb-1">
          {p.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-green-600 font-bold">৳{p.price}</span>
          {p.compareAtPrice && p.compareAtPrice > p.price && (
            <span className="text-xs text-gray-400 line-through">
              ৳{p.compareAtPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
