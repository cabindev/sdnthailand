// app/api/sdn-latest/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // ไม่ cache

const getLatestPosts = async (page = '1', per_page = '4') => {
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com'}/wp-json/sdn/v1/latest-posts?page=${page}&per_page=${per_page}`,
    {
      cache: 'no-store', // ไม่ cache เพื่อให้ได้ข้อมูลล่าสุดเสมอ
      headers: { 'Accept': 'application/json' }
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status}`)
  }

  return await res.json()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  try {
    const data = await getLatestPosts(
      searchParams.get('page') || '1',
      searchParams.get('per_page') || '4'
    )
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}