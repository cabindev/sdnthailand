// app/page.tsx หรือ AnimatedHome.tsx
'use client';

import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Vision from "./Vision";
import Campaigns from "@/app/features/components/Campaigns";
import LogoShowcase from "@/app/features/components/LogoShowcase";
import Campaign from "./Campaign";
import DryJanuary from "./Dry-january"

// Lazy load components
const NewsLatest = lazy(() => import("@/app/features/news/components/NewsLatest"));
const BlogList = lazy(() => import("@/app/features/blog/components/BlogList"));
const Support = lazy(() => import("./Support"));
const VideoLatest = lazy(() => import("@/app/features/video/components/VideoLatest"));
// Loading components แบบ Skeleton สำหรับ News Section
const NewsLoadingFallback = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-full w-64 mx-auto mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-full w-48 mx-auto"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="animate-pulse">
            <div className="aspect-[4/3] bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Blog Loading Fallback ที่ปรับปรุงแล้ว
const BlogLoadingFallback = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-full w-64 mx-auto mb-4"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
          <div className="aspect-video bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Animation variants
const fadeInUp = {
  initial: { y: 40, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.4, 0, 0.2, 1] 
    }
  }
};

export default function AnimatedHome() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <motion.section>
        <Suspense fallback={null}>
          <Campaign/>
        </Suspense>
      </motion.section>

      {/* News Section - Priority Load */}
      <Suspense fallback={<NewsLoadingFallback />}>
        <motion.section 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          <NewsLatest />
        </motion.section>

        {/* Blog Section - Load after News */}
        <Suspense fallback={<BlogLoadingFallback />}>
          <motion.section 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            className="bg-orange-50"
          >
            <BlogList />
          </motion.section>

          {/* Other sections - Load last */}
          <Suspense>
            <motion.section>
              <VideoLatest />
            </motion.section>

            <motion.section>
              <Support />
            </motion.section>

            <motion.section>
              <LogoShowcase />
            </motion.section>
          </Suspense>
        </Suspense>
      </Suspense>
    </main>
  );
}