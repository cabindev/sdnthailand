// app/api/sdnblog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cache } from 'react'

const WP_API_URL = 'https://blog.sdnthailand.com/wp-json/wp/v2'

export const dynamic = 'force-dynamic'

const getPost = cache(async (id: string) => {
  const res = await fetch(
    `${WP_API_URL}/blog_post/${id}?_embed=wp:featuredmedia,wp:term,author`,
    { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    }
  )
  return res.json()
})

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
    const post = await getPost(params.id)
    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}