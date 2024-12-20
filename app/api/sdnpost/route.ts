// app/api/sdnpost/route.ts
import { NextResponse } from 'next/server'
import axios from 'axios'

const WP_API_URL = process.env.WORDPRESS_API_URL 
  ? `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2`
  : 'https://blog.sdnthailand.com/wp-json/wp/v2';

// เพิ่ม cache config
export const revalidate = 60; // revalidate every 60 seconds

export async function GET(request: Request) {
  console.log('Using WP_API_URL:', WP_API_URL)
  
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const per_page = searchParams.get('per_page') || '12'

  try {
    const response = await axios.get(`${WP_API_URL}/posts`, {
      params: {
        _embed: true,
        page,
        per_page,
        orderby: 'date',
        order: 'desc'
      },
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })

    const posts = Array.isArray(response.data) 
      ? response.data.map((post) => ({
          ...post,
          featuredImage: 
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url ||
            post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
            '/images/default-featured.png'
        }))
      : [];

    return NextResponse.json({
      posts,
      totalPages: Number(response.headers['x-wp-totalpages']),
      total: Number(response.headers['x-wp-total'])
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}