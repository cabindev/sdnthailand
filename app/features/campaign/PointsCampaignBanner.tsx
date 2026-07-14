// app/features/campaign/PointsCampaignBanner.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { FaLine } from 'react-icons/fa6';

/**
 * แบนเนอร์ชวนสะสมแต้มสุขภาพช่วงเข้าพรรษา 2569 ผ่านแอป SDN Thailand
 * ลิงก์ไปข่าวเต็มของแคมเปญ (sdnpost 38137) และ LINE OA "No L Land"
 */

// อิงช่วงแคมเปญ 90 วันพลัส (29 ก.ค. – 26 ต.ค. 2569) — แบนเนอร์ซ่อนเองเมื่อจบ
export const POINTS_END = new Date('2026-10-26T23:59:59+07:00').getTime();
const POINTS_URL = '/sdnpost/38137';
const NO_L_LAND_LINE_URL = 'https://line.me/R/ti/p/@801gjvas?oat_content=url&ts=07141220';

const fadeInUp: Variants = {
  initial: { y: 32, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function PointsCampaignBanner() {
  if (Date.now() > POINTS_END) return null;

  return (
        <motion.div
          className="grid items-center gap-6 lg:gap-10 lg:grid-cols-[1.15fr_1fr]"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* โปสเตอร์แคมเปญ — ลิงก์ไปข่าวเต็ม */}
          <Link
            href={POINTS_URL}
            aria-label="อ่านข่าวเต็ม: เข้าพรรษา 2569 ชวนคนไทย สะสมแต้มสุขภาพ งดเหล้า ทำสิ่งดีดี ให้เกิดขึ้น"
            className="group relative block overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:ring-teal-500/40 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 motion-safe:hover:-translate-y-1"
          >
            <Image
              src="/campaign/buddhistlent/84-scaled.png"
              alt="เข้าพรรษาปีนี้ สะสมแต้มสุขภาพ สะสมดาวแลกของที่ระลึกสุดพิเศษ ผ่านแอป SDN Thailand"
              width={2560}
              height={1440}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="w-full h-auto transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
            />

            {/* เลเยอร์เชิญชวนตอน hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-end justify-start bg-linear-to-t from-black/55 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-teal-700 shadow-md">
                <ArrowRight className="h-4 w-4" />
                อ่านข่าวเต็ม
              </span>
            </span>
          </Link>

          {/* ข้อความจริง (accessible + responsive) */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-600/10 px-3 py-1 text-xs font-semibold text-teal-700">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
              </span>
              ข่าวล่าสุด
            </span>

            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 text-balance">
              เข้าพรรษาปีนี้ สะสมแต้มสุขภาพ
              <span className="block text-[#c2410c]">งดเหล้า ทำสิ่งดีดี ให้เกิดขึ้น</span>
            </h2>

            <p className="mx-auto lg:mx-0 mt-3 max-w-md text-gray-600 leading-relaxed">
              ชวนคนไทยร่วมกิจกรรม 90 วันพลัส เช็คอินสะสมแต้มสุขภาพผ่านแอป No L Land
              พร้อมแลกของที่ระลึกสุดพิเศษ
            </p>
            

            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700">

              <Calendar className="h-4 w-4 text-[#ff7834]" aria-hidden="true" />
              ร่วมสะสมแต้ม 29 กรกฎาคม – 26 ตุลาคม 2569
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href={POINTS_URL}
                className="inline-flex items-center gap-2 rounded-full bg-[#ff7834] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#e86b2a] hover:shadow-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff7834] focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5"
              >
                อ่านข่าวเพิ่มเติม
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <a
                href={NO_L_LAND_LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#06C755] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#05b34c] hover:shadow-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#06C755] focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5"
              >
                <FaLine className="h-4 w-4" aria-hidden="true" />
                เพิ่มเพื่อน No L Land
              </a>
            </div>
          </div>
        </motion.div>
  );
}
