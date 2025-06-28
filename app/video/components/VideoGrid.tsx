// app/video/components/VideoGrid.tsx
'use client'

import { useState } from 'react'
import useSWR from 'swr'
import VideoCard from './VideoCard'
import LoadingGrid from './LoadingGrid'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function VideoGrid() {
  const [page, setPage] = useState(1)
  const { data, error, isLoading } = useSWR(
    `/api/video?page=${page}&per_page=12`,
    fetcher
  )

  if (isLoading) return <LoadingGrid />
  if (error) return <div>Error loading videos</div>

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.posts.map((video: any) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      
      {data.totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mx-4 flex items-center">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}