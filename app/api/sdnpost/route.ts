//sdnpost/route.ts
import { NextResponse } from 'next/server'

const WP_API_URL = `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2` || 'https://blog.sdnthailand.com/wp-json/wp/v2'

interface Post {
  id: number
  title: { rendered: string }
  date: string
  content: { rendered: string }
  excerpt: { rendered: string }
  meta?: {
    post_views_count?: number
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      media_details?: {
        sizes?: {
          thumbnail?: { source_url: string }
          medium?: { source_url: string }
          large?: { source_url: string }
          full?: { source_url: string }
        }
      }
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
    author?: Array<{
      name: string
      avatar_urls?: {
        [key: string]: string
      }
    }>
  }
  featuredImage?: string
  viewCount?: number
}

interface PostsResponse {
  posts: Post[]
  totalPages: number
  total: number
}

export async function GET(request: Request): Promise<NextResponse<PostsResponse | { error: string }>> {
  console.log('WP_API_URL:', WP_API_URL)
  
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const per_page = searchParams.get('per_page') || '12'

  try {
    const response = await fetch(
      `${WP_API_URL}/posts?_embed&page=${page}&per_page=${per_page}`,
      { 
        next: { revalidate: 60 },
        headers: {
          'Accept': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }

    const posts = await response.json() as Post[]
    const totalPages = Number(response.headers.get('X-WP-TotalPages'))
    const total = Number(response.headers.get('X-WP-Total'))

    const postsWithMedia = await Promise.all(posts.map(async (post) => {
      try {
        const viewsResponse = await fetch(
          `${WP_API_URL}/post-views/views/post/${post.id}`,
          { next: { revalidate: 60 } }
        )
        
        const viewsData = viewsResponse.ok ? await viewsResponse.json() : null
        const viewCount = viewsData?.count || 0

        const featuredImage = 
          post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
          post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url ||
          post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
          '/images/default-featured.png'

        return {
          ...post,
          viewCount,
          featuredImage
        }
      } catch (error) {
        console.error(`Error fetching views for post ${post.id}:`, error)
        return {
          ...post,
          viewCount: 0,
          featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                        post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url ||
                        post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
                        '/images/default-featured.png'
        }
      }
    }))

    return NextResponse.json({
      posts: postsWithMedia,
      totalPages,
      total
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}