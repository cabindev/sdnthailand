// app/sdnblog/[id]/BlogPostDetail.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { Post } from '../../types'
import TextToSpeechControls from './TextToSpeechControls'
import ShareButtons from './ShareButtons'
import RelatedBlogPosts from '../RelatedBlogPosts'
import ViewCounter from './ViewCounter'
import SafeImage from '../SafeImage'
import LoadingSpinner from '../LoadingSpinner'


const BASE_URL = 'https://sdnthailand.com'

interface BlogPostDetailProps {
  post: Post
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  const categories = post._embedded?.['wp:term']?.[0] || []
  const authorName = post.uagb_author_info?.display_name
  const authorLink = post.uagb_author_info?.author_link
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const shareUrl = `${BASE_URL}/sdnblog/${post.id}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      {featuredImage && (
        <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] mb-4 sm:mb-6 md:mb-8">
          <SafeImage
            src={featuredImage}
            alt={post.title.rendered}
            className="w-full h-full object-cover"
            loading="eager"
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
              
              
            </div>

            {/* Text to Speech Controls */}
            <div className="flex-1">
              <TextToSpeechControls text={post.content.rendered.replace(/<[^>]*>/g, '')} />
            </div>

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

              <ViewCounter postId={post.id.toString()} initialCount={post.viewCount || 0} />

            {/* Related Posts */}
            <Suspense fallback={<LoadingSpinner />}>
              <RelatedBlogPosts currentPostId={post.id} />
            </Suspense>

            {/* Back Link */}
            <div className="mt-8 md:mt-12 pt-8 border-t border-gray-200">
              <Link 
                href="/sdnblog"
                className="inline-flex items-center gap-2 font-ibm text-sm md:text-base bg-gradient-to-r from-orange-300 to-orange-400 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                บทความทั้งหมด
              </Link>
            </div>

            {/* Desktop Share Buttons */}
            <div className="hidden md:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-50">
              <ShareButtons url={shareUrl} title={post.title.rendered} />
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