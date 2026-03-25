// app/api/sdnpost/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

const getPost = cache(async (id: string) => {
  const baseUrl = process.env.WORDPRESS_API_URL || 'https://sdnthailand.synology.me'
  
  const [post, views] = await Promise.all([
    fetch(`${baseUrl}/index.php?rest_route=/wp/v2/posts/${id}&_embed=true`).then(r => r.json()),
    fetch(`${baseUrl}/index.php?rest_route=/post-views/views/post/${id}`).then(r => r.json().catch(() => ({ count: 0 })))
  ])

  return { ...post, viewCount: views.count || 0 }
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await getPost(params.id)
    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const baseUrl = process.env.WORDPRESS_API_URL || 'https://sdnthailand.synology.me'
    const response = await fetch(
      `${baseUrl}/index.php?rest_route=/post-views/views/post/${params.id}/increment`,
      {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      }
    )
    const data = await response.json()
    return NextResponse.json({ success: true, count: data.count || 0 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to increment views' },
      { status: 500 }
    )
  }
}