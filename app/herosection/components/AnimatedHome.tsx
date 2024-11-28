'use client';

import { motion } from "framer-motion";
import NewsCarousel from "@/app/features/news/components/NewsCarousel";
import BlogList from "@/app/features/blog/components/BlogList";
import Vision from "./Vision";
import Support from "./Support";

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
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-b from-orange-100 to-white"
      >
        <div className="absolute inset-0 bg-orange-500 opacity-5 pattern-grid-lg"></div>
        <Vision />
      </motion.section>

      {/* News Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-12 bg-white"
      >
        <NewsCarousel />
      </motion.section>

      {/* Blog Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-16 bg-orange-50"
      >
        <BlogList />
      </motion.section>

      {/* Support Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-16 bg-gradient-to-b from-white to-orange-50 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-400/10"></div>
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
        </div>
        <Support />
      </motion.section>
    </div>
  );
}