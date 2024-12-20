// app/page.tsx หรือ AnimatedHome.tsx
'use client';

import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Vision from "./Vision";
import Campaigns from "@/app/features/components/Campaigns";
import LogoShowcase from "@/app/features/components/LogoShowcase";
import Campaign from "./Campaign";

// Lazy load components
const NewsLatest = lazy(() => import("@/app/features/news/components/NewsLatest"));
const BlogList = lazy(() => import("@/app/features/blog/components/BlogList"));
const Support = lazy(() => import("./Support"));

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
      <motion.section 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
<Suspense fallback={null}>
        <Campaign />
      </Suspense>
</motion.section>

      {/* <motion.section
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
      >
        <Campaigns />
      </motion.section> */}
      {/* News Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
      >
       <Suspense fallback={<NewsLoadingFallback />}>
        <NewsLatest />
      </Suspense>
      </motion.section>

      {/* Blog Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        className="bg-orange-50"
      >
         <Suspense fallback={<BlogLoadingFallback />}>
        <BlogList />
      </Suspense>
      </motion.section>

      {/* Support Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        className="relative bg-gradient-to-b from-white to-orange-50"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-400/10"></div>
          {/* <div className="absolute inset-0 bg-[url('/sdn1.svg')] opacity-5"></div> */}
        </div>
        <Suspense fallback={<NewsLoadingFallback />}>
          <div className="relative z-10">
            <Support />
          </div>
        </Suspense>
      </motion.section>
      <motion.section
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <LogoShowcase />
      </motion.section>
    </main>
  );
}