// app/features/news/components/NewsLatest.tsx
'use client';

import { useEffect, useState } from 'react';
import NewsCardLatest from './NewsCardLatest';
import Link from 'next/link';

interface Post {
  id: number;
  title: { rendered: string };
  date: string;
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
  featuredImage?: string;
}

interface PostsResponse {
  posts: Post[];
  totalPages: number;
  total: number;
}

function NewsLatestContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/sdnpost?per_page=4');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: PostsResponse = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-[16/10] rounded-2xl mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {posts?.map((post) => (
          <NewsCardLatest key={post.id} post={post} />
        ))}
      </div>
      
      <div className="text-center">
        <Link 
          href="/sdnpost" 
          className="inline-block px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300"
        >
          ดูข่าวทั้งหมด
        </Link>
      </div>
    </div>
  );
}

export default function NewsLatest() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">ข่าวและกิจกรรมล่าสุด</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4"></div>
        </div>

        <NewsLatestContent />
      </div>
    </section>
  );
}