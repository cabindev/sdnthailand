// app/herosection/components/AnimatedHome.tsx
'use client';

import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Vision from "./Vision";
import Campaigns from "@/app/features/components/Campaigns";
import LogoShowcase from "@/app/features/components/LogoShowcase";
import Campaign from "./Campaign";
import DryJanuary from "./Dry-january";
import NewsLoadingFallback from "@/app/herosection/components/loading/NewsLoadingFallback";
import BlogLoadingFallback from "@/app/herosection/components/loading/BlogLoadingFallback";
import NetworksSDN from "./Networks-SDN";
import LivePopup from "@/app/popup/page";

// Lazy load components
const NewsLatest = lazy(() => import("@/app/features/news/components/NewsLatest"));
const BlogList = lazy(() => import("@/app/features/blog/components/BlogList"));
const Support = lazy(() => import("./Support"));
const VideoLatest = lazy(() => import("@/app/features/video/components/VideoLatest"));

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
      {/* <LivePopup/> */}
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
          <motion.section>
              <NetworksSDN/>
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