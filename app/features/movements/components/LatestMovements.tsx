'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { IoPlayCircle, IoArrowForward } from 'react-icons/io5';

type MovementType = 'blog' | 'news' | 'video';

interface MovementItem {
  id: number;
  type: MovementType;
  title: string;
  excerpt: string;
  image: string;
  date: string; // ISO date string
  href: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const SWR_OPTIONS = {
  revalidateOnFocus: false,
  dedupingInterval: 30000,
  revalidateIfStale: true,
  revalidateOnReconnect: false,
};

// แหล่งข้อมูลทั้ง 3 — ดึงเผื่อไว้แหล่งละ 6 ชิ้นเพื่อให้ฟีดรวมมีตัวเลือกหลากหลาย
const BLOG_URL = '/api/sdnblog?per_page=6&_embed=1';
const NEWS_URL = '/api/sdn-latest?per_page=6';
const VIDEO_URL = '/api/video?per_page=6';

const TYPE_META: Record<MovementType, { label: string; badge: string; chip: string }> = {
  blog: { label: 'บทความ', badge: 'bg-[#ff7834]', chip: 'bg-[#ff7834] text-white' },
  news: { label: 'ข่าว', badge: 'bg-blue-600', chip: 'bg-blue-600 text-white' },
  video: { label: 'วิดีโอ', badge: 'bg-red-600', chip: 'bg-red-600 text-white' },
};

const FILTERS: Array<{ key: 'all' | MovementType; label: string }> = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'blog', label: 'บทความ' },
  { key: 'news', label: 'ข่าว' },
  { key: 'video', label: 'วิดีโอ' },
];

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim();

function blogImage(post: any): string {
  const sizes = post?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes;
  return (
    sizes?.full?.source_url ||
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    post?.uagb_featured_image_src?.full?.[0] ||
    post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    '/images/default-blog.jpg'
  );
}

