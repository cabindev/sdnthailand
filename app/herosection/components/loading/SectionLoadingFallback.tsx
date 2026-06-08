// herosection/components/loading/SectionLoadingFallback.tsx
// Skeleton กลางสำหรับ section ทั่วไปในหน้าแรก — มี shimmer effect (แสงวิ่งผ่าน)

// กล่อง skeleton ที่มีแสง shimmer วิ่งผ่าน
function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200/70 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

interface SectionLoadingFallbackProps {
  /** จำนวนการ์ดที่จะแสดง (ค่าเริ่มต้น 3) */
  cards?: number;
  /** แสดงหัวข้อด้านบนหรือไม่ (ค่าเริ่มต้น true) */
  showHeader?: boolean;
}

export default function SectionLoadingFallback({
  cards = 3,
  showHeader = true,
}: SectionLoadingFallbackProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {showHeader && (
        <div className="text-center mb-12 flex flex-col items-center">
          <Shimmer className="h-8 w-64 rounded-full mb-4" />
          <Shimmer className="h-1 w-24 rounded-full" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100"
          >
            <Shimmer className="aspect-video" />
            <div className="p-4 space-y-3">
              <Shimmer className="h-4 w-3/4 rounded-sm" />
              <Shimmer className="h-4 w-full rounded-sm" />
              <Shimmer className="h-4 w-2/3 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
