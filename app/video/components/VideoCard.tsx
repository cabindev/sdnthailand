// app/video/components/VideoCard.tsx
import Link from 'next/link'
import { VideoPost } from '../types'

export default function VideoCard({ video }: { video: VideoPost }) {
  const thumbnail = video._embedded?.['wp:featuredmedia']?.[0]?.source_url

  return (
    <Link href={`/video/${video.id}`}>
      <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative aspect-video">
          <img
            src={thumbnail || '/images/default-video-thumbnail.jpg'}
            alt={video.title?.rendered || 'Video thumbnail'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="p-4">
          <h3 
            className="font-bold text-gray-900 mb-2 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: video.title?.rendered || '' }}
          />
          {video.excerpt?.rendered && (
            <div 
              className="text-sm text-gray-600 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: video.excerpt.rendered }}
            />
          )}
          {video.acf?.video_duration && (
            <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              {video.acf.video_duration}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}