const embeddedImage = (post: any, fallback: string): string =>
  post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallback;

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'เมื่อสักครู่';
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ชม.ที่แล้ว`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} วันที่แล้ว`;
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function TypeBadge({ type }: { type: MovementType }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white ${TYPE_META[type].badge}`}
    >
      {type === 'video' && <IoPlayCircle className="h-3.5 w-3.5" />}
      {TYPE_META[type].label}
    </span>
  );
}

// การ์ดใหญ่ (Hero) — ความเคลื่อนไหวล่าสุดสุด
function HeroCard({ item }: { item: MovementItem }) {
  return (
    <Link href={item.href} className="group block">
      <div className="relative overflow-hidden rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl md:flex md:h-[420px]">
        <div className="relative aspect-video overflow-hidden md:aspect-auto md:w-3/5">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <IoPlayCircle className="h-16 w-16 text-white/90" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center bg-white p-6 md:w-2/5 md:p-8">
          <div className="mb-3 flex items-center gap-3">
            <TypeBadge type={item.type} />
            <time className="text-sm text-gray-500">{timeAgo(item.date)}</time>
          </div>
          <h3 className="mb-3 text-2xl font-bold leading-snug text-gray-900 line-clamp-3">
            {item.title}
          </h3>
          {item.excerpt && (
            <p className="mb-5 text-sm leading-relaxed text-gray-600 line-clamp-3">{item.excerpt}</p>
          )}
          <span className="inline-flex items-center font-medium text-[#ff7834] transition-colors group-hover:text-[#e86b2a]">
            อ่านเพิ่มเติม
            <IoArrowForward className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// การ์ดเล็กในกริด
function GridCard({ item }: { item: MovementItem }) {
  return (
    <Link href={item.href} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-xs transition-shadow duration-300 hover:shadow-md">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute left-3 top-3">
            <TypeBadge type={item.type} />
          </span>
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <IoPlayCircle className="h-12 w-12 text-white/90" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-2 font-bold leading-snug text-gray-900 line-clamp-2">{item.title}</h3>
          {item.excerpt && (
            <p className="mb-3 text-sm text-gray-600 line-clamp-2">{item.excerpt}</p>
          )}
          <time className="mt-auto text-xs text-gray-400">{timeAgo(item.date)}</time>
        </div>
      </div>
    </Link>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-8">
      <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-lg md:flex md:h-[420px]">
        <div className="aspect-video bg-gray-200 md:aspect-auto md:w-3/5" />
        <div className="space-y-4 p-8 md:w-2/5">
          <div className="h-6 w-24 rounded-full bg-gray-200" />
          <div className="h-8 w-3/4 rounded-sm bg-gray-200" />
          <div className="h-20 rounded-sm bg-gray-200" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-white shadow-xs">
            <div className="aspect-video bg-gray-200" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-3/4 rounded-sm bg-gray-200" />
              <div className="h-4 rounded-sm bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LatestMovements() {
  const { data: blogData, error: blogError } = useSWR(BLOG_URL, fetcher, SWR_OPTIONS);
  const { data: newsData, error: newsError } = useSWR(NEWS_URL, fetcher, SWR_OPTIONS);
  const { data: videoData, error: videoError } = useSWR(VIDEO_URL, fetcher, SWR_OPTIONS);
  const [filter, setFilter] = useState<'all' | MovementType>('all');

  const items = useMemo<MovementItem[]>(() => {
    const blog: MovementItem[] = (blogData?.posts || []).map((p: any) => ({
      id: p.id,
      type: 'blog',
      title: stripHtml(p.title?.rendered),
      excerpt: stripHtml(p.uagb_excerpt),
      image: blogImage(p),
      date: p.date,
      href: `/sdnblog/${p.id}`,
    }));
    const news: MovementItem[] = (newsData?.posts || []).map((p: any) => ({
      id: p.id,
      type: 'news',
      title: stripHtml(p.title?.rendered),
      excerpt: stripHtml(p.excerpt?.rendered),
      image: embeddedImage(p, '/images/default-featured.png'),
      date: p.date,
      href: `/sdnpost/${p.id}`,
    }));
    const video: MovementItem[] = (videoData?.posts || []).map((p: any) => ({
      id: p.id,
      type: 'video',
      title: stripHtml(p.title?.rendered),
      excerpt: stripHtml(p.excerpt?.rendered),
      image: embeddedImage(p, '/images/default-video-thumbnail.jpg'),
      date: p.date,
      href: `/video/${p.id}`,
    }));

    return [...blog, ...news, ...video]
      .filter((i) => i.title && i.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [blogData, newsData, videoData]);

  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter);
  const isLoading = !blogData && !newsData && !videoData;
  const allFailed = blogError && newsError && videoError;

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-[#ff7834]">SDN</span>
            <span className="text-gray-900">THAILAND</span>
          </h2>
          <p className="mt-3 text-gray-600">เครือข่ายภาคประชาสังคม ลดการบริโภคเครื่องดื่มแอลกอฮอล์</p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#ff7834]" />
        </div>

        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {FILTERS.map(({ key, label }) => {
            const active = filter === key;
            const activeClass =
              key === 'all' ? 'bg-gray-900 text-white' : TYPE_META[key as MovementType].chip;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff7834]/50 focus-visible:ring-offset-2 ${
                  active ? activeClass : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <FeedSkeleton />
        ) : allFailed ? (
          <div className="py-12 text-center text-red-500">
            <p className="mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-[#ff7834] px-6 py-2 text-white transition-colors hover:bg-[#e86b2a] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff7834]/50 focus-visible:ring-offset-2"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-500">ไม่พบข้อมูลในหมวดนี้</div>
        ) : (
          <div className="space-y-8">
            <HeroCard item={filtered[0]} />
            {filtered.length > 1 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.slice(1, 7).map((item) => (
                  <GridCard key={`${item.type}-${item.id}`} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
