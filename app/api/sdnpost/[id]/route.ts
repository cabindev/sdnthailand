// app/api/sdnpost/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

const getPost = cache(async (id: string) => {
  const baseUrl = process.env.WORDPRESS_API_URL || 'https://sdnthailand.synology.me'
  
  const [postRes, views] = await Promise.all([
    fetch(`${baseUrl}/index.php?rest_route=/wp/v2/posts/${id}&_embed=true`),
    fetch(`${baseUrl}/index.php?rest_route=/post-views/views/post/${id}`)
      .then(r => r.json())
      .catch(() => ({ count: 0 }))
  ])

  // WordPress ตอบ 404 เมื่อไม่มีข่าว id นี้ ต้องแยกจาก error อื่น
  if (postRes.status === 404) return null
  if (!postRes.ok) throw new Error(`WordPress API error: ${postRes.status}`)

  const post = await postRes.json()
  return { ...post, viewCount: views.count || 0 }
})

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const post = await getPost(params.id)
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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