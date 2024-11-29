// app/page.tsx หรือ AnimatedHome.tsx
'use client';

import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Vision from "./Vision";

// Lazy load components
const NewsCarousel = lazy(() => import("@/app/features/news/components/NewsCarousel"));
const BlogList = lazy(() => import("@/app/features/blog/components/BlogList"));
const Support = lazy(() => import("./Support"));

// Loading components สำหรับแต่ละส่วน
const NewsLoadingFallback = () => (
  <div className="max-w-7xl mx-auto px-4 animate-pulse">
    <div className="h-64 bg-gray-200 rounded-xl"></div>
  </div>
);

const BlogLoadingFallback = () => (
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

const SupportLoadingFallback = () => (
  <div className="max-w-7xl mx-auto px-4 animate-pulse">
    <div className="h-48 bg-gray-200 rounded-xl"></div>
  </div>
);

// Animation variants
const fadeInUp = {
  initial: { y: 60, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function AnimatedHome() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - โหลดทันที */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-b from-orange-100 to-white"
      >
        <div className="absolute inset-0 bg-orange-500 opacity-5 pattern-grid-lg"></div>
        <Vision />
      </motion.div>

      {/* News Section - lazy load */}
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 bg-white"
      >
        <Suspense fallback={<NewsLoadingFallback />}>
          <NewsCarousel />
        </Suspense>
      </motion.div>

      {/* Blog Section - lazy load */}
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 bg-orange-50"
      >
        <Suspense fallback={<BlogLoadingFallback />}>
          <BlogList />
        </Suspense>
      </motion.div>

      {/* Support Section - load directly */}
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        className="relative py-16 bg-gradient-to-b from-white to-orange-50 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-400/10"></div>
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
        </div>
        <div className="relative z-10">
          <Support />
        </div>
      </motion.div>
    </div>
  );
}