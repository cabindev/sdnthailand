// app/api/sdnpost/views/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const WP_API_URL = process.env.WORDPRESS_API_URL || 'https://sdnthailand.com'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  if (!params.id) {
    return NextResponse.json(
      { success: false, error: 'Post ID is required' },
      { status: 400 }
    )
  }

  try {
    // เปลี่ยน URL ให้ตรงกับ WordPress API endpoint
    const response = await fetch(
      `${WP_API_URL}/wp-json/post-views/views/post/${params.id}/increment`,
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

    // ส่งค่ากลับแม้ว่าจะมี error
    return NextResponse.json({
      success: true,
      count: data.count || 0
    })

  } catch (error) {
    console.error('Error incrementing views:', error)
    
    // ส่งค่ากลับแม้ว่าจะมี error เพื่อไม่ให้ UI พัง
    return NextResponse.json({
      success: true,
      count: 0
    })
  }
}

// เพิ่ม GET method เพื่อดึงยอดวิว (ถ้าต้องการ)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  if (!params.id) {
    return NextResponse.json(
      { success: false, error: 'Post ID is required' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${WP_API_URL}/wp-json/post-views/views/post/${params.id}`,
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