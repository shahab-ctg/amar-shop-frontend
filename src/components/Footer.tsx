// components/Footer.tsx
"use client";

import Link from "next/link";
import {
  Leaf,
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
  const brand = process.env.NEXT_PUBLIC_BRAND || "ShodaiGram";
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "01700000000";

  return (
    <footer
      role="contentinfo"
      className="bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 text-white mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 py-8 sm:py-12">
          {/* Brand Column */}
          <div className="min-w-0">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <Leaf
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold truncate">
                  {brand}
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-300">
                  Admin Panel
                </p>
              </div>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed mb-4 text-pretty">
              Managing fresh & authentic organic products from farm to your
              doorstep. Building trust through quality.
            </p>
            <div className="flex items-center gap-2 text-sm text-emerald-300">
              <Heart className="w-4 h-4 fill-emerald-300" aria-hidden="true" />
              <span className="text-pretty">Growing organic, naturally</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-emerald-400 rounded-full"></span>
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2.5 text-emerald-200">
              <li>
                <Link
                  href="https://shodaigram-admin-panel-main.vercel.app/login"
                  className="hover:text-white hover:pl-2 transition-all duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
                  aria-label="Go to Dashboard"
                  title="Dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white hover:pl-2 transition-all duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
                  title="Products"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white hover:pl-2 transition-all duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
                  title="Categories"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="hover:text-white hover:pl-2 transition-all duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
                  title="Orders"
                >
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-emerald-400 rounded-full"></span>
              <span>Contact Us</span>
            </h4>
            <ul className="space-y-3 text-emerald-200 text-sm">
              <li className="flex items-start gap-3">
                <MapPin
                  className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="break-words">Chittagong, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className="w-5 h-5 text-emerald-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${hotline}`}
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
                  title="Call hotline"
                >
                  +880 {hotline}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  className="w-5 h-5 text-emerald-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="mailto:admin@shodaigram.com"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded break-words"
                  title="Email support"
                >
                  admin@shodaigram.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Info */}
          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-emerald-400 rounded-full"></span>
              <span>Connect With Us</span>
            </h4>
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-800 hover:bg-emerald-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-800 hover:bg-emerald-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-800 hover:bg-emerald-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Twitter"
                title="Twitter"
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-800 hover:bg-emerald-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="YouTube"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>

            <div className="bg-emerald-800/50 border border-emerald-700 rounded-xl p-3.5 sm:p-4">
              <p className="text-[11px] sm:text-xs text-emerald-300 mb-1.5 font-semibold">
                Admin Panel Hours
              </p>
              <p className="text-sm text-emerald-200">24/7 System Access</p>
              <p className="text-[11px] sm:text-xs text-emerald-300 mt-1">
                Support: 8 AM - 10 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-800 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-emerald-300">
            <p className="text-center sm:text-left">
              © {currentYear}{" "}
              <span className="font-semibold text-white">{brand}</span>. All
              rights reserved.
            </p>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
                title="Privacy Policy"
              >
                Privacy Policy
              </Link>
              <span aria-hidden="true" className="text-emerald-700">
                |
              </span>
              <Link
                href="/terms"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
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
