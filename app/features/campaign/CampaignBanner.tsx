// app/features/campaign/CampaignBanner.tsx
'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { Calendar, Facebook } from 'lucide-react';

/**
 * แถบประกาศแคมเปญ "งดเหล้าเข้าพรรษา 2569 · เก็บแต้มสุขภาพดีได้ทุกวัน"
 * รูปโปสเตอร์ทำหน้าที่เป็นภาพประกอบ ส่วนหัวข้อ/วันที่เป็น HTML จริง
 * เพื่อให้ responsive, อ่านออกทุกจอ และ screen reader/TTS เข้าถึงได้ (WCAG AA)
 */

// ช่วงกิจกรรม 1 ก.ค. – 28 ต.ค. 2569 (พ.ศ.) = 2026 (ค.ศ.) — แบนเนอร์ซ่อนเองเมื่อจบ
const CAMPAIGN_END = new Date('2026-10-28T23:59:59+07:00').getTime();

const fadeInUp: Variants = {
  initial: { y: 32, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function CampaignBanner() {
  // ซ่อนแบนเนอร์อัตโนมัติเมื่อจบกิจกรรม
  if (Date.now() > CAMPAIGN_END) return null;

  return (
    <div className="bg-linear-to-b from-orange-50 to-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid items-center gap-6 lg:gap-10 lg:grid-cols-[1.15fr_1fr]"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* โปสเตอร์แคมเปญ — ลิงก์ไปเพจ Facebook */}
          <a
            href="https://www.facebook.com/StopdrinkOfficial"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ดูรายละเอียดแคมเปญงดเหล้าเข้าพรรษา 2569 บนเฟซบุ๊ก SDN Thailand (เปิดแท็บใหม่)"
            className="group relative block overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:ring-[#ff7834]/40 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff7834] focus-visible:ring-offset-2 motion-safe:hover:-translate-y-1"
          >
            <Image
              src="/campaign/BU.webp"
              alt="แคมเปญงดเหล้าเข้าพรรษา 2569: งดดื่ม 1 ถึง 3 เดือน ตับและสุขภาพฟื้นฟูดีขึ้นทุกวัน"
              width={1250}
              height={417}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="w-full h-auto transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
            />

            {/* เลเยอร์เชิญชวนตอน hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-end justify-start bg-linear-to-t from-black/55 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#c2410c] shadow-md">
                <Facebook className="h-4 w-4" />
                ดูรายละเอียดบน Facebook
              </span>
            </span>
          </a>

          {/* ข้อความจริง (accessible + responsive) */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ff7834]/15 px-3 py-1 text-xs font-semibold text-[#c2410c]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff7834] opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff7834]" />
              </span>
              กำลังจัดกิจกรรม
            </span>

            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 text-balance">
              งดเหล้าเข้าพรรษา 2569
              <span className="block text-[#c2410c]">เก็บแต้มสุขภาพดีได้ทุกวัน</span>
            </h2>

            <p className="mx-auto lg:mx-0 mt-3 max-w-md text-gray-600 leading-relaxed">
              ทุกวันที่ไม่ดื่ม ร่างกายค่อย ๆ ฟื้นฟู ตั้งแต่เดือนแรกถึงเดือนที่สาม
              สุขภาพและตับดีขึ้นเป็นลำดับ ร่วมสะสมแต้มสุขภาพดีไปด้วยกัน
            </p>

            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4 text-[#ff7834]" aria-hidden="true" />
              ร่วมกิจกรรม 1 กรกฎาคม – 28 ตุลาคม 2569
            </p>

            <div className="mt-6">
              <a
                href="https://www.facebook.com/StopdrinkOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff7834] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#e86b2a] hover:shadow-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff7834] focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
                ร่วมกิจกรรมบน Facebook
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
