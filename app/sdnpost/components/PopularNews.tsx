// app/sdnpost/components/PopularNews.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Post {
 id: number;
 title: { rendered: string };
 date: string;
 excerpt: { rendered: string };
 _embedded?: {
   'wp:featuredmedia'?: Array<{ source_url: string }>;
   'wp:term'?: Array<Array<{ name: string }>>;
   author?: Array<{ name: string }>;
 };
 featuredImage?: string;
}

export default function PopularNews() {
 const [posts, setPosts] = useState<Post[]>([])
 const [currentIndex, setCurrentIndex] = useState(0)
 const [isLoading, setIsLoading] = useState(true)
 const [error, setError] = useState<string | null>(null)

 const nextSlide = useCallback(() => {
   setCurrentIndex((prev) => (prev + 1) % posts.length)
 }, [posts.length])

 const prevSlide = () => {
   setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)
 }

 useEffect(() => {
   const timer = setInterval(() => {
     nextSlide()
   }, 5000)

   return () => clearInterval(timer)
 }, [nextSlide])

 useEffect(() => {
   const fetchLatestPosts = async () => {
     setIsLoading(true)
     setError(null)
     try {
       const res = await fetch('/api/sdnpost?page=1&per_page=9') // ดึง 9 โพสต์ล่าสุด
       if (!res.ok) throw new Error('Failed to fetch posts')
       const data = await res.json()
       setPosts(data.posts)
     } catch (err) {
       setError(err instanceof Error ? err.message : 'An error occurred')
     } finally {
       setIsLoading(false)
     }
   }
   fetchLatestPosts()
 }, [])

 if (isLoading) {
   return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       <div className="flex justify-center items-center h-[400px]">
         <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
       </div>
     </div>
   )
 }

 if (error || posts.length === 0) {
   return null
 }

 return (
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
     <div className="flex justify-between items-center mb-8">
       <h2 className="text-2xl font-bold border-b-2 border-orange-500 pb-2 inline-block">
         ข่าวล่าสุด
       </h2>
       <Link 
         href="/sdnpost"
         className="text-orange-500 hover:text-orange-600 transition-colors font-medium"
       >
         ดูข่าวทั้งหมด
       </Link>
     </div>
     
     <div className="relative">
       <div className="flex gap-6 overflow-hidden">
         {posts.map((post, index) => {
           const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/default.jpg'
           const formattedDate = new Date(post.date).toLocaleDateString('th-TH', {
             day: 'numeric',
             month: 'short',
             year: 'numeric'
           })

           return (
             <Link 
               key={post.id}
               href={`/sdnpost/${post.id}`}
               className={`flex-shrink-0 w-full md:w-1/3 relative transition-all duration-300`}
               style={{
                 transform: `translateX(-${currentIndex * 100}%)`
               }}
             >
               <div className="group">
                 <div className="relative aspect-video overflow-hidden rounded-lg">
                   <Image
                     src={imageUrl}
                     alt={post.title.rendered}
                     fill
                     className="object-cover group-hover:scale-105 transition-transform duration-300"
                   />
                 </div>
                 <div className="mt-4">
                   <div className="text-sm text-orange-500 mb-2">{formattedDate}</div>
                   <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-orange-500 transition-colors" 
                       dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                 </div>
               </div>
             </Link>
           )
         })}
       </div>

       {posts.length > 1 && (
    <>
      {/* ปุ่มซ้าย */}
      <div
        onClick={prevSlide}
        className="absolute -left-4 top-[50%] -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg z-10 cursor-pointer hover:bg-gray-50"
        role="button"
        tabIndex={0}
      >
        <span className="sr-only">Previous</span>
        <svg 
          className="w-4 h-4 text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </div>

      {/* ปุ่มขวา */}
      <div
        onClick={nextSlide}
        className="absolute -right-4 top-[50%] -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg z-10 cursor-pointer hover:bg-gray-50"
        role="button"
        tabIndex={0}
      >
        <span className="sr-only">Next</span>
        <svg 
          className="w-4 h-4 text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {/* Indicators */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
        {posts.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            role="button"
            tabIndex={0}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer
              ${currentIndex === index 
                ? 'bg-orange-500 w-6' 
                : 'bg-gray-300 hover:bg-orange-300'
              }`}
          />
        ))}
      </div>
    </>
       )}
     </div>
   </div>
 )
}