'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useBlogPosts } from '../hooks/useBlogPosts';
import BlogCard from './BlogCard';

function BlogContent() {
  const { posts, isLoading, error } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="mt-8 animate-pulse space-y-4">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="mt-2 text-red-600">{error}</p>;
  }

  if (!posts?.length) {
    return <p className="mt-2 text-gray-600">ไม่พบบทความในขณะนี้</p>;
  }

  return (
    <div className="space-y-8">
      {posts[0] && <BlogCard post={posts[0]} isLarge />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(1, 4).map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default function BlogList() {
  return (
    <section className="py-12 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-800">
            Featured Articles
          </h2>
          <h2 className="text-3xl font-bold text-gray-900">บทความ</h2>
          <p className="mt-2 text-gray-600">เรื่องราวดีดีจาก ผู้คน และวัฒนธรรม</p>
        </div>

        <Suspense fallback={<BlogContent />}>
          <BlogContent />
        </Suspense>

        <div className="text-center mt-8">
          <Link
            href="/sdnblog"
            className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
          >
            อ่านบทความทั้งหมด
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}