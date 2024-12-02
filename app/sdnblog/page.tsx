//app/sdnblog/page.tsx
'use client'

import { useState } from 'react'
import PostCard from './components/PostCard'
import { useSearchParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'

interface Post {
  id: number;
  title: { rendered: string };
  date: string;
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ 
      id: number;
      name: string;
    }>>;
    author?: Array<{ 
      name: string;
      avatar_urls?: { [key: string]: string };
    }>;
  };
  featuredImage?: string;
  uagb_excerpt?: string;
  uagb_featured_image_src?: {
    full?: string[];
  };
}

interface APIResponse {
  success: boolean;
  posts: Post[];
  totalPages: number;
  total: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch posts');
  if (!data.success) throw new Error('Invalid response format');
  return data;
};

export default function SDNBlogPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentPage = Number(searchParams.get('page')) || 1
  const [postsPerPage] = useState(12) // จำนวนโพสต์ต่อหน้า
  
  const { data, error, isLoading } = useSWR<APIResponse>(
    `/api/sdnblog?page=${currentPage}&per_page=${postsPerPage}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true
    }
  )

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
            {error.message}
          </p>
        </div>
      </div>
    )
  }

  if (!data?.posts?.length) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">ไม่พบบทความ</h2>
          <p className="text-gray-600 mb-6">ขออภัย ไม่พบบทความที่ต้องการในขณะนี้</p>
          <Link 
            href="/"
            className="inline-flex items-center text-amber-500 hover:text-amber-600"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            กลับสู่หน้าแรก
          </Link>
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
        {data.posts.map((post) => (
          <div 
            key={post.id} 
            className="opacity-0 animate-fade-in max-w-sm mx-auto w-full"
            style={{
              animation: 'fadeIn 0.5s ease-in forwards',
              animationDelay: '0.1s'
            }}
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full
              ${currentPage === 1 
                ? 'bg-amber-100 text-amber-300 cursor-not-allowed' 
                : 'bg-amber-500 text-white hover:bg-amber-600 transition-colors'
              }`}
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-2">
            {Array.from({ length: data.totalPages }).map((_, index) => {
              const pageNumber = index + 1
              if (
                pageNumber === 1 ||
                pageNumber === data.totalPages ||
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
                    aria-label={`Page ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                )
              }
              if (
                (pageNumber === currentPage - 3 && currentPage > 4) ||
                (pageNumber === currentPage + 3 && currentPage < data.totalPages - 3)
              ) {
                return <span key={pageNumber} className="px-2 text-gray-400" aria-hidden="true">...</span>
              }
              return null
            })}
          </div>

          <button
            onClick={() => handlePageChange(Math.min(data.totalPages, currentPage + 1))}
            disabled={currentPage === data.totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full
              ${currentPage === data.totalPages 
                ? 'bg-amber-100 text-amber-300 cursor-not-allowed' 
                : 'bg-amber-500 text-white hover:bg-amber-600 transition-colors'
              }`}
            aria-label="Next page"
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