// app/video/components/LoadingGrid.tsx
export default function LoadingGrid() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-200" />
            
            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
              
              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
              
              {/* Meta info */}
              <div className="mt-4 flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }