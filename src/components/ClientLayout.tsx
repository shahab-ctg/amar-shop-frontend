"use client";
import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import Footer from "./Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-[#F5FDF8]" />
        <div className="relative z-10">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[#F5FDF8]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 -left-10 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl animate-float" />
        <div className="absolute top-12 -right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-float animation-delay-600" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl animate-float animation-delay-1000" />
      </div>

      <div className="relative z-10">
        <Topbar />
        <main className="container mx-auto sm:px-4 lg:px-0 pb-4 bg-[#F5FDF8] lg:pt-2 pt-10">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
