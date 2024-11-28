// NewsCard.tsx
import Link from 'next/link';
import { NewsPost } from '../types/news.types';

interface NewsCardProps {
 post: NewsPost;
}

export default function NewsCard({ post }: NewsCardProps) {
 const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/default-featured.png';
 const category = post._embedded?.['wp:term']?.[0]?.[0]?.name;

 return (
   <Link href={`/sdnpost/${post.id}`} className="block h-full">
     <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full">
       {/* รูปภาพ */}
       <div className="relative aspect-video">
         <img
           src={featuredImage}
           alt={post.title.rendered}
           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
           loading="lazy"
         />
         
         {/* Category */}
         {category && (
           <span className="absolute top-4 left-4 bg-orange-500 text-white text-sm px-4 py-1 rounded-full">
             {category}
           </span>
         )}
       </div>

       {/* เนื้อหา */}
       <div className="p-6">
         <h3 
           className="text-xl font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-orange-500 transition-colors"
           dangerouslySetInnerHTML={{ __html: post.title.rendered }}
         />
         
         <div 
           className="text-base text-gray-600 line-clamp-3 mb-4"
           dangerouslySetInnerHTML={{ 
             __html: post.excerpt.rendered.replace(/<[^>]*>/g, '')
           }}
         />

         <div className="flex justify-between items-center">
           <div className="text-sm text-gray-500">
             {new Date(post.date).toLocaleDateString('th-TH', {
               year: 'numeric',
               month: 'short',
               day: 'numeric',
             })}
           </div>
           <span className="text-sm text-orange-500">อ่านเพิ่มเติม →</span>
         </div>
       </div>
     </div>
   </Link>
 );
}