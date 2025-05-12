// app/herosection/components/Home2025.tsx
'use client';

import { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Campaign from "./Campaign";
import NewsLoadingFallback from "@/app/herosection/components/loading/NewsLoadingFallback";
import BlogLoadingFallback from "@/app/herosection/components/loading/BlogLoadingFallback";
import NetworksSDN from "./Networks-SDN";
import OrdainSection from "@/app/features/ordain/OrdainSection";
import SDNInfo from "@/app/about/page";
import LogoShowcase from "@/app/features/components/LogoShowcase";
import NavigationMenu from "./NavigationMenu"; // เพิ่มการนำเข้า NavigationMenu

// Lazy load components
const NewsLatest = lazy(() => import("@/app/features/news/components/NewsLatest"));
const BlogList = lazy(() => import("@/app/features/blog/components/BlogList"));
const Support = lazy(() => import("./Support"));
const VideoLatest = lazy(() => import("@/app/features/video/components/VideoLatest"));

// Animation variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const slideUp = {
  initial: { y: 40, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
};

export default function Home2025() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Update active section based on scroll position
      const sections = ["hero", "news", "blogs", "ordain", "about", "networks", "videos", "support"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="hero" className="relative w-full overflow-hidden" style={{height: '630px'}}>
        <div className="absolute inset-0 bg-white opacity-90 z-0"></div>
        
        {/* Full-width Carousel */}
        <div className="h-full w-full max-w-[1920px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-full w-full rounded-lg overflow-hidden"
          >
            <Suspense fallback={null}>
              <Campaign />
            </Suspense>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div 
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.2 }}
            >
              <span className="text-sm font-medium mb-2 text-[var(--foreground)] backdrop-blur-sm px-3 py-1 rounded-full bg-[var(--accent)]/20">เลื่อนลงเพื่อดูข้อมูลเพิ่มเติม</span>
              <motion.div 
                className="w-6 h-6 border-b-2 border-r-2 border-[var(--accent)]/80 transform rotate-45"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ใช้ Navigation Menu */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <NavigationMenu activeSection={activeSection} />
      </motion.div>

      {/* News Section */}
      <section id="news">
        <Suspense fallback={<NewsLoadingFallback />}>
          <motion.div 
            variants={slideUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            <NewsLatest />
          </motion.div>
        </Suspense>
      </section>

      {/* Blog Section */}
      <section id="blogs">
        <Suspense fallback={<BlogLoadingFallback />}>
          <motion.div 
            variants={slideUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            <BlogList />
          </motion.div>
        </Suspense>
      </section>
      
      {/* Ordain Section */}
      <section id="ordain" className="bg-white">
        <motion.div
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          <OrdainSection />
        </motion.div>
      </section>
      
      {/* About Section */}
      <section id="about">
        <motion.div
          variants={slideUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          <SDNInfo />
        </motion.div>
      </section>
      
      {/* Networks Section */}
      <section id="networks">
        <motion.div
          variants={slideUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          <NetworksSDN />
        </motion.div>
      </section>
      
      {/* Video Section */}
      <section id="videos">
        <Suspense>
          <motion.div
            variants={slideUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            <VideoLatest />
          </motion.div>
        </Suspense>
      </section>
      
      {/* Support Section */}
      <section id="support" className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-8 text-center"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)]">ข้อมูลสนับสนุนการทำงาน</h2>
            <div className="w-24 h-1 bg-[var(--accent)] mx-auto mt-2"></div>
          </motion.div>
          
          <Suspense>
            <motion.div
              variants={slideUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              <Support />
            </motion.div>
          </Suspense>
        </div>
      </section>
      
      {/* Partner Logos */}
      <section className="bg-white">
        <motion.div
          variants={slideUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          <LogoShowcase />
        </motion.div>
      </section>

      {/* Back to Top Button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            className="fixed bottom-8 right-8 p-4 bg-[var(--accent)] text-white rounded-full shadow-lg z-50 hover:shadow-xl hover:-translate-y-1 transition-all"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="กลับขึ้นด้านบน"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}