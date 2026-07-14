// app/features/campaign/CampaignRotator.tsx
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CampaignBanner, { CAMPAIGN_END } from './CampaignBanner';
import SignCampaignBanner, { SIGN_END } from './SignCampaignBanner';
import PointsCampaignBanner, { POINTS_END } from './PointsCampaignBanner';

/**
 * สลับแสดงแบนเนอร์แคมเปญ 3 รายการ (งดเหล้าเข้าพรรษา 2569 / ลงนามออนไลน์ ลด ละ เลิกเหล้า / สะสมแต้มสุขภาพ)
 * ทีละอัน แบบ crossfade อัตโนมัติ — คล้ายสไลด์โชว์แคมเปญด้านล่างของหน้าแรก
 */

const ROTATE_INTERVAL_MS = 7000;

export default function CampaignRotator() {
  const slides = useMemo(
    () =>
      [
        { id: 'lent', Component: CampaignBanner, active: Date.now() <= CAMPAIGN_END },
        { id: 'sign', Component: SignCampaignBanner, active: Date.now() <= SIGN_END },
        { id: 'points', Component: PointsCampaignBanner, active: Date.now() <= POINTS_END },
      ].filter((slide) => slide.active),
    []
  );

  const [index, setIndex] = useState(0);

  const goToSlide = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (slides.length < 2) return;
    // รีเซ็ตนาฬิกาทุกครั้งที่ index เปลี่ยน (ทั้งจากออโต้และคลิกเลือกเอง)
    // กันไม่ให้ auto-tick ที่ค้างคิวอยู่มาทับการคลิกเลือกสไลด์ของผู้ใช้
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length, index]);

  if (slides.length === 0) return null;

  const ActiveSlide = slides[index];

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={ActiveSlide.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <ActiveSlide.Component />
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                index === i ? 'w-6 h-2.5 bg-[#ff7834]' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`ไปที่แบนเนอร์แคมเปญที่ ${i + 1}`}
            >
              <span className="sr-only">แบนเนอร์แคมเปญที่ {i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
