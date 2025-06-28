// app/video/components/VideoDetail.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { VideoPost } from '../types';
import RelatedVideos from './RelatedVideos';


const extractYouTubeUrl = (content: string) => {
   const match = content.match(/src="(https:\/\/www\.youtube\.com\/embed\/[^"]+)"/);
   return match ? match[1] : null;
};

const cleanContent = (content: string) => {
   return content.replace(/<figure[^>]*>.*?<div class="wp-block-embed__wrapper">.*?<\/div><\/figure>/g, '');
};

const getFeaturedImage = (video: VideoPost) => {
 if (video.uagb_featured_image_src?.full) {
   return video.uagb_featured_image_src.full[0];
 }
 return video._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/default-thumbnail.jpg';
};

export default function VideoDetail({ video }: { video: VideoPost }) {
 const youtubeUrl = extractYouTubeUrl(video.content.rendered);
 const featuredImage = getFeaturedImage(video);
 const cleanedContent = cleanContent(video.content.rendered);

 return (
   <div className="min-h-screen bg-gray-50">
     {/* Hero Image */}
     {featuredImage && (
       <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh]">
         <img
           src={featuredImage}
           alt={video.title.rendered}
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
       </div>
     )}

     {/* Video Player */}
     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
       <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        

         <div className="p-6">
           {/* Title */}
           <h1 
             className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
             dangerouslySetInnerHTML={{ __html: video.title.rendered }}
           />

           {/* Meta */}
           <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
             {video.uagb_author_info?.display_name && (
               <div className="flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
                 <span>{video.uagb_author_info.display_name}</span>
               </div>
             )}
             <div className="flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               <time dateTime={video.date}>
                 {new Date(video.date).toLocaleDateString('th-TH', {
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                 })}
               </time>
             </div>
           </div>

           {/* Content */}
           <div 
             className="prose prose-lg max-w-none
               prose-headings:font-bold prose-headings:text-gray-900
               prose-p:text-gray-600 prose-p:leading-relaxed
               prose-a:text-orange-500 hover:prose-a:text-orange-600
               prose-img:rounded-xl prose-img:shadow-lg"
             dangerouslySetInnerHTML={{ __html: cleanedContent }}
           />
         </div>
       </div>

       {/* Related Videos */}
       <div className="mt-12">
         <h2 className="text-2xl font-bold text-gray-900 mb-6">
           วิดีโอที่เกี่ยวข้อง
         </h2>
         <Suspense fallback={<div>กำลังโหลด...</div>}>
           <RelatedVideos currentVideoId={video.id} />
         </Suspense>
       </div>

       {/* Back Link */}
       <div className="mt-8 pt-6 border-t">
         <Link 
           href="/video"
           className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
         >
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
           </svg>
           กลับไปหน้าวิดีโอทั้งหมด
         </Link>
       </div>
     </div>
   </div>
 );
}