'use client';

import { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GuildMenu from "./GuildMenu";

// Lazy load components
const CoverElephant = lazy(() => import("./CoverElephant"));
const NewsLatest = lazy(() => import("@/app/features/news/components/NewsLatest"));
const BlogList = lazy(() => import("@/app/features/blog/components/BlogList"));
const Support = lazy(() => import("./Support"));
const VideoLatest = lazy(() => import("@/app/features/video/components/VideoLatest"));
const NetworksSDN = lazy(() => import("./Networks-SDN"));
const OrdainSection = lazy(() => import("@/app/features/ordain/OrdainSection"));
const SDNInfo = lazy(() => import("@/app/about/page"));
const LogoShowcase = lazy(() => import("@/app/features/components/LogoShowcase"));

// Loading components
import NewsLoadingFallback from "@/app/herosection/components/loading/NewsLoadingFallback";
import BlogLoadingFallback from "@/app/herosection/components/loading/BlogLoadingFallback";
import IntegratedHeroSection from "./ProjectIntroPage";

// Animation variants
const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6 } }
  },
  slideUp: {
    initial: { y: 30, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  },
  heroScale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      transition: { delay: 0.1, duration: 0.6 } 
    }
  }
};

const VIEWPORT_CONFIG = { once: true, margin: "-30px" };

export default function Home2025() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white">
      
      {/* Top Section: Cover Elephant */}
      <section className="relative w-full bg-white">
        <motion.div
          className="w-full"
          variants={ANIMATIONS.heroScale}
          initial="initial"
          animate="animate"
        >
          {/* Cover Elephant Section */}
          <Suspense fallback={<div className="h-[630px] w-full bg-gray-50 animate-pulse" />}>
            <IntegratedHeroSection />
          </Suspense>
        </motion.div>
      </section>

      {/* Guild Menu */}
      <GuildMenu />


      {/* News Section */}
      <Section id="news" fallback={<NewsLoadingFallback />}>
        <NewsLatest />
      </Section>

      {/* Blog Section */}
      <Section id="blogs" fallback={<BlogLoadingFallback />}>
        <BlogList />
      </Section>

      {/* Ordain Section */}
      <Section id="ordain" className="bg-white" animation="fadeIn">
        <OrdainSection />
      </Section>

      {/* About Section */}
      <Section id="about">
        <SDNInfo />
      </Section>

      {/* Networks Section */}
      <Section id="networks">
        <NetworksSDN />
      </Section>

      {/* Video Section */}
      <Section id="videos">
        <VideoLatest />
      </Section>

      {/* Support Section */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.header 
            className="mb-12 text-center"
            variants={ANIMATIONS.fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={VIEWPORT_CONFIG}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ข้อมูลสนับสนุนการทำงาน
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto" />
          </motion.header>
          
          <Section>
            <Support />
          </Section>
        </div>
      </section>

      {/* Partner Logos */}
      <Section className="bg-white">
        <LogoShowcase />
      </Section>

      {/* Back to Top Button */}
      <BackToTopButton isVisible={isScrolled} onClick={scrollToTop} />
    </main>
  );
}

// Reusable Section Component
interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  animation?: keyof typeof ANIMATIONS;
}

function Section({ 
  id, 
  className = "", 
  children, 
  fallback, 
  animation = "slideUp" 
}: SectionProps) {
  const content = (
    <motion.div
      variants={ANIMATIONS[animation]}
      initial="initial"
      whileInView="animate"
      viewport={VIEWPORT_CONFIG}
    >
      {children}
    </motion.div>
  );

  return (
    <section id={id} className={className}>
      {fallback ? (
        <Suspense fallback={fallback}>
          {content}
        </Suspense>
      ) : (
        <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse" />}>
          {content}
        </Suspense>
      )}
    </section>
  );
}

// Back to Top Button Component
interface BackToTopButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

function BackToTopButton({ isVisible, onClick }: BackToTopButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-8 right-8 p-3 bg-orange-500 text-white rounded-full shadow-lg z-50 hover:bg-orange-600 hover:shadow-xl transition-colors"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={onClick}
          aria-label="กลับขึ้นด้านบน"
        >
          <svg 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 15l7-7 7 7" 
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}