// NewsCardLatest.tsx
'use client';

import Link from 'next/link';
import { NewsPost } from '../types/news.types';

interface NewsCardLatestProps {
  post: NewsPost;
}

export default function NewsCardLatest({ post }: NewsCardLatestProps) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/default-featured.png';
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name;

  return (
    <Link href={`/sdnpost/${post.id}`} className="block h-full">
      <div className="group bg-white rounded-2xl overflow-hidden shadow h-full">
        <div className="relative aspect-[18/10] overflow-hidden">
          <img
            src={featuredImage}
            alt={post.title.rendered}
            className="w-full h-full object-contain"
            loading="lazy"
          />
          
          {category && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white text-sm px-3 py-1 rounded-full">
              {category}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 
            className="text-base font-bold text-gray-800 line-clamp-2 mb-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          
          <div 
            className="text-sm text-gray-600 line-clamp-2 mb-3"
            dangerouslySetInnerHTML={{ 
              __html: post.excerpt.rendered.replace(/<[^>]*>/g, '')
            }}
          />

          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <time className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
            <span className="text-sm text-orange-500 font-medium">
              อ่านเพิ่มเติม
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}