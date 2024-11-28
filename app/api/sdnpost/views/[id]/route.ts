// app/api/sdnpost/views/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ViewResponse } from '@/app/sdnpost/types'

const baseUrl = process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ViewResponse>> {
  if (!params.id) {
    return NextResponse.json(
      { success: false, error: 'Post ID is required' },
      { status: 400 }
    )
  }

  try {
    // Log request details
    console.log('POST Views - Post ID:', params.id)
    console.log('POST Views - Base URL:', baseUrl)

    // First get current views
    const currentViews = await getCurrentViews(params.id)

    // Increment views using Post Views Counter API
    const response = await fetch(
      `${baseUrl}/wp-json/wp/v2/posts/${params.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          meta: {
            'post-views-counter': currentViews + 1
          }
        }),
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Views API Error:', errorText)
      // Return current views if update fails
      return NextResponse.json({
        success: true,
        count: currentViews
      })
    }

    const data = await response.json()
    const newCount = data.meta?.['post-views-counter'] || currentViews + 1

    console.log('Successfully updated views:', newCount)

    return NextResponse.json({
      success: true,
      count: newCount
    })

  } catch (error) {
    console.error('Error incrementing views:', error)
    // Return current views in case of error
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
      { success: false, error: 'Post ID is required' },
      { status: 400 }
    )
  }

  try {
    console.log('GET Views - Post ID:', params.id)
    const count = await getCurrentViews(params.id)
    
    return NextResponse.json({
      success: true,
      count
    })

  } catch (error) {
    console.error('Error getting views:', error)
    return NextResponse.json({
      success: true,
      count: 0
    })
  }
}

async function getCurrentViews(postId: string): Promise<number> {
  try {
    const response = await fetch(
      `${baseUrl}/wp-json/wp/v2/posts/${postId}`,
      {
        headers: {
          'Accept': 'application/json'
        },
        next: { revalidate: 60 }
      }
    )

    if (!response.ok) {
      console.error('Error fetching post:', await response.text())
      return 0
    }

    const post = await response.json()
    return post['post-views-counter'] || post.meta?.['post-views-counter'] || 0

  } catch (error) {
    console.error('Error getting current views:', error)
    return 0
  }
}

// Helper function to validate view count
function validateViewCount(count: any): number {
  const parsed = parseInt(count)
  return isNaN(parsed) ? 0 : parsed
}