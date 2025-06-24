// app/sdnpost/components/post-detail/PostDetail.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { Post } from '../../types'
import SimpleTTS from './SimpleTTS'
import ShareButtons from './ShareButtons'
import RelatedPosts from '../RelatedPosts'
import ViewCounter from './ViewCounter'
import LoadingSpinner from '../LoadingSpinner'
import SafeImage from '../SafeImage'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sdnthailand.com'

interface PostDetailProps {
 post: Post
}

export default function PostDetail({ post }: PostDetailProps) {
 const author = post._embedded?.author?.[0]
 const categories = post._embedded?.['wp:term']?.[0] || []
 const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]
 const featuredImage = featuredMedia?.source_url || 
   featuredMedia?.media_details?.sizes?.full?.source_url
 
 const shareUrl = `${BASE_URL}/sdnpost/${post.id}`

 const cleanTextForTTS = (html: string) => {
   return html
     .replace(/<[^>]*>/g, '')
     .replace(/&nbsp;/g, ' ')
     .replace(/&amp;/g, '&')
     .replace(/&lt;/g, '<')
     .replace(/&gt;/g, '>')
     .replace(/&quot;/g, '"')
     .replace(/&#39;/g, "'")
     .replace(/\s+/g, ' ')
     .trim()
 }

 const ttsText = cleanTextForTTS(post.content.rendered)

 return (
   <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
     <Toaster />
     
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

           {/* Title with TTS Icon */}
           <div className="flex items-start gap-3 mb-4">
             <h1 
               className="text-2xl md:text-4xl font-seppuri font-bold leading-relaxed text-gray-800 flex-1"
               dangerouslySetInnerHTML={{ __html: post.title.rendered }}
             />
             <SimpleTTS text={ttsText} />
           </div>

           {/* Author and Date */}
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200 gap-4">
             <div className="flex items-center gap-4">
               {author?.avatar_urls?.['96'] && (
                 <div className="w-10 md:w-12 h-10 md:h-12 rounded-full overflow-hidden">
                   <SafeImage 
                     src={author.avatar_urls['96']}
                     alt={author.name || ''}
                     className="w-full h-full object-cover"
                     defaultSrc="/images/default-avatar.png"
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
           </div>

           {/* Featured Image */}
           {featuredImage && (
             <div className="mb-8 md:mb-10 rounded-xl overflow-hidden shadow-lg">
               <SafeImage
                 src={featuredImage}
                 alt={post.title.rendered}
                 className="w-full h-auto"
                 loading="eager"
                 defaultSrc="/images/default-featured.png"
               />
             </div>
           )}

           {/* Content - ปรับแต่งให้ตัวหนังสือบางและเล็ก */}
           <div 
             className="prose prose-sm md:prose-base max-w-none
               prose-headings:font-seppuri prose-headings:text-gray-800 prose-headings:font-semibold
               prose-h1:text-xl md:prose-h1:text-3xl prose-h1:font-medium
               prose-h2:text-lg md:prose-h2:text-2xl prose-h2:font-medium
               prose-h3:text-base md:prose-h3:text-xl prose-h3:font-medium
               prose-p:font-ibm prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-light prose-p:text-sm md:prose-p:text-base
               prose-a:text-orange-500 hover:prose-a:text-orange-600 prose-a:font-light
               prose-img:rounded-xl prose-img:shadow-lg
               prose-img:w-full prose-img:max-w-3xl prose-img:mx-auto
               prose-img:h-auto prose-img:object-cover
               prose-strong:text-gray-800 prose-strong:font-medium
               prose-ul:list-disc prose-ol:list-decimal
               prose-li:font-ibm prose-li:text-gray-600 prose-li:font-light prose-li:text-sm md:prose-li:text-base
               prose-blockquote:border-orange-200 prose-blockquote:text-gray-600 prose-blockquote:font-light prose-blockquote:text-sm md:prose-blockquote:text-base
               prose-code:bg-gray-100 prose-code:text-gray-700 prose-code:font-light prose-code:text-xs md:prose-code:text-sm
               text-sm md:text-base font-light leading-relaxed
               mb-8 md:mb-12
               [&>*]:mx-auto [&>*]:max-w-3xl"
             dangerouslySetInnerHTML={{ __html: post.content.rendered }}
           />

           {/* View Counter */}
           <ViewCounter 
             postId={post.id.toString()} 
             initialCount={post.viewCount || 0} 
           />
             
           {/* Related Posts */}
           <Suspense fallback={<LoadingSpinner />}>
             <RelatedPosts currentPostId={post.id} />
           </Suspense>

           {/* Back Button */}
           <div className="mt-8 md:mt-12 pt-8 border-t border-gray-200">
             <Link 
               href="/sdnpost"
               className="inline-flex items-center gap-2 font-ibm text-sm md:text-base bg-gradient-to-r from-orange-300 to-orange-400 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
             >
               ข่าวทั้งหมด
             </Link>
           </div>
         </div>

         {/* Desktop Share Buttons */}
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
 )
}