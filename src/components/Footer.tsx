// components/Footer.tsx
"use client";

import Link from "next/link";
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const brand = process.env.NEXT_PUBLIC_BRAND || "AmarShop";
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "01700000000";

  return (
    <footer
      role="contentinfo"
      className="bg-gradient-to-b bg-[#FFFCFD] text-black mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 py-8 sm:py-12">
          {/* Brand Column */}
          <div className="min-w-0">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#167389] to-[#167389] rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <Sparkles
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold truncate">
                  {brand}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#167389]">
                  Beauty & Cosmetics
                </p>
              </div>
            </div>
            <p className="text-black text-sm leading-relaxed mb-4 text-pretty">
              Your trusted destination for authentic beauty and cosmetics
              products. Bringing premium quality and radiant beauty to your
              doorstep.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#167389]">
              <Heart className="w-4 h-4 fill-pink-300" aria-hidden="true" />
              <span className="text-pretty">
                Beauty that inspires confidence
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-[#167389] rounded-full"></span>
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2.5 text-black">
              <li>
                <Link
                  href="https://amar-shop-admin.vercel.app/login"
                  className="hover:text-white hover:pl-2 transition-all duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded"
                  title="Products"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white hover:pl-2 transition-all duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded"
                  title="Products"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="hover:text-white hover:pl-2 transition-all duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167389] rounded"
                  title="Products"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white hover:pl-2 transition-all duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded"
                  title="Categories"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-white hover:pl-2 transition-all duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded"
                  title="Shopping Cart"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white hover:pl-2 transition-all duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded"
                  title="About Us"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6  rounded-full"></span>
              <span>Contact Us</span>
            </h4>
            <ul className="space-y-3 text-black text-sm">
              <li className="flex items-start gap-3">
                <MapPin
                  className="w-5 h-5 text-black flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="break-words">Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className="w-5 h-5 text-black flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${hotline}`}
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded"
                  title="Call hotline"
                >
                  +880 {hotline}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  className="w-5 h-5 text-black flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="mailto:support@amarshop.com"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded break-words"
                  title="Email support"
                >
                  support@amarshop.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Info */}
          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-pink-400 rounded-full"></span>
              <span>Connect With Us</span>
            </h4>
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10  rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10  rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10  rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                aria-label="Twitter"
                title="Twitter"
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                aria-label="YouTube"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>

            <div className="bg-[#167389] border border-[#167389] rounded-xl p-3.5 sm:p-4">
              <p className="text-[11px] sm:text-xs text-white mb-1.5 font-semibold">
                Customer Service
              </p>
              <p className="text-sm text-white">9 AM - 9 PM Daily</p>
              <p className="text-[11px] sm:text-xs text-white mt-1">
                Saturday - Thursday
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-black">
            <p className="text-center sm:text-left">
              © {currentYear}{" "}
              <span className="font-semibold text-[#167389]">{brand}</span>. All
              rights reserved.
            </p>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded"
                title="Privacy Policy"
              >
                Privacy Policy
              </Link>
              <span aria-hidden="true" className="text-pink-700">
                |
              </span>
              <Link
                href="/terms"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded"
                title="Terms of Service"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
