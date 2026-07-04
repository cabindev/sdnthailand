// app/features/campaign/SignCampaignBanner.tsx
'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';

/**
 * แบนเนอร์ชวนลงนามออนไลน์ "ลด ละ เลิกเหล้า" ร่วมกับกรมควบคุมโรค (DDC) และ สสส.
 * ลิงก์ปลายทางเป็นเว็บลงทะเบียนของ DDC โดยตรง (ตัดพารามิเตอร์ติดตามจาก Facebook ออก)
 */

// ช่วงลงนาม 1 ก.ค. – 26 ต.ค. 2569 (พ.ศ.) = 2026 (ค.ศ.) — แบนเนอร์ซ่อนเองเมื่อจบ
export const SIGN_END = new Date('2026-10-26T23:59:59+07:00').getTime();
const SIGN_URL = 'https://noalcohol.ddc.moph.go.th/';

const fadeInUp: Variants = {
  initial: { y: 32, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function SignCampaignBanner() {
  if (Date.now() > SIGN_END) return null;

  return (
        <motion.div
          className="grid items-center gap-6 lg:gap-10 lg:grid-cols-[1fr_1.15fr]"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* ข้อความจริง (accessible + responsive) */}
          <div className="text-center lg:text-left lg:order-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-600/10 px-3 py-1 text-xs font-semibold text-teal-700">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
              </span>
              เข้าพรรษานี้เริ่มเลย
            </span>

            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 text-balance">
              ลด ละ เลิกเหล้า
              <span className="block text-[#c2410c]">ร่วมลงนามออนไลน์กับกรมควบคุมโรค</span>
            </h2>

            <p className="mx-auto lg:mx-0 mt-3 max-w-md text-gray-600 leading-relaxed">
              ขอเชิญชวนประชาชนทุกคนร่วมลงนามออนไลน์ ลด ละ เลิกเหล้า
              จัดโดยกรมควบคุมโรค (DDC) และ สสส.
            </p>

            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4 text-[#ff7834]" aria-hidden="true" />
              ระยะเวลาลงนาม 1 กรกฎาคม – 26 ตุลาคม 2569
            </p>

            <div className="mt-6">
              <a
                href={SIGN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff7834] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#e86b2a] hover:shadow-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff7834] focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                ลงนามออนไลน์ที่นี่
              </a>
            </div>
          </div>

          {/* โปสเตอร์แคมเปญ — ลิงก์ไปหน้าลงทะเบียนของ DDC */}
          <a
            href={SIGN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ร่วมลงนามออนไลน์ ลด ละ เลิกเหล้า บนเว็บไซต์กรมควบคุมโรค (เปิดแท็บใหม่)"
            className="group relative block overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:ring-teal-500/40 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 motion-safe:hover:-translate-y-1 lg:order-1"
          >
            <Image
              src="/campaign/budhist.jpg"
              alt="ขอเชิญชวนประชาชนทุกคนร่วมลงนามออนไลน์ ลด ละ เลิกเหล้า เข้าสู่ระบบบำบัดรักษาประจำปี 2569 ระยะเวลาลงนาม 1 กรกฎาคม ถึง 26 ตุลาคม 2569 จัดโดยกรมควบคุมโรคและ สสส."
              width={1500}
              height={905}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="w-full h-auto transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
            />

            {/* เลเยอร์เชิญชวนตอน hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-end justify-start bg-linear-to-t from-black/55 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-teal-700 shadow-md">
                <ExternalLink className="h-4 w-4" />
                ลงนามออนไลน์
              </span>
            </span>
          </a>
        </motion.div>
  );
}
