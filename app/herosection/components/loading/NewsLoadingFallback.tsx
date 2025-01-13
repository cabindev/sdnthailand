// herosection/components/Loading/NewsLoadingFallback.tsx
export default function NewsLoadingFallback() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-full w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-full w-48 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }