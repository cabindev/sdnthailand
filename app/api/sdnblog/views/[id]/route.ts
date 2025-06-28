// app/api/sdnblog/views/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const baseUrl = process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com'

// ฟังก์ชันเพิ่มยอดวิว
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
    // เรียก API เพิ่มยอดวิว
    const response = await fetch(
      `${baseUrl}/wp-json/pvc/v1/increase/${params.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to increment views: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      count: data.views
    })

  } catch (error) {
    console.error('Error incrementing views:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to increment views' },
      { status: 500 }
    )
  }
}

// ฟังก์ชันดึงยอดวิว
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
    const response = await fetch(
      `${baseUrl}/wp-json/pvc/v1/views/${params.id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch views: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      count: data.views
    })

  } catch (error) {
    console.error('Error fetching views:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch views' },
      { status: 500 }
    )
  }
}