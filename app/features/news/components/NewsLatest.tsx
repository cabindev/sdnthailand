// app/features/news/components/NewsLatest.tsx
'use client';

import { useEffect, useState } from 'react';
import NewsCardLatest from './NewsCardLatest';
import Link from 'next/link';
import Loading from '@/app/herosection/components/loading/Loading';

interface Post {
  id: number;
  title: { rendered: string };
  date: string;
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      media_details?: {
        sizes?: {
          thumbnail?: { source_url: string };
          medium?: { source_url: string };
          large?: { source_url: string };
        }
      }
    }>;
  };
}

export default function NewsLatest() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/sdnpost?per_page=4');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            <p className="mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">ข่าวและกิจกรรมล่าสุด</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.length > 0 ? (
            posts.map(post => <NewsCardLatest key={post.id} post={post} />)
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              ไม่พบข้อมูลข่าวในขณะนี้
            </div>
          )}
        </div>
        
        {posts.length > 0 && (
          <div className="text-center mt-8">
            <Link 
              href="/sdnpost" 
              className="inline-block px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              ดูข่าวทั้งหมด
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}