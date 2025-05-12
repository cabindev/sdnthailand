// app/features/ordain/OrdainSection.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaChartBar, FaPrayingHands } from 'react-icons/fa';

export default function OrdainSection() {
  // Animation variants
  const fadeInUp = {
    initial: { y: 40, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.4, 0, 0.2, 1] 
      }
    }
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] 
      }
    }
  };

  return (
    <div className="py-16 bg-gradient-to-b from-amber-50 via-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="flex justify-center">
            <FaPrayingHands className="text-amber-600 text-3xl mb-4" />
          </div>
          <h2 className="text-3xl font-bold text-amber-900">โครงการบวชสร้างสุข</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            พื้นที่ปลอดภัย ควบคุมการดื่มเครื่องดื่มแอลกอฮอล์ในงานบุญประเพณี
          </p>
        </motion.div>

        <motion.div 
          className="relative overflow-hidden rounded-xl shadow-xl bg-amber-900"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="absolute inset-0 opacity-10 diagonal-pattern"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8">
            <div className="md:w-2/3 mb-8 md:mb-0 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="text-amber-300">สถิติและข้อมูล</span>
              </h3>
              <p className="text-base md:text-lg opacity-90 mb-6 max-w-2xl">
                ข้อมูลสถิติและผลการดำเนินงานโครงการที่สร้างพื้นที่ปลอดภัย ช่วยลดปัญหาการดื่มแอลกอฮอล์ในงานบุญประเพณีไทย และส่งเสริมวัฒนธรรมที่ดีงาม
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="https://ordain-chi.vercel.app/ordain/stats" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors duration-300 shadow-md"
                >
                  <FaChartBar className="mr-2" /> แสดงผลข้อมูล
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <div className="relative w-36 h-36 md:w-48 md:h-48 bg-amber-800 bg-opacity-30 p-4 rounded-full border-4 border-amber-200 border-opacity-30">
                <Image 
                  src="/ordain.png" 
                  alt="โลโก้โครงการบวชสร้างสุข"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}