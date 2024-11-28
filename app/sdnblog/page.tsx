//app/sdnblog/page.tsx
'use client'

import { useEffect, useState } from 'react'
import PostCard from './components/PostCard'
import { useSearchParams, useRouter } from 'next/navigation'

interface Post {
  id: number;
  title: { rendered: string };
  date: string;
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ 
      id: number;     // เพิ่ม id ที่หายไป
      name: string;
    }>>;
    author?: Array<{ 
      name: string;
      avatar_urls?: { [key: string]: string };
    }>;
  };
  featuredImage?: string;
}

export default function SDNBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentPage = Number(searchParams.get('page')) || 1

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/sdnblog?page=${currentPage}`)
        if (!res.ok) throw new Error('Failed to fetch blog posts')
        const data = await res.json()
        setPosts(data.posts)
        setTotalPages(data.totalPages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    router.push(`/sdnblog?page=${page}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center gap-6 min-h-[60vh]">
          <span className="loading loading-dots loading-lg text-amber-500"></span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto bg-red-50 text-red-500 p-4 rounded-lg">
          <p className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          SDN Thailand Blog
        </h1>
        <div className="w-24 h-1 bg-amber-500 mx-auto mb-4"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          บทความและเรื่องราวที่น่าสนใจจาก SDN Thailand
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="opacity-0 animate-fade-in max-w-sm mx-auto w-full">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full
              ${currentPage === 1 
                ? 'bg-amber-100 text-amber-300 cursor-not-allowed' 
                : 'bg-amber-500 text-white hover:bg-amber-600 transition-colors'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg
                      ${currentPage === pageNumber
                        ? 'bg-amber-500 text-white'
                        : 'bg-white text-amber-500 border border-amber-500 hover:bg-amber-50'
                      }`}
                  >
                    {pageNumber}
                  </button>
                )
              }
              if (
                (pageNumber === currentPage - 3 && currentPage > 4) ||
                (pageNumber === currentPage + 3 && currentPage < totalPages - 3)
              ) {
                return <span key={pageNumber} className="px-2 text-gray-400">...</span>
              }
              return null
            })}
          </div>

          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full
              ${currentPage === totalPages 
                ? 'bg-amber-100 text-amber-300 cursor-not-allowed' 
                : 'bg-amber-500 text-white hover:bg-amber-600 transition-colors'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}