// app/sdnblog/components/RelatedBlogPosts.tsx
'use client'

import useSWR from 'swr'
import LoadingSpinner from './LoadingSpinner'
import BlogCard from './BlogCard'

interface RelatedPostsProps {
  currentPostId: number
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function RelatedBlogPosts({ currentPostId }: RelatedPostsProps) {
  const { data, error, isLoading } = useSWR(
    `/api/sdnblog/related/${currentPostId}`,
    fetcher,
    {
      revalidateIfStale: false, // ไม่ revalidate เมื่อข้อมูลเก่า
      revalidateOnFocus: false, // ไม่ revalidate เมื่อ focus
      revalidateOnReconnect: false, // ไม่ revalidate เมื่อ reconnect
      dedupingInterval: 60000, // cache 60 วินาที
    }
  )

  if (error) return null
  if (isLoading) return <LoadingSpinner />
  if (!data?.success || !data?.posts?.length) return null

  return (
    <div className="mt-12 md:mt-16">
      <h2 className="text-xl md:text-2xl font-seppuri font-bold text-gray-800 mb-6">
        บทความที่เกี่ยวข้อง
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.posts.map((post: any) => (
          <BlogCard
            key={post.id} 
            post={{
              ...post,
              featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                            post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url
            }} 
          />
        ))}
      </div>
    </div>
  )
}