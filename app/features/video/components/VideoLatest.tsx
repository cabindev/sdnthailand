// app/features/video/components/VideoLatest.tsx
'use client'

import useSWR from 'swr'
import Link from 'next/link'
import VideoCard from '@/app/video/components/VideoCard'

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function VideoLatest() {
  const { data } = useSWR('/api/video?per_page=3', fetcher)
  
  if (!data) return null
  
  return (
    <section className="py-12 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Videos</h2>
          <p className="mt-2 text-gray-600">วิดีโอล่าสุดจาก SDN Thailand</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.posts.map((video: any) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {/* View All Videos Link */}
        <div className="text-center mt-8">
          <Link
            href="/video"
            className="inline-block px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            ดู Videos ทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  )
}