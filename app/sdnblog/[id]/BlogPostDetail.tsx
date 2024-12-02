// app/sdnblog/[id]/BlogPostDetail.tsx
'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { FaEye } from 'react-icons/fa'
import { Post } from '../types'
import TextToSpeechControls from '../components/TextToSpeechControls'
import ShareButtons from '../components/ShareButtons'
import RelatedPosts from '../components/RelatedPosts'
import LoadingSpinner from '../components/LoadingSpinner'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://blog.sdnthailand.com/'

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-lg mx-auto bg-red-50 text-red-500 p-4 rounded-lg">
        <p className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {message}
        </p>
      </div>
    </div>
  )
}

interface BlogPostDetailProps {
  params: {
    id: string;
  }
}

export default function BlogPostDetail({ params }: BlogPostDetailProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewIncremented, setViewIncremented] = useState(false)

  // Memoized values
  const categories = useMemo(() => post?._embedded?.['wp:term']?.[0] || [], [post])
  const authorName = useMemo(() => post?.uagb_author_info?.display_name, [post])
  const authorLink = useMemo(() => post?.uagb_author_info?.author_link, [post])
  const featuredImage = useMemo(() => 
    post?._embedded?.['wp:featuredmedia']?.[0]?.source_url, 
    [post]
  )
  const shareUrl = useMemo(() => `${BASE_URL}/sdnblog/${params.id}`, [params.id])

  useEffect(() => {
    let isMounted = true
  
    const getPost = async () => {
      if (!params.id) {
        setError('ไม่พบรหัสบทความ')
        setIsLoading(false)
        return
      }
      
      try {
        const [postResponse, viewResponse] = await Promise.all([
          fetch(`/api/sdnblog/${params.id}`),
          fetch(`/api/sdnblog/views/${params.id}`)
        ])
        
        if (!postResponse.ok) {
          throw new Error(`ไม่สามารถโหลดบทความได้ (${postResponse.status})`)
        }
        
        const postResult = await postResponse.json()
        const viewResult = await viewResponse.json()
        
        if (!postResult.success) {
          throw new Error(postResult.error || 'ไม่สามารถโหลดบทความได้')
        }
        
        if (isMounted) {
          setPost({
            ...postResult.data,
            viewCount: viewResult.count
          })
          
          if (!viewIncremented) {
            try {
              const incrementResponse = await fetch(
                `/api/sdnblog/views/${params.id}`, 
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' }
                }
              )
              
              if (incrementResponse.ok) {
                const incrementResult = await incrementResponse.json()
                setViewIncremented(true)
                setPost(prev => prev ? {
                  ...prev,
                  viewCount: incrementResult.count
                } : null)
              }
            } catch (error) {
              console.error('Error incrementing views:', error)
            }
          }
          
          // Update views every 60 seconds
          const intervalId = setInterval(async () => {
            if (isMounted) {
              try {
                const refreshResponse = await fetch(`/api/sdnblog/views/${params.id}`)
                const refreshResult = await refreshResponse.json()
                if (refreshResult.success) {
                  setPost(prev => prev ? {
                    ...prev,
                    viewCount: refreshResult.count
                  } : null)
                }
              } catch (error) {
                console.error('Error refreshing views:', error)
              }
            }
          }, 60000)

          return () => clearInterval(intervalId)
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'ไม่สามารถโหลดบทความได้')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    getPost()
    
    return () => {
      isMounted = false
    }
  }, [params.id, viewIncremented])

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!post) return <ErrorMessage message="ไม่พบบทความ" />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      {featuredImage && (
        <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] mb-4 sm:mb-6 md:mb-8">
          <img
            src={featuredImage}
            alt={post.title.rendered}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/images/default-featured.png'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 -mt-16 sm:-mt-20 md:-mt-28 lg:-mt-32 relative z-10">
        <Toaster />
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                {categories.map(cat => (
                  <span
                    key={cat.id}
                    className="bg-orange-50 text-orange-600 text-xs md:text-sm px-3 py-1 rounded-full"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 
              className="text-xl sm:text-2xl md:text-4xl font-seppuri font-bold mb-4 leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Author & View Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200 gap-4">
              <div className="flex items-center gap-4">
                {authorLink ? (
                  <Link 
                    href={authorLink}
                    className="font-ibm font-medium text-gray-800 text-sm md:text-base hover:text-orange-500 transition-colors"
                  >
                    {authorName || 'ไม่ระบุผู้เขียน'}
                  </Link>
                ) : (
                  <div className="font-ibm font-medium text-gray-800 text-sm md:text-base">
                    {authorName || 'ไม่ระบุผู้เขียน'}
                  </div>
                )}
                <div className="text-xs md:text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <FaEye className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-ibm text-sm md:text-base">
                  {post.viewCount?.toLocaleString() || '0'} ครั้ง
                </span>
              </div>
            </div>

            {/* Text to Speech Controls */}
            <TextToSpeechControls 
              text={post.content.rendered.replace(/<[^>]*>/g, '')} 
            />

            {/* Main Content */}
            <div 
              className="prose prose-sm sm:prose-base md:prose-lg max-w-none
                prose-headings:font-seppuri prose-headings:text-gray-800
                prose-h1:text-xl sm:prose-h1:text-2xl md:prose-h1:text-4xl
                prose-h2:text-lg sm:prose-h2:text-xl md:prose-h2:text-3xl
                prose-h3:text-base sm:prose-h3:text-lg md:prose-h3:text-2xl
                prose-p:font-ibm prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-orange-500 hover:prose-a:text-orange-600
                prose-img:rounded-xl prose-img:shadow-lg
                prose-img:w-full prose-img:max-w-3xl prose-img:mx-auto
                prose-img:h-auto prose-img:object-cover
                prose-strong:text-gray-800
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:font-ibm prose-li:text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            {/* Related Posts */}
            <RelatedPosts currentPostId={post.id} />

            {/* Back Link */}
            <div className="mt-8 md:mt-12 pt-8 border-t border-gray-200">
              <Link 
                href="/sdnblog"
                className="inline-flex items-center gap-2"
              >
                <span className="inline-flex items-center gap-2 font-ibm text-sm md:text-base bg-gradient-to-r from-orange-300 to-orange-400 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  บทความทั้งหมด
                </span>
              </Link>
            </div>

            {/* Share Buttons */}
            <div className="hidden md:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-50">
            <ShareButtons 
                url={shareUrl}
                title={post.title.rendered}
            />
            </div>

            {/* Mobile Share Buttons */}
            <div className="block md:hidden w-full">
            <ShareButtons 
                url={shareUrl}
                title={post.title.rendered}
                isMobile={true}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}