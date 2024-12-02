// app/sdnpost/[id]/PostDetail.tsx
'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { FaEye } from 'react-icons/fa'
import { Post } from '../types'
import TextToSpeechControls from '../components/TextToSpeechControls'
import ShareButtons from '../components/ShareButtons'
import RelatedPosts from '../components/RelatedPosts'
import LoadingSpinner from '../components/LoadingSpinner'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sdnthailand.com/'

interface ErrorMessageProps {
  message: string
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

interface PostDetailProps {
  params: {
    id: string
  }
}

export default function PostDetail({ params }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoadingPost, setIsLoadingPost] = useState(true)
  const [isLoadingViews, setIsLoadingViews] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewIncremented, setViewIncremented] = useState(false)

  // Memoized values
  const author = useMemo(() => post?._embedded?.author?.[0], [post])
  const categories = useMemo(() => post?._embedded?.['wp:term']?.[0] || [], [post])
  const featuredMedia = useMemo(() => post?._embedded?.['wp:featuredmedia']?.[0], [post])
  const featuredImage = useMemo(() => 
    featuredMedia?.source_url || 
    featuredMedia?.media_details?.sizes?.full?.source_url,
    [featuredMedia]
  )

  const shareUrl = `${BASE_URL}/sdnpost/${params.id}`

  useEffect(() => {
    let isMounted = true

    const getPost = async () => {
      if (!params.id) {
        setError('ไม่พบรหัสบทความ')
        setIsLoadingPost(false)
        return
      }

      try {
        setIsLoadingPost(true)
        setError(null)

        const response = await fetch(`/api/sdnpost/${params.id}`)
        
        if (!response.ok) {
          throw new Error(`ไม่สามารถโหลดบทความได้ (${response.status})`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'ไม่สามารถโหลดบทความได้')
        }

        if (isMounted && result.data) {
          setIsLoadingViews(true)
          try {
            const viewResponse = await fetch(`/api/sdnpost/views/${params.id}`)
            const viewData = await viewResponse.json()

            setPost({
              ...result.data,
              viewCount: viewData.count || 0
            })

            if (!viewIncremented) {
              const incrementResponse = await fetch(
                `/api/sdnpost/views/${params.id}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              )

              if (incrementResponse.ok) {
                const incrementData = await incrementResponse.json()
                setViewIncremented(true)
                setPost(prev => prev ? {
                  ...prev,
                  viewCount: incrementData.count || prev.viewCount || 0
                } : null)
              }
            }
          } catch (viewErr) {
            console.error('Error handling views:', viewErr)
          } finally {
            setIsLoadingViews(false)
          }

          // Update view count every minute
          const intervalId = setInterval(async () => {
            if (isMounted) {
              try {
                const refreshResponse = await fetch(`/api/sdnpost/views/${params.id}`)
                const refreshData = await refreshResponse.json()
                
                setPost(prev => prev ? {
                  ...prev,
                  viewCount: refreshData.count || prev.viewCount
                } : null)
              } catch (refreshErr) {
                console.error('Error refreshing view count:', refreshErr)
              }
            }
          }, 60000)

          return () => clearInterval(intervalId)
        }

      } catch (err) {
        if (isMounted) {
          console.error('Error fetching post:', err)
          setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดบทความได้')
        }
      } finally {
        if (isMounted) {
          setIsLoadingPost(false)
        }
      }
    }

    getPost()

    return () => {
      isMounted = false
    }
  }, [params.id, viewIncremented])

  if (isLoadingPost) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!post) return <ErrorMessage message="ไม่พบบทความ" />

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
        {/* Loading indicator */}
        {isLoadingViews && (
          <div className="absolute top-0 left-0 w-full h-1">
            <div className="h-full bg-orange-500 animate-pulse" />
          </div>
        )}

        <Toaster />
        
        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
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
                className="text-2xl md:text-4xl font-seppuri font-bold mb-4 leading-relaxed text-gray-800"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />

              {/* Author and View Count */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200 gap-4">
                <div className="flex items-center gap-4">
                  {author?.avatar_urls?.['96'] && (
                    <div className="w-10 md:w-12 h-10 md:h-12 rounded-full overflow-hidden">
                      <img 
                        src={author.avatar_urls['96']}
                        alt={author.name || ''}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.onerror = null
                          target.src = '/images/default-avatar.png'
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-ibm font-medium text-gray-800 text-sm md:text-base">
                      {author?.name || 'ไม่ระบุผู้เขียน'}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <FaEye className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-ibm text-sm md:text-base">
                    {post.viewCount?.toLocaleString()} ครั้ง
                  </span>
                </div>
              </div>

              {/* Text to Speech */}
              <div className="flex-1">
                <TextToSpeechControls
                  text={post.content.rendered.replace(/<[^>]*>/g, '')}
                />
              </div>

              {/* Featured Image */}
              {featuredImage && (
                <div className="mb-8 md:mb-10 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={featuredImage}
                    alt={post.title.rendered}
                    className="w-full h-auto"
                    loading="eager"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.onerror = null
                      target.src = '/images/default-featured.png'
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-base md:prose-lg max-w-none
                  prose-headings:font-seppuri prose-headings:text-gray-800
                  prose-h1:text-2xl md:prose-h1:text-4xl
                  prose-h2:text-xl md:prose-h2:text-3xl
                  prose-h3:text-lg md:prose-h3:text-2xl
                  prose-p:font-ibm prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-a:text-orange-500 hover:prose-a:text-orange-600
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-img:w-full prose-img:max-w-3xl prose-img:mx-auto
                  prose-img:h-auto prose-img:object-cover
                  prose-strong:text-gray-800
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:font-ibm prose-li:text-gray-600
                  mb-8 md:mb-12
                  [&>*]:mx-auto [&>*]:max-w-3xl"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />

              {/* Related Posts */}
              <RelatedPosts currentPostId={post.id} />

              {/* Back Button */}
              <div className="mt-8 md:mt-12 pt-8 border-t border-gray-200">
                <Link 
                  href="/sdnpost"
                  className="inline-flex items-center gap-2 text-orange-100 hover:text-orange-300 transition-colors text-sm md:text-base"
                >
                  <span className="inline-flex items-center gap-2 font-ibm text-sm md:text-base bg-gradient-to-r from-orange-300 to-orange-400 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    ข่าวทั้งหมด
                  </span>
                </Link>
              </div>
            </div>
            {/* Share Buttons */}
            <div className="hidden md:block w-16">
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
    </Suspense>
  )
}