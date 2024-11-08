'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface RelatedPost {
  id: number
  title: { rendered: string }
  date: string
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
  }
}

interface RelatedPostsProps {
  currentPostId: number
}

export default function RelatedPosts({ currentPostId }: RelatedPostsProps) {
  const [posts, setPosts] = useState<RelatedPost[]>([])

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const res = await fetch(`/api/sdnpost?per_page=3&_embed`)
        if (!res.ok) throw new Error('Failed to fetch related posts')
        const data = await res.json()
        setPosts(data.posts.filter((p: RelatedPost) => p.id !== currentPostId).slice(0, 3))
      } catch (error) {
        console.error('Error fetching related posts:', error)
      }
    }
    fetchRelatedPosts()
  }, [currentPostId])

  if (posts.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl md:text-3xl font-seppuri font-bold mb-6">บทความที่เกี่ยวข้อง</h2>
      <div className="grid gap-8">
        {posts.map(post => (
          <Link
            key={post.id}
            href={`/sdnpost/${post.id}`}
            className="group block hover:bg-gray-50 rounded-xl transition-colors duration-200"
          >
            <div className="flex gap-4 items-start">
              {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                <div className="w-32 md:w-48 aspect-video flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={post._embedded['wp:featuredmedia'][0].source_url}
                    alt={post.title.rendered}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              <div className="flex-1 hidden md:block">
                <h3 
                  className="text-lg font-seppuri group-hover:text-orange-500 transition-colors mb-2"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}