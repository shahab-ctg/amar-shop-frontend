
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  discount?: string;
}

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // ✅ Demo banners - পরে API থেকে আসবে
  const banners: Banner[] = [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=500&fit=crop",
      title: "তাজা সবজি",
      subtitle: "সরাসরি খেত থেকে আপনার দরজায়",
      discount: "৩০% ছাড়",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&h=500&fit=crop",
      title: "অর্গানিক ফল",
      subtitle: "রাসায়নিক মুক্ত ১০০% প্রাকৃতিক",
      discount: "২৫% ছাড়",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&h=500&fit=crop",
      title: "দেশি মাছ",
      subtitle: "খাঁটি দেশি মাছ প্রতিদিন তাজা",
      discount: "১৫% ছাড়",
    },
  ];

  // Auto play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Main Slider */}
      <div className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative h-64 sm:h-80 lg:h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={banners[currentSlide].image}
                alt={banners[currentSlide].title}
                fill
                priority
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-white px-8 sm:px-12 max-w-2xl"
                >
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                    {banners[currentSlide].title}
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl mb-4 sm:mb-6">
                    {banners[currentSlide].subtitle}
                  </p>
                  {banners[currentSlide].discount && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="inline-block bg-yellow-400 text-emerald-900 px-6 py-3 rounded-full font-bold text-lg shadow-lg"
                    >
                      {banners[currentSlide].discount}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
        >
          <ChevronLeft className="text-emerald-600 w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
        >
          <ChevronRight className="text-emerald-600 w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                setIsAutoPlaying(false);
              }}
              className={`transition-all ${
                idx === currentSlide
                  ? "w-8 h-3 bg-white rounded-full"
                  : "w-3 h-3 bg-white/50 rounded-full hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Side Banners */}
      <div className="hidden lg:flex flex-col gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl cursor-pointer flex-1"
        >
          <h3 className="text-2xl font-bold mb-2">বিশেষ অফার!</h3>
          <p className="mb-4">প্রথম অর্ডারে ৫০% ছাড়</p>
          <button className="bg-white text-orange-600 px-5 py-2.5 rounded-full font-bold hover:bg-orange-50 transition-colors">
            কিনুন এখনই
          </button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-6 text-white shadow-xl cursor-pointer flex-1"
        >
          <h3 className="text-xl font-bold mb-2">ফ্রি ডেলিভারি</h3>
          <p className="text-sm">৫০০ টাকার উপরে অর্ডারে</p>
        </motion.div>
      </div>
    </div>
  );
}
