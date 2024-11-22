// app/api/sdnblog/route.ts
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const per_page = searchParams.get('per_page') || '9'

  try {
    const response = await axios.get('https://blog.sdnthailand.com/wp-json/wp/v2/blog_post', {
      params: {
        page,
        per_page,
        status: 'publish',
        _embed: 'wp:featuredmedia,author,wp:term'  // ระบุ embed ที่ต้องการ
      }
    })

    // แปลงข้อมูลและเพิ่ม featuredImage
    const posts = response.data.map((post: any) => ({
      ...post,
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
    }))

    return NextResponse.json({
      posts,
      totalPages: Number(response.headers['x-wp-totalpages']),
      total: Number(response.headers['x-wp-total'])
    })

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data)
    }
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}