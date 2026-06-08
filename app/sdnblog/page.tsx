//app/sdnblog/page.tsx
'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'
import BlogCard from './components/BlogCard'

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

function SDNBlogPageContent() {
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
          <span className="inline-flex items-center gap-2" role="status" aria-label="กำลังโหลด">
            <span className="h-3 w-3 animate-bounce rounded-full bg-[#ff7834] [animation-delay:-0.3s] motion-reduce:animate-none" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-[#ff7834] [animation-delay:-0.15s] motion-reduce:animate-none" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-[#ff7834] motion-reduce:animate-none" />
          </span>
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
            className="inline-flex items-center text-[#ff7834] hover:text-[#e86b2a]"
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
        <div className="w-24 h-1 bg-[#ff7834] mx-auto mb-4"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          บทความและเรื่องราวที่น่าสนใจจาก SDN Thailand
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.posts.map((post) => (
          <div
            key={post.id}
            className="mx-auto w-full max-w-sm animate-fade-in motion-reduce:animate-none"
          >
            <BlogCard post={post} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7834]/50 focus-visible:ring-offset-2
              ${currentPage === 1 
                ? 'bg-[#ff7834]/10 text-[#ff7834]/40 cursor-not-allowed' 
                : 'bg-[#ff7834] text-white hover:bg-[#e86b2a] transition-colors'
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
                    className={`w-10 h-10 flex items-center justify-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7834]/50 focus-visible:ring-offset-2
                      ${currentPage === pageNumber
                        ? 'bg-[#ff7834] text-white'
                        : 'bg-white text-[#ff7834] border border-[#ff7834] hover:bg-[#ff7834]/5'
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
            className={`w-10 h-10 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7834]/50 focus-visible:ring-offset-2
              ${currentPage === data.totalPages 
                ? 'bg-[#ff7834]/10 text-[#ff7834]/40 cursor-not-allowed' 
                : 'bg-[#ff7834] text-white hover:bg-[#e86b2a] transition-colors'
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

export default function SDNBlogPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20">
          <div className="flex justify-center items-center min-h-[60vh]">
            <span className="loading loading-dots loading-lg text-[#ff7834]" />
          </div>
        </div>
      }
    >
      <SDNBlogPageContent />
    </Suspense>
  )
}