// BlogList.tsx
import useSWR from 'swr';
import Link from 'next/link';
import BlogCard from './BlogCard';

interface BlogPost {
  id: number;
  title: {
    rendered: string;
  };
  uagb_excerpt: string;
  uagb_featured_image_src?: {
    full?: string[];
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      media_details?: {
        sizes?: {
          full?: { source_url: string };
          large?: { source_url: string };
          medium_large?: { source_url: string };
        };
      };
    }>;
  };
}

interface BlogResponse {
  success: boolean;
  posts: BlogPost[];
  totalPages: number;
  total: number;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

function BlogContent() {
  const { data, error, isLoading } = useSWR<BlogResponse>(
    '/api/sdnblog?per_page=4&_embed=1', // เพิ่ม _embed=1 เพื่อให้ได้ข้อมูลภาพครบถ้วน
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      revalidateIfStale: false,
      revalidateOnReconnect: false
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-12">
        {/* Large card skeleton */}
        <div className="animate-pulse bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="md:flex">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-[250px] md:h-[450px] md:w-2/3"></div>
            <div className="p-6 md:w-1/3 bg-orange-50">
              <div className="h-8 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="mt-4 h-6 w-1/3 bg-orange-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Smaller cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 aspect-video"></div>
              <div className="p-4 bg-orange-50">
                <div className="h-6 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-4 w-1/3 bg-orange-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg">Failed to load blog posts</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  const posts = data?.posts || [];

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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Featured Articles
          </h2>
          <h2 className="text-3xl font-bold text-gray-900">บทความ</h2>
          <p className="mt-2 text-gray-600">เรื่องราวดีดีจาก ผู้คน และวัฒนธรรม</p>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4" />
        </div>

        <BlogContent />

        <div className="text-center mt-12">
          <Link
            href="/sdnblog"
            className="inline-flex items-center px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>อ่านบทความทั้งหมด</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}