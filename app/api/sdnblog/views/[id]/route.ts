// app/api/sdnblog/views/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const WP_API_URL = process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { success: false, error: 'Blog ID is required' },
      { status: 400 }
    )
  }

  try {
    // เปลี่ยน endpoint เป็น blog_post
    const response = await fetch(
      `${WP_API_URL}/wp-json/post-views/views/blog_post/${params.id}/increment`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to increment views')
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      count: data.count || 0
    })

  } catch (error) {
    console.error('Error incrementing views:', error)
    return NextResponse.json({
      success: true,
      count: 0
    })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { success: false, error: 'Blog ID is required' },
      { status: 400 }
    )
  }

  try {
    // เปลี่ยน endpoint เป็น blog_post
    const response = await fetch(
      `${WP_API_URL}/wp-json/post-views/views/blog_post/${params.id}`,
      {
        headers: {
          'Accept': 'application/json'
        },
        next: { revalidate: 60 }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch views')
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      count: data.count || 0
    })

  } catch (error) {
    console.error('Error fetching views:', error)
    return NextResponse.json({
      success: true,
      count: 0
    })
  }
}