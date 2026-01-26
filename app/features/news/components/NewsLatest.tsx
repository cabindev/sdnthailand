import { useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { IoRefresh } from 'react-icons/io5';
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

interface NewsData {
  posts: Post[];
  totalPages: number;
  total: number;
}

const fetcher = async (url: string): Promise<NewsData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const API_URL = '/api/sdn-latest?per_page=4';

export default function NewsLatest() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, error, isLoading } = useSWR<NewsData>(API_URL, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // ลดจาก 5 นาที เป็น 30 วินาที
    revalidateIfStale: true, // เปิดให้ revalidate เมื่อข้อมูลเก่า
    revalidateOnReconnect: false
  });

  const posts = useMemo(() => data?.posts || [], [data?.posts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate(API_URL);
    setIsRefreshing(false);
  };
  // เพิ่มเช็ค loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">ข่าวและกิจกรรมล่าสุด</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            <p className="mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
            <button
              type="button"
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

  // แสดงผลเมื่อโหลดเสร็จแล้วและมีข้อมูล
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">ข่าวและกิจกรรมล่าสุด</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4"></div>
        </div>

        {/* Refresh button */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-100 rounded-full transition-colors disabled:opacity-50"
            title="รีเฟรชข้อมูล"
          >
            <IoRefresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'กำลังโหลด...' : 'รีเฟรช'}</span>
          </button>
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