// app/api/sdnpost/related/[id]/route.ts
import { NextResponse } from 'next/server'

const WP_API_URL = 'https://blog.sdnthailand.com/wp-json/wp/v2'

interface RelatedPost {
  id: number
  title: { rendered: string }
  date: string
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ดึงโพสต์ทั้งหมด 4 โพสต์ล่าสุด
    const response = await fetch(
      `${WP_API_URL}/posts?_embed&per_page=4&exclude=${params.id}`,
      { 
        next: { revalidate: 60 },
        headers: {
          'Accept': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch related posts')
    }

    const posts = await response.json() as RelatedPost[]

    return NextResponse.json({
      success: true,
      posts: posts.slice(0, 3) // ส่งกลับเพียง 3 โพสต์
    })
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch related posts' 
      }, 
      { status: 500 }
    )
  }
}