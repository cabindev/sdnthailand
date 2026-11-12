// app/features/campaign/FarewellJourneySection.tsx
'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * เส้นทางสุดท้าย — ส่งด้วยใจ (งานศพปลอดเหล้า)
 * ฝังประสบการณ์แอนิเมชันแบบเลื่อนเล่าเรื่องจาก network.sdnthailand.com แบบเต็มเฟรม
 * (ปลายทางไม่ได้ตั้ง X-Frame-Options / frame-ancestors จึงฝังได้)
 */
const JOURNEY_URL = 'https://network.sdnthailand.com/farewell/journey';

export default function FarewellJourneySection() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section
      id="farewell"
      aria-labelledby="farewell-title"
      className="relative w-full bg-[#f3eee6]"
    >
      <h2 id="farewell-title" className="sr-only">
        เส้นทางสุดท้าย ส่งด้วยใจ — งานศพปลอดเหล้า
      </h2>

      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-stone-500"
        >
          <Loader2 className="h-6 w-6 animate-spin motion-reduce:animate-none" />
          <span className="text-sm">กำลังโหลดเส้นทาง…</span>
        </div>
      )}

      <iframe
        src={JOURNEY_URL}
        title="เส้นทางสุดท้าย — ส่งด้วยใจ: แอนิเมชันเล่าเรื่องงานศพปลอดเหล้า"
        onLoad={() => setLoaded(true)}
        className={`block h-svh w-full border-0 transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        allow="fullscreen; autoplay"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
}
