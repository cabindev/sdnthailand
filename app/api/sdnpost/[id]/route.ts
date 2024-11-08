//app/api/sdnpost/[id]/route.ts
import { NextResponse } from 'next/server'

const WP_API_URL = 'https://sdnthailand.com/wp-json/wp/v2'
const POST_VIEWS_API = 'https://sdnthailand.com/wp-json/post-views/views/post'

interface Post {
  id: number
  title: { rendered: string }
  date: string
  content: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
    }>
    'wp:term'?: Array<Array<{
      name: string
    }>>
    author?: Array<{
      name: string
    }>
  }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
  ): Promise<NextResponse> {
    try {
      // เพิ่มยอดวิวใน WordPress
      const response = await fetch(
        `${WP_API_URL}/post-views/views/post/${params.id}/increment`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          next: { revalidate: 0 } // ไม่ cache
        }
      )
  
      if (!response.ok) {
        throw new Error('Failed to increment views')
      }
  
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error incrementing views:', error)
      return NextResponse.json(
        { error: 'Failed to increment views' },
        { status: 500 }
      )
    }
  }
  
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // ดึงข้อมูลโพสต์และยอดวิวพร้อมกัน
    const [postResponse, viewsResponse] = await Promise.all([
      fetch(
        `${WP_API_URL}/posts/${params.id}?_embed`,
        { next: { revalidate: 60 } }
      ),
      fetch(
        `${POST_VIEWS_API}/${params.id}`,
        { next: { revalidate: 60 } }
      )
    ])

    if (!postResponse.ok) {
      throw new Error('Failed to fetch post')
    }

    const post = await postResponse.json() as Post
    let viewCount = 0

    if (viewsResponse.ok) {
      const viewsData = await viewsResponse.json()
      viewCount = parseInt(viewsData.count) || 0 // เปลี่ยนจาก views เป็น count
    }

    return NextResponse.json({
      ...post,
      viewCount
    })

  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}