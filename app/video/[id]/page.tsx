// app/video/[id]/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import VideoDetail from '../components/VideoDetail'
import LoadingGrid from '../components/LoadingGrid'

interface Props {
  params: Promise<{ id: string }>
}

async function getVideo(id: string) {
    try {
      // เรียกใช้ API โดยตรง
      const response = await fetch(`${process.env.WORDPRESS_API_URL || 'https://sdnthailand.synology.me'}/index.php?rest_route=/wp/v2/videos/${id}&_embed=true`, {
        next: { revalidate: 60 }
      });
  
      // WordPress ตอบ 404 เมื่อไม่มีวิดีโอ id นี้ ต้องแยกจาก error อื่น
      if (response.status === 404) {
        return null;
      }
  
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  }
  
  export default async function Page(props: Props) {
    const params = await props.params;
    let video;
  
    try {
      if (!params.id) {
        throw new Error('Video ID is required');
      }
  
      video = await getVideo(params.id);
  
    } catch (error) {
      return (
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto bg-red-50 p-4 rounded-lg">
            <p className="text-red-500 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ไม่สามารถโหลดวิดีโอได้ กรุณาลองใหม่อีกครั้ง
            </p>
            <Link 
              href="/video"
              className="mt-4 inline-block text-[#ff7834] hover:text-[#e86b2a]"
            >
              กลับไปหน้าวิดีโอ
            </Link>
          </div>
        </div>
      );
    }
  
    // ต้องเรียกนอก try เพราะ notFound() ทำงานด้วยการ throw
    if (!video) notFound();
  
    return (
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<LoadingGrid />}>
          <VideoDetail video={video} />
        </Suspense>
      </main>
    );
  }