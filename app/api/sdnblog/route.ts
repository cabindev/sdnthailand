// app/api/sdnblog/route.ts
import { NextResponse } from 'next/server'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

const getPosts = cache(async (page = '1', per_page = '12') => {
  // เปลี่ยนจาก WP standard API เป็น custom endpoint
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com'}/wp-json/sdn/v1/blog-posts?page=${page}&per_page=${per_page}`,
    {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    }
  )
  
  // ตรวจสอบสถานะการตอบกลับ
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const jsonData = await res.json();
  
  // ปรับให้เข้ากับรูปแบบที่ต้องการใน frontend
  return {
    posts: jsonData.posts,
    totalPages: jsonData.totalPages,
    total: jsonData.total
  }
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const per_page = searchParams.get('per_page') || '12'

  try {
    const data = await getPosts(page, per_page)
    return NextResponse.json({
      success: true,
      ...data
    })
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}