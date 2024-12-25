// app/video/components/RelatedVideos.tsx
'use client'

import useSWR from 'swr'
import VideoCard from './VideoCard'
import { VideoResponse } from '../types'

interface Props {
  currentVideoId: number
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function RelatedVideos({ currentVideoId }: Props) {
  const { data } = useSWR<VideoResponse>(
    `/api/video?per_page=3&exclude=${currentVideoId}`,
    fetcher
  )

  if (!data?.posts?.length) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.posts.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}