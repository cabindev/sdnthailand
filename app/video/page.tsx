// app/video/page.tsx
import { Suspense } from 'react'
import VideoGrid from './components/VideoGrid'
import LoadingGrid from './components/LoadingGrid'

export const metadata = {
  title: 'SDN Videos | วิดีโอน่าสนใจจาก SDN Thailand',
  description: 'รวมวิดีโอที่น่าสนใจเกี่ยวกับวิถีชีวิต ผู้คน และวัฒนธรรม จาก SDN Thailand'
}

export default function VideoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            SDN Videos
          </h1>
          <p className="text-lg text-gray-600">
            SDNTHAILAND ทุกเรื่องราวที่เราขับเคลื่อน
          </p>
        </div>

        {/* Video Grid */}
        <Suspense fallback={<LoadingGrid />}>
          <VideoGrid />
        </Suspense>
      </div>
    </div>
  )
}