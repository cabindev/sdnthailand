// app/api/sdnblog/route.ts 
import { NextResponse } from 'next/server'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

const getPosts = cache(async (page = '1', per_page = '4') => {
  const res = await fetch(
    `https://blog.sdnthailand.com/wp-json/wp/v2/blog_post?page=${page}&per_page=${per_page}&status=publish&_embed=true`,
    {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    }
  )
  return {
    posts: await res.json(),
    totalPages: res.headers.get('x-wp-totalpages'),
    total: res.headers.get('x-wp-total')
  }
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const per_page = searchParams.get('per_page') || '4'

  try {
    const data = await getPosts(page, per_page)
    return NextResponse.json({
      success: true,
      ...data
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}