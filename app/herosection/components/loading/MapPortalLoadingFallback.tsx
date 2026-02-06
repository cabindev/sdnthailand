import { Loader2 } from 'lucide-react';

export default function MapPortalLoadingFallback() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] bg-gray-100">
      <div className="absolute top-3 left-3 bottom-3 z-10 w-[350px] sm:w-[380px] bg-white/95 rounded-2xl shadow-xl overflow-hidden animate-pulse">
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg" />
            <div>
              <div className="h-4 bg-gray-100 rounded w-28 mb-1" />
              <div className="h-3 bg-gray-50 rounded w-24" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-3 bg-gray-50 rounded w-14" />
            <div className="h-3 bg-gray-50 rounded w-14" />
            <div className="h-3 bg-gray-50 rounded w-16" />
          </div>
        </div>
        <div className="px-3 pt-2.5">
          <div className="flex bg-gray-100/80 rounded-xl p-1 gap-1">
            <div className="flex-1 h-10 bg-white rounded-lg" />
            <div className="flex-1 h-10 bg-gray-50 rounded-lg" />
          </div>
        </div>
        <div className="p-3 space-y-1.5 mt-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="h-11 bg-gray-50 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-orange-500" />
        <span className="text-sm text-gray-400">กำลังโหลดแผนที่...</span>
      </div>
    </section>
  );
}
