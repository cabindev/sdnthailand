// app/features/campaign/RequestMediaPopup.tsx
'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Megaphone, X } from 'lucide-react';

/**
 * ป๊อปอัปลอยมุมจอ เชิญชวนให้ "ขอสื่อรณรงค์"
 * - เริ่มต้นเป็นการ์ดเล็ก ๆ ผู้ใช้กดปิดได้ (ยุบเหลือปุ่มกลม)
 * - จำสถานะที่ผู้ใช้เลือกไว้ใน localStorage เพื่อไม่รบกวนซ้ำ
 * - เข้าถึงได้ (โฟกัส, aria-label) และเคารพ prefers-reduced-motion
 */

const SUPPORT_URL = 'https://support.sdnthailand.com/support';
const STORAGE_KEY = 'sdn:req-media-collapsed';

export default function RequestMediaPopup() {
  // ยังไม่ mount = ไม่ render อะไร กันภาพกระพริบ/ค่า SSR ไม่ตรง
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const collapsed = window.localStorage.getItem(STORAGE_KEY) === '1';
    setMounted(true);
    // โผล่การ์ดหลังโหลดเล็กน้อยเพื่อไม่แย่งความสนใจตอนเข้าเว็บ
    const t = window.setTimeout(() => setExpanded(!collapsed), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const collapse = () => {
    setExpanded(false);
    window.localStorage.setItem(STORAGE_KEY, '1');
  };

  const expand = () => {
    setExpanded(true);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-50 print:hidden">
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-[17rem] rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5"
            role="region"
            aria-label="ขอสื่อรณรงค์"
          >
            <button
              type="button"
              onClick={collapse}
              aria-label="ปิดกล่องขอสื่อรณรงค์"
              className="absolute right-2 top-2 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff7834]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3 pr-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff7834]/15 text-[#c2410c]">
                <Megaphone className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">ขอสื่อรณรงค์</p>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-600">
                  ขอสื่อรณรงค์งดเหล้าไปใช้ในกิจกรรมของคุณได้ฟรี
                </p>
              </div>
            </div>

            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff7834] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#e86b2a] hover:shadow-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff7834] focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5"
            >
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              ขอสื่อรณรงค์
            </a>
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            type="button"
            onClick={expand}
            aria-label="เปิดกล่องขอสื่อรณรงค์"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="group flex items-center gap-2 rounded-full bg-[#ff7834] py-3 pl-3 pr-4 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#e86b2a] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff7834] focus-visible:ring-offset-2"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/50 opacity-70 motion-reduce:hidden" />
              <Megaphone className="relative h-5 w-5" aria-hidden="true" />
            </span>
            ขอสื่อรณรงค์
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
