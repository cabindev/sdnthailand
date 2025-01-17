// app/api/sdnblog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getPost,preload } from '@/app/utils/get-post'

export const dynamic = 'force-dynamic' // ทำให้ route เป็น dynamic เสมอ

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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
    // Preload data
    preload(params.id)
    
    // Get cached data
    const post = await getPost(params.id)

    // Revalidate both page and layout
    revalidatePath(`/sdnblog/${params.id}`, 'layout')
    revalidatePath('/sdnblog', 'layout')

    return NextResponse.json(
      {
        success: true,
        data: post
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )

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