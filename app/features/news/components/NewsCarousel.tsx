'use client';

import { Suspense, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useNewsPosts } from '../hooks/useNewsPosts';
import NewsCard from './NewsCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

function NewsContent() {
  const { posts, isLoading, error } = useNewsPosts();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!posts?.length) {
    return <p className="text-gray-600">ไม่พบข่าวในขณะนี้</p>;
  }

  return (
    <div className="relative">
      <button 
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg text-orange-500 hover:bg-orange-50 transition-colors"
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {posts.map((post) => (
            <div key={post.id} className="min-w-0 flex-[0_0_100%] md:flex-[0_0_calc(33.333%-1rem)] px-1">
              <NewsCard post={post} />
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg text-orange-500 hover:bg-orange-50 transition-colors"
      >
        <FaChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function NewsCarousel() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Latest News
          </h2>
          <h2 className="text-3xl font-bold text-gray-900">ข่าวและกิจกรรมล่าสุด</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4"></div>
        </div>

        <Suspense fallback={<NewsContent />}>
          <NewsContent />
        </Suspense>

        <div className="text-center mt-8">
          <Link 
            href="/sdnpost" 
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300"
          >
            ดูข่าวทั้งหมด
            <FaChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}