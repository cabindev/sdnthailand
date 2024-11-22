// components/RelatedPosts.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface RelatedPost {
  id: number
  title: { rendered: string }
  date: string
  uagb_author_info?: {
    display_name: string
    author_link: string
  }
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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const res = await fetch(`/api/sdnblog/related/${currentPostId}`)
        if (!res.ok) throw new Error('Failed to fetch related posts')
        
        const data = await res.json()
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch related posts')
        }
        
        setPosts(data.posts)
      } catch (error) {
        console.error('Error fetching related posts:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch related posts')
      } finally {
        setIsLoading(false)
      }
    }

    if (currentPostId) {
      fetchRelatedPosts()
    }
  }, [currentPostId])

  if (isLoading) return <div className="animate-pulse">Loading...</div>
  if (error) return null
  if (posts.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl md:text-3xl font-seppuri font-bold mb-6">บทความที่เกี่ยวข้อง</h2>
      <div className="grid gap-8">
        {posts.map(post => (
          <Link
            key={post.id}
            href={`/sdnblog/${post.id}`}
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
                  className="text-lg font-seppuri group-hover:text-blue-500 transition-colors mb-2"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{post.uagb_author_info?.display_name}</span>
                  <span>•</span>
                  <time>
                    {new Date(post.date).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}