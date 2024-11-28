// app/api/sdnblog/views/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ViewResponse } from '@/app/sdnblog/types'

const baseUrl = process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ViewResponse>> {
  if (!params.id) {
    return NextResponse.json(
      { success: false, error: 'Blog ID is required' },
      { status: 400 }
    )
  }

  try {
    console.log('Incrementing views for blog post:', params.id)
    
    // ดึงยอดวิวปัจจุบันก่อน
    const currentViews = await getCurrentViews(params.id)
    
    // เพิ่มยอดวิว
    const response = await fetch(
      `${baseUrl}/wp-json/pvc/v1/increase/${params.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text() 
      console.error('Views API Error:', errorText)
      // ส่งค่าปัจจุบันกลับไปถ้าเพิ่มไม่สำเร็จ
      return NextResponse.json({
        success: true,
        count: currentViews 
      })
    }

    const data = await response.json()
    console.log('Views updated successfully:', data)

    return NextResponse.json({
      success: true,
      count: parseInt(data.views) || currentViews + 1
    })

  } catch (error) {
    console.error('Error incrementing views:', error)
    const currentViews = await getCurrentViews(params.id)
    return NextResponse.json({
      success: true,
      count: currentViews
    })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ViewResponse>> {
  if (!params.id) {
    return NextResponse.json(
      { success: false, error: 'Blog ID is required' },
      { status: 400 }
    )
  }

  try {
    console.log('Fetching views for blog post:', params.id)

    const response = await fetch(
      `${baseUrl}/wp-json/pvc/v1/views/${params.id}`,
      {
        headers: {
          'Accept': 'application/json'
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to fetch views:', errorText)
      return NextResponse.json({
        success: true,
        count: 0
      })
    }

    const data = await response.json()
    console.log('Views fetched successfully:', data)

    return NextResponse.json({
      success: true,
      count: parseInt(data.views || '0')
    })

  } catch (error) {
    console.error('Error fetching views:', error)
    return NextResponse.json({
      success: true,
      count: 0
    })
  }
}

// Helper function
async function getCurrentViews(postId: string): Promise<number> {
  try {
    const response = await fetch(
      `${baseUrl}/wp-json/pvc/v1/views/${postId}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      console.error('Failed to get current views')
      return 0
    }

    const data = await response.json()
    return parseInt(data.views || '0')

  } catch (error) {
    console.error('Error getting current views:', error)
    return 0
  }
}