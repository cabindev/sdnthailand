import { NextRequest, NextResponse } from 'next/server'

// Interface สำหรับ Response
interface ViewResponse {
  success: boolean;
  count?: number;
  error?: string;
}

// Interface สำหรับ WordPress API Response
interface WordPressViewResponse {
  success: boolean;
  count?: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ViewResponse>> {
  // ตรวจสอบว่ามี ID หรือไม่
  if (!params.id) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Post ID is required' 
      },
      { status: 400 }
    )
  }

  try {
    // กำหนด base URL จาก environment variable หรือใช้ค่าเริ่มต้น
    const baseUrl = process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com'
    
    // Log สำหรับ debug
    console.log('Incrementing views for post:', params.id)
    console.log('API URL:', `${baseUrl}/wp-json/post-views/views/post/${params.id}/increment`)

    // เรียก WordPress API
    const response = await fetch(
      `${baseUrl}/wp-json/post-views/views/post/${params.id}/increment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        next: { revalidate: 0 } // ไม่ cache response
      }
    )

    // ตรวจสอบ response status
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`API returned ${response.status}: ${errorText}`)
    }

    // แปลง response เป็น JSON
    const data: WordPressViewResponse = await response.json()

    // ส่งค่ากลับ
    return NextResponse.json({
      success: true,
      count: data.count || 0
    })

  } catch (error) {
    // จัดการ error
    console.error('Error incrementing views:', error)

    // ถ้าเป็น Error object
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to increment views: ${errorMessage}`
      },
      { status: 500 }
    )
  }
}


// Interfaces for WordPress API Response
interface WordPressPost {
  id: number
  date: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
    }>
    author?: Array<{
      name: string
      avatar_urls: {
        [key: string]: string
      }
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
    }>>
  }
  viewCount?: number
}

interface PostResponse {
  success: boolean
  data?: WordPressPost
  error?: string
}

// GET method สำหรับดึงยอดวิว (ถ้าต้องการ)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<PostResponse>> {
  // ตรวจสอบว่ามี ID หรือไม่
  if (!params.id) {
    return NextResponse.json(
      {
        success: false,
        error: 'Post ID is required'
      },
      { status: 400 }
    )
  }

  try {
    // กำหนด base URL จาก environment variable หรือใช้ค่าเริ่มต้น
    const baseUrl = process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com'
    
    // ดึงข้อมูลโพสต์
    const postResponse = await fetch(
      `${baseUrl}/wp-json/wp/v2/posts/${params.id}?_embed`,
      {
        headers: {
          'Accept': 'application/json'
        },
        next: { revalidate: 60 } // cache 60 วินาที
      }
    )

    if (!postResponse.ok) {
      const errorText = await postResponse.text()
      throw new Error(`Post API returned ${postResponse.status}: ${errorText}`)
    }

    const post: WordPressPost = await postResponse.json()

    // ดึงจำนวนวิว
    const viewResponse = await fetch(
      `${baseUrl}/wp-json/post-views/views/post/${params.id}`,
      {
        headers: {
          'Accept': 'application/json'
        },
        next: { revalidate: 60 }
      }
    )

    if (viewResponse.ok) {
      const viewData = await viewResponse.json()
      post.viewCount = viewData.count || 0
    }

    return NextResponse.json({
      success: true,
      data: post
    })

  } catch (error) {
    console.error('Error fetching post:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch post: ${errorMessage}`
      },
      { status: 500 }
    )
  }
}
