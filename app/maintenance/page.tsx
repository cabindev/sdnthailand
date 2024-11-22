export default function Maintenance() {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            {/* Icon */}
            <div className="animate-bounce">
              <div className="inline-flex p-4 bg-orange-500 text-white rounded-full">
                <svg 
                  className="w-12 h-12" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
            </div>
  
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              เตรียมพบกับประสบการณ์ใหม่
            </h2>
  
            {/* Description */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
              เรากำลังพัฒนาและปรับปรุงเว็บไซต์ให้ดียิ่งขึ้น 
              <br className="hidden sm:inline"/>
              เพื่อการใช้งานที่สะดวกและมีประสิทธิภาพมากขึ้น
            </p>
  
            {/* Counter */}
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-md">
              <span className="text-orange-500 font-semibold">
                เตรียมพบกันเร็วๆ นี้
              </span>
            </div>
  
            {/* Features Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
              {[
                'ระบบใหม่ ใช้งานง่ายขึ้น',
                'ดีไซน์ทันสมัย',
                'ประสิทธิภาพดียิ่งขึ้น'
              ].map((feature) => (
                <div 
                  key={feature}
                  className="bg-white/60 backdrop-blur-sm p-4 rounded-xl"
                >
                  <p className="font-medium text-gray-800">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }