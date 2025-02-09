'use client';

import { useEffect, useState } from 'react';

export default function NewsLatestLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        // ชะลอความเร็วเมื่อใกล้ 100%
        const increment = prev < 80 ? 2 : 0.5;
        const next = prev + increment;
        
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-white min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">ข่าวและกิจกรรมล่าสุด</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4"></div>
        </div>

        {/* Loading Progress Circle */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative w-40 h-40">
            {/* Background Circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="60"
                className="stroke-gray-200"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r="60"
                className="stroke-orange-500"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: '376.99111843077515',
                  strokeDashoffset: `${376.99111843077515 - (progress / 100) * 376.99111843077515}`,
                  transition: 'stroke-dashoffset 0.5s ease'
                }}
              />
            </svg>
            {/* Percentage Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">
                {Math.round(progress)}%
              </span>
              <span className="text-sm text-gray-500 mt-1">กำลังโหลด</span>
            </div>
          </div>
        </div>

        {/* Skeleton Loading Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
              style={{
                animationDelay: `${i * 150}ms`
              }}
            >
              <div className="aspect-[4/3] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-shimmer bg-[length:200%_100%]"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full animate-shimmer bg-[length:200%_100%]"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3 animate-shimmer bg-[length:200%_100%]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}